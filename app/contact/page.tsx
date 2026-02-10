import TeamPage from "@/components/booking-team/TeamPage"
import { ContactForm } from "@/components/contact/ContactForm"

export default function ContactPage() {
  return <ContactForm teamComponent={<TeamPage />} />
}
