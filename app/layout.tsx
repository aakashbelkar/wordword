import "./globals.css"
import { Comfortaa } from "next/font/google"
import Header from "./components/Header"
import Footer from "./components/Footer"

const comfortaa = Comfortaa({
  subsets: ["latin"],
})

export const metadata = {
  metadataBase: new URL("https://wordword.app"),

  title: {
    default: "WordWord — Learn English Vocabulary with Stories",
    template: "%s | WordWord",
  },

  description:
    "Learn English vocabulary through stories in Hindi and Marathi. Improve vocabulary with examples, images and quizzes.",

  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${comfortaa.className} bg-gray-50 text-gray-900`}
      >
        <Header />

        <main className="min-h-screen max-w-5xl mx-auto px-4 py-10">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  )
}