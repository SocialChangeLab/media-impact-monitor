import { Combobox } from "./combobox";
import Icon from "./icon";

const fruits = [
	{
		label: (
			<span className="grid grid-cols-[auto_1fr] gap-2 items-center">
				<Icon name="Banana" size={20} />
				Banana
			</span>
		),
		value: "option-1",
	},
	{
		label: (
			<span className="grid grid-cols-[auto_1fr] gap-2 items-center">
				<Icon name="Apple" size={20} />
				Apple
			</span>
		),
		value: "option-2",
	},
	{
		label: (
			<span className="grid grid-cols-[auto_1fr] gap-2 items-center">
				<Icon name="Cherry" size={20} />
				Cherry
			</span>
		),
		value: "option-3",
	},
	{
		label: (
			<span className="grid grid-cols-[auto_1fr] gap-2 items-center">
				<Icon name="Citrus" size={20} />
				Lemon
			</span>
		),
		value: "option-4",
	},
	{
		label: (
			<span className="grid grid-cols-[auto_1fr] gap-2 items-center">
				<Icon name="Grape" size={20} />
				Grape
			</span>
		),
		value: "option-5",
	},
];

export default () => (
	<div className="w-full h-full min-h-screen relative flex justify-center items-center p-8">
		<div className="border border-dashed border-grayLight p-8 pt-6 rounded-lg bg-pattern-soft grid grid-cols-2 gap-8">
			<div className="flex flex-col gap-1">
				<span>Default</span>
				<Combobox options={fruits} value={fruits[0].value} />
			</div>
			<div className="flex flex-col gap-1">
				<span>Searchable</span>
				<Combobox options={fruits} value={fruits[0].value} searchable />
			</div>
		</div>
	</div>
);
