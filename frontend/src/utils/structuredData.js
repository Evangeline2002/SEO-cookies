// ============================================================
// structuredData.js – JSON-LD Schema helpers
// ============================================================

export const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CookieSnack',
    url: 'https://www.cookiesnack.com',
    logo: 'https://www.cookiesnack.com/favicon.svg',
    description: 'Premium handmade cookies, gift boxes and freshly baked snacks delivered to your door.',
    sameAs: [
        'https://www.facebook.com/cookiesnack',
        'https://www.instagram.com/cookiesnack',
        'https://twitter.com/cookiesnack',
    ],
    contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: '+91-98765-43210',
        email: 'hello@cookiesnack.com',
    },
};

export const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CookieSnack',
    url: 'https://www.cookiesnack.com',
    potentialAction: {
        '@type': 'SearchAction',
        target: 'https://www.cookiesnack.com/shop?q={search_term_string}',
        'query-input': 'required name=search_term_string',
    },
};

export const breadcrumbSchema = (items) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: item.name,
        item: `https://www.cookiesnack.com${item.path}`,
    })),
});

export const faqSchema = (faqs) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
});

export const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    name: 'CookieSnack',
    image: 'https://www.cookiesnack.com/favicon.svg',
    telephone: '+91-98765-43210',
    email: 'hello@cookiesnack.com',
    address: {
        '@type': 'PostalAddress',
        streetAddress: '12 Baker Street',
        addressLocality: 'Mumbai',
        addressRegion: 'Maharashtra',
        postalCode: '400001',
        addressCountry: 'IN',
    },
    openingHours: 'Mo-Su 09:00-21:00',
    priceRange: '₹₹',
    servesCuisine: 'Bakery',
};
