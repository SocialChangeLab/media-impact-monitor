"use client";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "./command";
import Icon from "./icon";

export default function CommandDemo() {
	return (
		<div className="w-screen h-screen relative flex justify-center items-center p-8">
			<div className="border border-dashed border-grayLight p-8 pt-6 rounded-lg bg-pattern-soft grid grid-cols-1 gap-8">
				<Command className="rounded-lg border shadow-md">
					<CommandInput placeholder="Search..." />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup heading="Suggestions">
							<CommandItem>
								<Icon
									name="Calendar"
									size="1.25rem"
									className="text-grayDark"
								/>
								<span>Calendar</span>
							</CommandItem>
							<CommandItem>
								<Icon name="Smile" size="1.25rem" className="text-grayDark" />
								<span>Search Emoji</span>
							</CommandItem>
						</CommandGroup>
						<CommandSeparator />
						<CommandGroup heading="Settings">
							<CommandItem>
								<Icon name="User" size="1.25rem" className="text-grayDark" />
								<span>Profile</span>
								<CommandShortcut>⌘P</CommandShortcut>
							</CommandItem>
							<CommandItem>
								<Icon name="Mail" size="1.25rem" className="text-grayDark" />
								<span>Mail</span>
								<CommandShortcut>⌘B</CommandShortcut>
							</CommandItem>
							<CommandItem>
								<Icon
									name="Settings"
									size="1.25rem"
									className="text-grayDark"
								/>
								<span>Settings</span>
								<CommandShortcut>⌘S</CommandShortcut>
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
			</div>
		</div>
	);
}
