import { villageInfo } from "@/lib/village-data";

export function VillageStructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name: `${villageInfo.name} Village Portal`,
    alternateName: "Lodhaura Gram Panchayat Digital Hub",
    description: villageInfo.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: villageInfo.name,
      addressRegion: villageInfo.state,
      postalCode: villageInfo.pincode,
      addressCountry: villageInfo.country,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: `${villageInfo.district}, ${villageInfo.state}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
