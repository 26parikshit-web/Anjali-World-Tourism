/**
 * Central SEO configuration.
 * Production canonical domain: https://www.anjaliworldtourism.com
 * Optionally override via NEXT_PUBLIC_SITE_URL in Vercel (Production + Preview).
 */

export const siteConfig = {
  /** Canonical production domain — always used for sitemap/OG unless overridden by env. */
  productionUrl: "https://www.anjaliworldtourism.com",
  name: "Anjali World Tourism",
  title: "Anjali World Tourism | Spiritual Journeys & India Travel",
  description:
    "Handcrafted spiritual pilgrimages, friend getaways, family holidays, and honeymoon packages — planned by real people, not algorithms.",
  keywords: [
    "Anjali World Tourism",
    "spiritual journeys India",
    "Char Dham Yatra",
    "pilgrimage tours",
    "friends getaway India",
    "custom travel planning",
    "India tour packages",
    "honeymoon packages India",
  ],
  locale: "en_IN",
  defaultOgImage: "/images/chaarDham.webp",
  twitterHandle: undefined,
};

export function getSiteUrl() {
  // Explicit override (optional — set in Vercel if domain ever changes)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  // Local dev only
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  // Production & preview deploys: always use the canonical custom domain.
  // Never use VERCEL_URL — it resolves to *-projects.vercel.app on previews.
  return siteConfig.productionUrl;
}

export function absoluteUrl(path = "/") {
  const base = getSiteUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

/**
 * Build consistent page metadata with canonical URL, Open Graph, and Twitter cards.
 */
export function buildPageMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  image,
  keywords,
  noIndex = false,
  type = "website",
}) {
  const pageTitle = title.includes(siteConfig.name)
    ? title
    : `${title} | ${siteConfig.name}`;
  const url = absoluteUrl(path);
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : absoluteUrl(image)
    : absoluteUrl(siteConfig.defaultOgImage);

  return {
    title: pageTitle,
    description,
    keywords: keywords ?? siteConfig.keywords,
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [
        {
          url: ogImage,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [ogImage],
      ...(siteConfig.twitterHandle && { creator: siteConfig.twitterHandle }),
    },
  };
}

export const defaultMetadata = buildPageMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: "/",
});
