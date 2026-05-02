import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/dashboard/", "/dealer/", "/auth/", "/api/"],
    },
    sitemap: "https://gear-up-opal.vercel.app/sitemap.xml",
  };
}
