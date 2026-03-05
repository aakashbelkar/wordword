import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {

return {
rules: [
{
userAgent: "*",
allow: "/",
disallow: "/review"
}
],
sitemap: "https://wordword.app/sitemap.xml"
}

}