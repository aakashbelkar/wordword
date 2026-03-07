import "./globals.css"
import Header from "./components/Header"

export const metadata = {
  title: "WordWord",
  description: "Discover powerful English words",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-white to-gray-100 min-h-screen text-gray-900">

        <Header />

        <main className="max-w-4xl mx-auto px-5 py-10">
          {children}
        </main>

      </body>
    </html>
  )
}