import { cn } from '@/utility/classNames'
import { texts } from '@/utility/textUtil'
import { HelpCircle } from 'lucide-react'
import HelpDialogContent from './HelpDialogContent'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'

function ChartDocsDialogTrigger({ helpSlug }: { helpSlug?: string }) {
	if (!helpSlug) return null
	return (
		<DialogTrigger asChild>
			<Button
				variant="ghost"
				size="sm"
				className="text-grayDark pl-3 pr-1 rounded-full flex gap-2 items-center group -ml-3 md:ml-0"
			>
				<span
					className={cn(
						'underline decoration-grayMed underline-offset-4 transition w-fit',
						'group-hover:decoration-fg group-hover:text-fg text-sm',
					)}
				>
					{texts.charts.help.howToReadThis}
				</span>
				<HelpCircle className="size-5 lg:size-6" />
			</Button>
		</DialogTrigger>
	)
}

function ChartDocsDialogContent({ helpSlug }: { helpSlug?: string }) {
	if (!helpSlug) return null
	return (
		<DialogContent
			className={cn(
				"border border-grayMed",
				"shadow-lg shadow-black/5 dark:shadow-black/50",
				"w-full max-w-screen-md",
			)}
		>
			<HelpDialogContent slug={helpSlug} />
		</DialogContent>
	)
}

export function ChartDocsDialog({ helpSlug }: { helpSlug?: string }) {
	if (!helpSlug) return null
	return (
		<Dialog>
			<ChartDocsDialogTrigger helpSlug={helpSlug} />
			<ChartDocsDialogContent helpSlug={helpSlug} />
		</Dialog>
	)
}
