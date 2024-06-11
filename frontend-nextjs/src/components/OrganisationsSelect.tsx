"use client";

import { Check, ChevronsUpDown } from "lucide-react";

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
import { cn } from "@/utility/classNames";
import type { OrganisationType } from "@/utility/eventsUtil";
import useEvents from "@/utility/useEvents";
import { endOfToday, parse, startOfDay } from "date-fns";
import { useMemo, useState } from "react";
import RoundedColorPill from "./RoundedColorPill";

export function OrganisationsSelect({
	onChange = () => undefined,
	className,
}: {
	onChange?: (values: OrganisationType["name"][]) => void;
	className?: string;
}) {
	const {
		data: { organisations },
	} = useEvents({
		from: startOfDay(parse("01-01-2020", "dd-MM-yyyy", new Date())),
		to: endOfToday(),
	});
	const [open, setOpen] = useState(false);
	const [selectedOrgs, setSelectedOrgs] = useState<OrganisationType["name"][]>(
		organisations.reduce(
			(acc, org) => (org.isMain ? acc.concat([org.name]) : acc),
			[] as string[],
		),
	);
	const orgNames = useMemo(
		() => organisations.map((o) => o.name),
		[organisations],
	);
	const firstOrg = useMemo(
		() => organisations.find((o) => o.name === selectedOrgs[0]),
		[selectedOrgs, organisations],
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn(
						"w-fit justify-between rounded-none h-[38px]",
						"hover:bg-grayLight hover:text-fg border-grayMed",
						"group",
						className,
					)}
				>
					{selectedOrgs.length === 0 && "Select organisations"}
					{selectedOrgs.length === 1 && (
						<span className="grid grid-cols-[auto_1fr] gap-2 items-center">
							<RoundedColorPill
								color={firstOrg?.color ?? "transparent"}
								className="shrink-0"
							/>
							<span className="truncate">{firstOrg?.name}</span>
						</span>
					)}
					{selectedOrgs.length > 1 && (
						<span className="flex items-center">
							{Array.from(
								selectedOrgs.reduce((acc, orgName) => {
									const org = organisations.find((o) => o.name === orgName);
									if (!org) return acc;
									acc.add(org.color);
									return acc;
								}, new Set<string>()),
							).map((color) => {
								return (
									<RoundedColorPill
										key={color}
										color={color}
										className="-mr-1 ring-2 ring-bg group-hover:ring-grayLight"
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
				className="w-fit max-w-96 p-0 max-h-[70vh] overflow-y-auto"
				align="start"
			>
				<Command>
					<CommandInput
						placeholder="Search..."
						className="focus-visible:ring-inset focus-visible:ring-offset-0 outline-offset-0 border-0 border-l"
					/>
					<CommandEmpty>No organisation found.</CommandEmpty>
					<CommandGroup>
						<CommandItem
							value="all"
							onSelect={() => {
								const newValues =
									selectedOrgs.length === organisations.length ? [] : orgNames;
								setSelectedOrgs(newValues);
								onChange(newValues);
							}}
						>
							Toggle all/none
						</CommandItem>
						{organisations.map((org) => (
							<CommandItem
								key={org.name}
								value={org.name}
								onSelect={(currentValue: OrganisationType["name"]) => {
									const newValues = selectedOrgs.find(
										(o) => o.toLowerCase() === currentValue.toLowerCase(),
									)
										? selectedOrgs.filter(
												(o) => o.toLowerCase() !== currentValue.toLowerCase(),
											)
										: [...selectedOrgs, org.name];
									const uniqueValues = Array.from(new Set(newValues));
									setSelectedOrgs(uniqueValues);
									onChange(uniqueValues);
								}}
							>
								<Check
									className={cn(
										"mr-2 h-4 w-4 shrink-0",
										selectedOrgs.find((o) => o === org.name)
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
			</PopoverContent>
		</Popover>
	);
}
