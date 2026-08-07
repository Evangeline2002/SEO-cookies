import { Helmet } from 'react-helmet-async';

/**
 * Reusable SEO component.
 * Props: title, description, keywords, canonical, ogTitle, ogDescription,
 *        ogImage, twitterCard, robots, schema (JSON-LD object or array)
 */
export default function SEO({
    title = 'CookieSnack – Premium Handmade Cookies',
    description = 'Buy fresh handmade cookies online. Chocolate, butter, oatmeal, vegan, gluten-free and more. Fast cookie delivery across India.',
    keywords = 'fresh cookies, handmade cookies, buy cookies online, premium cookies, chocolate cookies, butter cookies, cookie delivery, gourmet cookies',
    canonical = 'https://www.cookiesnack.com',
    ogTitle,
    ogDescription,
    ogImage = 'https://www.cookiesnack.com/og-image.jpg',
    twitterCard = 'summary_large_image',
    robots = 'index, follow',
    schema,
}) {
    const finalOgTitle = ogTitle || title;
    const finalOgDesc = ogDescription || description;

    return (
        <Helmet>
            {/* Primary */}
            <html lang="en" />
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="robots" content={robots} />
            <link rel="canonical" href={canonical} />

            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={canonical} />
            <meta property="og:title" content={finalOgTitle} />
            <meta property="og:description" content={finalOgDesc} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content="CookieSnack" />
            <meta property="og:locale" content="en_IN" />

            {/* Twitter */}
            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:site" content="@cookiesnack" />
            <meta name="twitter:title" content={finalOgTitle} />
            <meta name="twitter:description" content={finalOgDesc} />
            <meta name="twitter:image" content={ogImage} />

            {/* Schema */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(Array.isArray(schema) ? schema : [schema])}
                </script>
            )}
        </Helmet>
    );
}
