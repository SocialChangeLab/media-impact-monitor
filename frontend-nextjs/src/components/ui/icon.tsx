import { type LucideProps, icons } from "lucide-react";

const Icon = ({
	name,
	...props
}: LucideProps & {
	name: keyof typeof icons;
}) => {
	const LucideIcon = icons[name];

	return <LucideIcon {...props} />;
};

export default Icon;
