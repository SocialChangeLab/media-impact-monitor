import { cn } from "@/utility/classNames";

function RoundedColorPill({
	color,
	className,
}: { color: string; className?: string }) {
	return (
		<span
			className={cn(
				"size-4 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] bg-grayDark",
				className,
			)}
			style={{ backgroundColor: color }}
			aria-hidden="true"
		/>
	);
}

export default RoundedColorPill;
