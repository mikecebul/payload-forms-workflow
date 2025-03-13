import { ContactForm } from '@/components/ContactForm'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })
  const {
    docs: [formConfig],
  } = await payload.find({
    collection: 'forms',
    where: {
      type: { equals: 'contact' },
    },
    limit: 1,
  })
  return (
    <div className="flex flex-col items-center pt-24">
      <ContactForm formConfig={formConfig} />
    </div>
  )
}
