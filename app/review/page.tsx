import ReviewClient from "./ReviewClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
title: "Review Weak English Words | WordWord",
robots: {
index: false,
follow: false
}
}

export default function Page(){
return <ReviewClient/>
}