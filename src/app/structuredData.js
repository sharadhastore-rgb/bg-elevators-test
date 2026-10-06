import { businessProfile } from "@/data/businessProfile";

const ORIGIN = "https://www.bgelevators.com";
const ORGANIZATION_ID = `${ORIGIN}/#organization`;
const LOCAL_BUSINESS_ID = `${ORIGIN}/#localbusiness`;
const WEBSITE_ID = `${ORIGIN}/#website`;
const DEFAULT_IMAGE = `${ORIGIN}/images/673d74269488c8595948fdd9_home-hero-image.webp`;

const productSlugs = new Set([
  "bg-glass-finish-cabin",
  "bg-mirror-finish-cabin",
  "bg-stainless-steel-finish-cabin",
  "glass-door",
  "gold-finish",
  "ms-powder-coated-finish",
  "rose-gold-finish",
  "ss-hairline-finish",
  "ss-mirror-finish",
  "wooden-finish",
]);
const serviceSlugs = new Set([
  "amc-and-service-maintence",
  "breakdown-and-emergency-repairs",
  "elevator-installation",
  "elevator-modernization",
  "service-details",
  "service-for-non-bg-elevators",
]);

const absoluteUrl = (value) =>
  value ? new URL(value, ORIGIN).href : undefined;
const descriptionOf = (meta) =>
  meta?.meta?.find((item) => item.name === "description")?.content?.trim();
const cleanTitle = (title) =>
  title?.replace(/\s*\|\s*BG Elevators.*$/i, "").trim();
const isoDate = (value) => {
  if (!value) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(`${value} UTC`);
  return Number.isNaN(date.valueOf())
    ? undefined
    : date.toISOString().slice(0, 10);
};
const textOf = (node) => {
  if (typeof node === "string") return node;
  if (!node || typeof node !== "object") return "";
  return (node.children || []).map(textOf).join(" ");
};
const normalizedText = (node) => textOf(node).replace(/\s+/g, " ").trim();

function faqEntities(article) {
  const body = article?.body || [];
  const faqStart = body.findIndex(
    (node) =>
      /^h[1-3]$/.test(node?.tag || "") &&
      /frequently asked questions|faqs?/i.test(normalizedText(node)),
  );
  if (faqStart < 0) return [];
  const entities = [];
  for (let index = faqStart + 1; index < body.length; index++) {
    const node = body[index];
    if (node?.tag === "h2") break;
    if (node?.tag !== "h3") continue;
    const question = normalizedText(node);
    const answerParts = [];
    for (
      let next = index + 1;
      next < body.length && !/^h[1-3]$/.test(body[next]?.tag || "");
      next++
    ) {
      if (
        body[next]?.tag === "p" ||
        body[next]?.tag === "ul" ||
        body[next]?.tag === "ol"
      )
        answerParts.push(normalizedText(body[next]));
    }
    const answer = answerParts.filter(Boolean).join(" ");
    if (question && answer)
      entities.push({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      });
  }
  return entities;
}

function breadcrumb(slug, meta, article) {
  if (slug === "index") return null;
  const items = [
    { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
  ];
  if (article)
    items.push({
      "@type": "ListItem",
      position: 2,
      name: "Blog",
      item: `${ORIGIN}/blogs`,
    });
  else if (productSlugs.has(slug))
    items.push({
      "@type": "ListItem",
      position: 2,
      name: "Products",
      item: `${ORIGIN}/products`,
    });
  else if (serviceSlugs.has(slug))
    items.push({
      "@type": "ListItem",
      position: 2,
      name: "Services",
      item: `${ORIGIN}/services`,
    });
  items.push({
    "@type": "ListItem",
    position: items.length + 1,
    name: article?.title || cleanTitle(meta.title),
    item: meta.canonical,
  });
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${meta.canonical}#breadcrumb`,
    itemListElement: items,
  };
}

const organizationGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: businessProfile.name,
      url: `${ORIGIN}/`,
      logo: {
        "@type": "ImageObject",
        url: `${ORIGIN}/images/bgElevetorMain.jpeg`,
      },
      email: businessProfile.email,
      telephone: businessProfile.primaryPhoneE164,
    },
    {
      "@type": "LocalBusiness",
      "@id": LOCAL_BUSINESS_ID,
      name: businessProfile.name,
      url: `${ORIGIN}/`,
      image: DEFAULT_IMAGE,
      email: businessProfile.email,
      telephone: businessProfile.primaryPhoneE164,
      address: {
        "@type": "PostalAddress",
        streetAddress: businessProfile.streetAddress,
        addressLocality: businessProfile.locality,
        postalCode: businessProfile.postalCode,
        addressRegion: businessProfile.region,
        addressCountry: businessProfile.country,
      },
      areaServed: businessProfile.serviceArea,
      parentOrganization: { "@id": ORGANIZATION_ID },
      priceRange: "$$",
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name: "BG Elevators",
      url: `${ORIGIN}/`,
      publisher: { "@id": ORGANIZATION_ID },
      inLanguage: "en-IN",
    },
  ],
};

export function schemasForPage({ slug, meta, article }) {
  if (
    !meta?.canonical ||
    meta.meta?.some(
      (item) => item.name === "robots" && /noindex/i.test(item.content || ""),
    )
  )
    return [];
  const schemas = [organizationGraph];
  const crumbs = breadcrumb(slug, meta, article);
  if (crumbs) schemas.push(crumbs);
  const description = descriptionOf(meta);
  if (article) {
    const published =
      isoDate(article.date) ||
      (slug === "builders-guide-commercial-elevators-bangalore"
        ? "2026-09-29"
        : undefined);
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${meta.canonical}#article`,
      headline: article.title,
      description,
      image: absoluteUrl(article.image) || DEFAULT_IMAGE,
      datePublished: published,
      dateModified: isoDate(article.modifiedDate) || published,
      author: {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: businessProfile.legalAuthorName,
      },
      reviewedBy: {
        "@type": "Organization",
        name: businessProfile.technicalReviewer,
      },
      publisher: { "@id": ORGANIZATION_ID },
      mainEntityOfPage: { "@type": "WebPage", "@id": meta.canonical },
      url: meta.canonical,
      inLanguage: "en-IN",
    });
    const questions = faqEntities(article);
    if (questions.length)
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${meta.canonical}#faq`,
        mainEntity: questions,
      });
  } else if (serviceSlugs.has(slug)) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${meta.canonical}#service`,
      name: cleanTitle(meta.title),
      description,
      url: meta.canonical,
      provider: { "@id": LOCAL_BUSINESS_ID },
      areaServed: { "@type": "City", name: "Bangalore" },
    });
  } else if (productSlugs.has(slug)) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${meta.canonical}#product`,
      name: cleanTitle(meta.title),
      description,
      url: meta.canonical,
      image: DEFAULT_IMAGE,
      brand: { "@type": "Brand", name: "BG Elevators" },
      manufacturer: { "@id": ORGANIZATION_ID },
    });
  }
  return schemas.filter((schema) => JSON.stringify(schema) !== undefined);
}

export function withStructuredData(meta, context) {
  return {
    ...meta,
    schemas: [...(meta.schemas || []), ...schemasForPage({ ...context, meta })],
  };
}
