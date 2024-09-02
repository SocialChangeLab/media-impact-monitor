'use client'
import { cn } from '@/utility/classNames'
import { EventOrganizerSlugType } from '@/utility/eventsUtil'
import { texts } from '@/utility/textUtil'
import { useOrganisation } from '@/utility/useOrganisations'
import { AnimatePresence, motion } from 'framer-motion'
import ChartsIllustration from './ChartsIllustration'
import RoundedColorPill from './RoundedColorPill'
import { Button } from './ui/button'

function OrganisationPageAdBanner({ slug }: { slug: EventOrganizerSlugType }) {
	const { organisation } = useOrganisation(slug)

	return (
		<AnimatePresence>
			{organisation && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="p-content overflow-clip"
				>
					<div
						className={cn(
							'bg-pattern-semi-inverted dark:bg-pattern p-content text-brandWhite max-w-full',
							'dark:text-brandGreen relative overflow-clip max-xl:pb-80',
						)}
					>
						<div className="max-w-prose">
							<h2 className="text-balance mb-2 mt-0 font-semibold font-headlines text-2xl">
								{texts.organisationsPage.adBanner.heading({
									organisationNode: (
										<strong
											className="font-semibold inline-flex gap-2 items-baseline ml-1 underline underline-offset-4 decoration-2"
											style={{ textDecorationColor: organisation?.color }}
										>
											<RoundedColorPill
												color={organisation?.color}
												className="size-5"
											/>
											{organisation?.name}
										</strong>
									),
								})}
							</h2>
							<p className="mb-4 lead font-headlines text-xl text-pretty">
								{texts.organisationsPage.adBanner.description({
									organisationNode: (
										<strong className="font-semibold">
											{organisation?.name}
										</strong>
									),
								})}
							</p>
							<Button
								variant="default"
								className={cn(
									'bg-brandWhite text-brandGreen',
									'dark:bg-brandGreen dark:text-brandWhite',
								)}
							>
								{texts.organisationsPage.adBanner.buttons.contactUs}
							</Button>
						</div>
						<ChartsIllustration
							accentColor={organisation?.color}
							className={cn(
								'colors-light absolute sm:right-8 xl:top-content rotate-3',
								'-bottom-16 max-sm:left-1/2 max-sm:-translate-x-1/2',
							)}
						/>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export default OrganisationPageAdBanner
