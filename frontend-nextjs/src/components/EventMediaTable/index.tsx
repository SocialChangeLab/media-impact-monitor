"use client";
import useEventMedia from "@/utility/useEventMedia";

function EventMediaTable({ id }: { id: string }) {
	const { data, isError, isSuccess, isPending } = useEventMedia(id);
	if (isPending) return <div>Loading...</div>;
	if (isError) return <div>Error: {isError}</div>;
	if (isSuccess && data?.length === 0) return <div>No data</div>;
	return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

export default EventMediaTable;
