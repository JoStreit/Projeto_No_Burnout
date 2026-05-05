import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://calmamente.com.br";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/burnout"],
        disallow: ["/admin", "/reset-senha", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
