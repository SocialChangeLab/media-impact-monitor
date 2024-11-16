"use client";
import { useFiltersStore } from '@/providers/FiltersStoreProvider';
import { format } from '@/utility/dateUtil';
import { texts } from '@/utility/textUtil';
import { isSameDay } from 'date-fns';
import NewsletterFooterSection from './NewsletterFooterSection';
import OrganisationsTable from './OrganisationsTable';
import SectionHeadlineWithExplanation from './SectionHeadlineWithExplanation';

function OrganisationsOverviewPageContent() {
  const description = useFiltersStore((state) => {
    const formattedFrom = format(state.from, "LLLL do, yyyy");
    const formattedTo = format(state.to, "LLLL do, yyyy");
    return texts.organisationsPage.description({
      isSameDay: isSameDay(state.from, state.to),
      formattedFrom,
      formattedTo,
    });
  });
  return (
    <>
      <SectionHeadlineWithExplanation
        headline={texts.organisationsPage.heading}
        description={description}
      >
        <OrganisationsTable />
      </SectionHeadlineWithExplanation>
      <NewsletterFooterSection />
    </>
  );
}

export default OrganisationsOverviewPageContent
