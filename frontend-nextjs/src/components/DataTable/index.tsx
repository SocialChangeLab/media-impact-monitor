import type { ColumnDef } from "@tanstack/react-table";
import ComponentError from "../ComponentError";
import { DataTable } from "./DataTable";

function DataTableWithState<RecordType>(props: {
	isPending: boolean;
	error: Error | null;
	data: RecordType[] | null;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	columns: ColumnDef<RecordType, any>[];
}) {
	const { error, isPending, data, columns } = props;
	if (isPending) return <div>Loading...</div>;
	if (error) {
		return (
			<div className="w-full flex justify-center min-h-96 p-8 items-center bg-grayUltraLight">
				<ComponentError
					errorMessage={error.message}
					announcement="There was an error loading events"
				/>
			</div>
		);
	}
	return (
		<DataTable<RecordType>
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			columns={columns as ColumnDef<RecordType, any>[]}
			data={data || []}
		/>
	);
}

export default DataTableWithState;
