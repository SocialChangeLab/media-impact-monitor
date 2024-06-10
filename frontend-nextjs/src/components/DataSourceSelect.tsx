import derekoFavicon from "@/assets/images/dereko-favicon.png";
import geniosFavicon from "@/assets/images/genios-favicon.png";
import mediacloudFavicon from "@/assets/images/mediacloud-favicon.png";
import nexisFavicon from "@/assets/images/nexis-favicon.png";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronsUpDownIcon, InfoIcon, LinkIcon } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

const options = [
	{
		name: "Media Cloud",
		value: "mediacloud",
		image: mediacloudFavicon,
		description:
			"Global media coverage to understand the content, context, and impact of news stories.",
		links: [
			{
				label: "Official Website",
				href: "https://www.mediacloud.org/",
			},
		],
	},
	{
		name: "Genios",
		value: "genios",
		image: geniosFavicon,
		description:
			"Text-searchable archives of newspapers and other media content for numerous organizations.",
		links: [
			{
				label: "Official Website",
				href: "https://www.genios.de/",
			},
			{
				label: "Press Page",
				href: "https://www.genios.de/browse/Alle/Presse",
			},
		],
	},
	{
		name: "Nexis",
		value: "nexis",
		image: nexisFavicon,
		description:
			"Extensive global news, business, and legal information for research and analytics.",
		links: [
			{
				label: "Official Website",
				href: "https://www.lexisnexis.com/en-us/professional/research/nexis.page",
			},
		],
	},
	{
		name: "DeReKo (Deutsches Referenzkorpus)",
		value: "dereko",
		image: derekoFavicon,
		description:
			"Modern German texts, used for linguistic research and analysis.",
		links: [
			{
				label: "Official Website",
				href: "https://www.corpusfinder.ugent.be/corpus/69",
			},
		],
	},
];
const optionsMap = new Map(options.map((o) => [o.value, o]));

export default function MediaSourceSelect() {
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const selectedValue = useMemo(
		() => (selectedId && optionsMap.get(selectedId)) || undefined,
		[selectedId],
	);
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					className="w-fit justify-between"
				>
					<div className="flex items-center gap-2">
						{selectedValue && (
							<Image
								src={selectedValue.image}
								alt={selectedValue.name}
								width={20}
								height={20}
							/>
						)}
						<span>{selectedValue?.name || "Select data source"}</span>
					</div>
					<ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-full max-w-96 p-0 rounded-none"
				align="start"
			>
				<Command>
					<CommandList>
						<CommandGroup>
							{options.map((option) => (
								<CommandItem
									key={option.value}
									className="flex justify-between items-start"
								>
									<TooltipProvider>
										<button
											className="flex items-start gap-2 text-left grow focusable focus-visible:bg-bg"
											type="button"
											onClick={() => setSelectedId(option.value)}
										>
											<Image
												src={option.image}
												alt={option.name}
												width={20}
												height={20}
												className="mt-0.5"
											/>
											<div>
												<div className="font-medium">{option.name}</div>
												<p className="text-sm text-grayDark">
													{option.description}
												</p>
											</div>
										</button>
										{option.links.length > 0 && (
											<Tooltip>
												<TooltipTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														className="focus-visible:bg-bg -mt-1"
													>
														<InfoIcon className="h-4 w-4" />
													</Button>
												</TooltipTrigger>
												<TooltipContent className="w-fit space-y-2 rounded-none flex flex-col gap-2">
													{option.links.map((link) => (
														<a
															href={link.href}
															target="_blank"
															rel="noopener noreferrer"
															key={link.href}
															className="flex items-center gap-2"
														>
															<LinkIcon className="h-4 w-4 text-grayDark" />
															<span>{link.label}</span>
														</a>
													))}
												</TooltipContent>
											</Tooltip>
										)}
									</TooltipProvider>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
