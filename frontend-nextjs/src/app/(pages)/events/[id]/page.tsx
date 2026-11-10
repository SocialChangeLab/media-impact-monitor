import { notFound } from "next/navigation";

// This route uses the ACLED source, whose public contract exposes summaries only.
export default function EventPage() {
	notFound();
}
