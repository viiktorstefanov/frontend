import { useTranslation } from 'next-i18next'

import Layout from 'components/client/layout/Layout'
import ActiveCampaignsSection from './sections/ActiveCampaignsSection/ActiveCampaignsSection'
import CompletedCampaignsSection from './sections/CompletedCampaignsSection/CompletedCampaignsSection'
import PlatformStatisticsSection from './sections/PlatformStatisticsSection/PlatformStatisticsSection'
import MediaSection from './sections/MediaSection/MediaSection'
import HowWeWorkSection from './sections/HowWeWorkSection/HowWeWorkSection'
import PartnersSection from './sections/PartnersSection/PartnersSection'
import SubscriptionSection from './sections/SubscriptionSection/SubscriptionSection'
import TeamMembersSection from './sections/TeamMembersSection/TeamMembersSection'
import JoinPodkrepiBgSection from './sections/JoinPodkrepiBgSection/JoinPodkrepiBgSection'
import FaqSection from './sections/FaqSection/FaqSection'

export default function IndexPage() {
  const { t } = useTranslation('index')
  return (
    <Layout
      maxWidth={false}
      disableOffset
      disableGutters
      title={t('title')}
      metaDescription={t('metaDescription')}>
      <ActiveCampaignsSection />
      <CompletedCampaignsSection />
      <PlatformStatisticsSection />
      <MediaSection />
      <HowWeWorkSection />
      <PartnersSection />
      <TeamMembersSection />
      <JoinPodkrepiBgSection />
      <SubscriptionSection />
      <FaqSection />
    </Layout>
  )
}
