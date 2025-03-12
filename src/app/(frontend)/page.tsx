import { ContactForm } from '@/components/ContactForm'

export default async function HomePage() {
  return (
    <div className="flex flex-col items-center pt-24">
      <ContactForm />
    </div>
  )
}
