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
<html lang="en" className="light" suppressHydrationWarning>
<body className={`${comfortaa.className} bg-white text-gray-900`}>

<Header />

<main>
{children}
</main>

<Footer />

</body>
</html>
)
}