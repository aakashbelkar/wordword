import "./globals.css"
import { Comfortaa } from "next/font/google"
import Header from "./components/Header"
import words from "@/data/words.json"

const comfortaa = Comfortaa({
subsets: ["latin"],
})

export const metadata = {
  metadataBase: new URL("https://wordword.app"),

  title: {
    default: "WordWord — Learn English Vocabulary with Stories",
    template: "%s | WordWord"
  },

  description:
    "Learn English vocabulary through stories in Hindi and Marathi. Improve vocabulary with examples, images and quizzes.",

  keywords: [
    "english vocabulary",
    "learn english words",
    "vocabulary stories",
    "english words with meaning",
    "english words hindi meaning",
    "english words marathi meaning"
  ],

  openGraph: {
    title: "WordWord",
    description:
      "Learn English vocabulary through stories in Hindi and Marathi.",
    url: "https://wordword.app",
    siteName: "WordWord",
    type: "website"
  },

  robots: {
    index: true,
    follow: true
  }
}

export default function RootLayout({
children,
}: {
children: React.ReactNode
}) {
return (
<html lang="en">
<body className={comfortaa.className}>

<Header />

<main>
{children}
</main>

<footer className="mt-20 border-t py-8 text-center text-sm text-gray-600">

<p>
Made with ❤️ in Bharat
</p>

<p className="mt-1">
by Aakash Belkar
</p>

</footer>

</body>
</html>
)
}