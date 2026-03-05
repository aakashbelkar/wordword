"use client"

export default function LanguageSelector({ language, setLanguage }: any) {

return (

<div className="mt-4">

<select
value={language}
onChange={(e) => setLanguage(e.target.value)}
className="border p-2 rounded-lg"
>

<option value="en">English</option>
<option value="hi">Hindi</option>
<option value="mr">Marathi</option>

</select>

</div>

)

}