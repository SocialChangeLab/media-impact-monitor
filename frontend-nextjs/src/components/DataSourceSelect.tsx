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
import { useFiltersStore } from "@/providers/FiltersStoreProvider";
import type { MediaSourceType } from "@/stores/filtersStore";
import {
	ChevronsUpDownIcon,
	GlobeIcon,
	InfoIcon,
	LinkIcon,
	type LucideIcon,
	NewspaperIcon,
	SearchIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

type OptionType = {
	name: string;
	value: MediaSourceType;
	Icon: LucideIcon;
	description: string;
	links: {
		label: string;
		href: string;
	}[];
};

const options: OptionType[] = [
	{
		name: "Online News",
		value: "news_online",
		Icon: GlobeIcon,
		description:
			"Online news articles and media from Media Cloud, a global media coverage to understand the content, context, and impact of news stories.",
		links: [
			{
				label: "Official Website",
				href: "https://www.mediacloud.org/",
			},
		],
	},
	{
		name: "Print News",
		value: "news_print",
		Icon: NewspaperIcon,
		description:
			"Print news from Genios, text-searchable archives of newspapers and other media content for numerous organizations.",
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
		name: "Google News",
		value: "web_google",
		Icon: SearchIcon,
		description:
			"Extensive global news by Google, business, and legal information for research and analytics.",
		links: [
			{
				label: "Official Website",
				href: "https://www.lexisnexis.com/en-us/professional/research/nexis.page",
			},
		],
	},
];
const optionsMap = new Map(options.map((o) => [o.value, o]));

export default function MediaSourceSelect() {
	const { mediaSource, setMediaSource } = useFiltersStore(
		({ mediaSource, setMediaSource }) => ({
			mediaSource,
			setMediaSource,
		}),
	);
	const [isOpened, setIsOpened] = useState(false);
	const selectedValue = useMemo(
		() => (mediaSource && optionsMap.get(mediaSource)) || undefined,
		[mediaSource],
	);
	return (
		<Popover open={isOpened} onOpenChange={setIsOpened}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					className="w-fit justify-between"
				>
					<div className="flex items-center gap-3">
						{selectedValue && (
							<selectedValue.Icon
								size={20}
								className="mt-0 shrink-0 text-grayDark"
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
											className="flex items-start gap-3 text-left grow focusable focus-visible:bg-bg"
											type="button"
											onClick={() => {
												setMediaSource(option.value);
												setIsOpened(false);
											}}
										>
											<option.Icon
												size={20}
												className="mt-0.5 shrink-0 text-grayDark"
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
