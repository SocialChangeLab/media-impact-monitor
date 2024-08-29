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
	if (error) {
		return (
			<div className="w-full flex justify-center min-h-96 p-8 items-center bg-grayUltraLight">
				<ComponentError
					errorDetails={error.message}
					errorMessage="There was an error loading events"
				/>
			</div>
		);
	}
	return (
		<DataTable<RecordType>
			columns={columns}
			data={data || []}
			isLoading={isPending ?? true}
		/>
	);
}

export default DataTableWithState;
