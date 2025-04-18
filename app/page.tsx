import { ContactsProvider } from "@/contexts/contacts-context"

import { ContactsList } from "@/components/contacts-list"

export default function Home() {
  return (
    <ContactsProvider>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-[#1E7FDF]">Contacts</h1>
        <ContactsList />
      </main>
    </ContactsProvider>
  )
}
