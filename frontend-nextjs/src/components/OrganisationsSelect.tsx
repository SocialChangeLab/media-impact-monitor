"use client";

import {
	Check,
	ChevronsUpDown,
	HeartHandshakeIcon,
	Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import { cn } from "@/utility/classNames";
import type { EventOrganizerSlugType } from "@/utility/eventsUtil";
import useEvents from "@/utility/useEvents";
import { endOfToday, parse, startOfDay } from "date-fns";
import { useMemo, useState } from "react";
import RoundedColorPill from "./RoundedColorPill";

export function OrganisationsSelect({
	className,
	multiple = true,
}: {
	className?: string;
	multiple?: boolean;
}) {
	const {
		isPending,
		data: { organisations: allOrgsObjects },
	} = useEvents({
		from: startOfDay(parse("01-01-2020", "dd-MM-yyyy", new Date())),
		to: endOfToday(),
	});
	const [open, setOpen] = useState(false);
	const { organizerSlugs, setOrganizers } = useFiltersStore(
		({ organizers, setOrganizers }) => ({
			organizerSlugs: organizers,
			setOrganizers,
		}),
	);

	const orgSlugs = useMemo(
		() => allOrgsObjects.map(({ slug }) => slug),
		[allOrgsObjects],
	);
	const firstOrg = useMemo(
		() => allOrgsObjects.find(({ slug }) => slug === organizerSlugs[0]),
		[organizerSlugs, allOrgsObjects],
	);
	const selectedColors = useMemo(() => {
		const colors = Array.from(
			organizerSlugs.reduce((acc, orgSlug) => {
				const org = allOrgsObjects.find(({ slug }) => slug === orgSlug);
				if (!org) return acc;
				acc.add(org.color);
				return acc;
			}, new Set<string>()),
		);
		return colors;
	}, [organizerSlugs, allOrgsObjects]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn(
						"w-fit justify-between rounded-none max-md:gap-0",
						"hover:bg-grayLight hover:text-fg border-grayMed",
						"group transition-colors max-lg:px-2 max-lg:py-1",
						isPending && "text-grayDark",
						className,
					)}
				>
					{(isPending || organizerSlugs.length === 0) && (
						<>
							<div className="flex items-center gap-3">
								<HeartHandshakeIcon className="shrink-0 text-grayDark size-5 lg:size-6" />
								<span className="hidden md:inline text-sm lg:text-base">
									Select organisations
								</span>
							</div>
							<Loader2
								className={cn(
									"w-0 h-3 lg:h-4 animate-spin duration-1000 text-grayMed transition-all opacity-0",
									"overflow-clip",
									isPending && "opacity-100 w-3 lg:w-4",
								)}
								aria-hidden="true"
							/>
						</>
					)}
					{!isPending && organizerSlugs.length === 1 && (
						<span className="grid grid-cols-[auto_1fr] gap-2 items-center">
							<RoundedColorPill
								color={firstOrg?.color ?? "transparent"}
								className="shrink-0"
							/>
							<span className="truncate">{firstOrg?.name}</span>
						</span>
					)}
					{!isPending && organizerSlugs.length > 1 && (
						<span className="flex items-center">
							{selectedColors.map((color) => {
								return (
									<RoundedColorPill
										key={color}
										color={color}
										className="-mr-2 xs:-mr-1 ring-2 ring-bg group-hover:ring-grayLight"
									/>
								);
							})}
						</span>
					)}
					<ChevronsUpDown
						size={16}
						className="-mt-1 ml-2 shrink-0 opacity-50"
					/>
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-fit max-w-96 p-0 max-h-[70vh] overflow-y-auto z-[70]"
				align="start"
			>
				{!isPending && (
					<Command>
						<CommandInput
							placeholder="Search..."
							className="focus-visible:ring-inset focus-visible:ring-offset-0 outline-offset-0 border-0 border-l"
						/>
						<CommandEmpty>No organisation found.</CommandEmpty>
						<CommandGroup>
							{multiple && (
								<CommandItem
									value="all"
									onSelect={() => {
										const newSlugs =
											organizerSlugs.length === allOrgsObjects.length
												? []
												: orgSlugs;
										setOrganizers(newSlugs);
									}}
								>
									Toggle all/none
								</CommandItem>
							)}
							{allOrgsObjects.map((org) => (
								<CommandItem
									key={org.slug}
									value={org.slug}
									onSelect={(currentValue: string) => {
										const alreadySelected = organizerSlugs.includes(
											currentValue as EventOrganizerSlugType,
										);
										const newValues = alreadySelected
											? organizerSlugs.filter((slug) => slug !== currentValue)
											: [...organizerSlugs, org.slug];
										const uniqueValues = Array.from(new Set(newValues));
										setOrganizers(multiple ? uniqueValues : [org.slug]);
										!multiple && setOpen(false);
									}}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4 shrink-0",
											organizerSlugs.find((o) => o === org.slug)
												? "opacity-100"
												: "opacity-0",
										)}
									/>
									<span className="grid grid-cols-[auto_1fr] gap-2 items-center">
										<RoundedColorPill color={org.color} className="shrink-0" />
										<span className="truncate">{org.name}</span>
									</span>
								</CommandItem>
							))}
						</CommandGroup>
					</Command>
				)}
			</PopoverContent>
		</Popover>
	);
}
