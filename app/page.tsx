import HomeClient from "./HomeClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
title: "Learn English Vocabulary with Stories | WordWord",
description:
"Improve your English vocabulary through stories, examples and quizzes.",
alternates: {
canonical: "https://wordword.app"
}
}

export default function Page(){
return <HomeClient/>
}