import { getDocsToc } from "@/utility/docsUtil";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function Home() {
	// Redirect to the first page
	const docsPagesToc = getDocsToc();
	if (docsPagesToc.length === 0) return null;
	return redirect(`/docs/${docsPagesToc[0].slug}`);
}
