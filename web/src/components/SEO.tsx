import { Helmet } from "react-helmet-async";
import type { Page } from "../interfaces";

interface SEOProps {
  page?: Page | null;
  currentUrl?: string;
  siteName?: string;
  defaultTitle?: string;
  defaultDescription?: string;
  siteUrl?: string;
  noIndex?: boolean; // For private pages that should not be indexed
}

export function SEO({
  page,
  currentUrl,
  siteName = "ASUL Ultimate Website",
  defaultTitle = "ASUL Ultimate Website",
  defaultDescription = "Simple page editor for creating and managing MDX content",
  siteUrl = "https://asul-ultimate-website.example.com",
  noIndex = false,
}: SEOProps) {
  const title = page?.title || defaultTitle;
  const description = page?.description || defaultDescription;
  const slug = page?.slug || "";
  const url = currentUrl || `${siteUrl}${slug === "home" ? "/" : `/${slug}`}`;

  // Determine if this is the home page
  const isHomePage = slug === "home" || !page || currentUrl === siteUrl;
  
  // Determine robots content
  const shouldNoIndex = noIndex || 
    (page && page.inSitemap === false) ||
    (!page && (currentUrl?.includes("/signin") || currentUrl?.includes("/editor")));

  // Generate structured data as a simple any type to avoid TypeScript inference issues
  const structuredData: any = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": siteName,
        "description": description,
        "publisher": {
          "@id": `${siteUrl}/#organization`
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${siteUrl}/search?q={search_term_string}`,
            "inLanguage": "en-US"
          },
          "expectsAcceptanceOf": {
            "@type": "Offer",
            "category": "free",
            "eligibleRegion": {
              "@type": "Country",
              "name": "US"
            }
          }
        }
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": siteName,
        "url": siteUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/api/favicon/`,
          "width": 256,
          "height": 256
        }
      }
    ]
  };

  if (page) {
    const isPageHome = page.slug === "home";
    
    structuredData["@graph"].push({
      "@type": isPageHome ? "WebPage" : "Article",
      "@id": `${url}/#page`,
      "url": url,
      "name": title,
      "headline": title,
      "description": description,
      "publisher": {
        "@id": `${siteUrl}/#organization`
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${siteUrl}/#webpage`
      },
      "datePublished": page.createdAt,
      "dateModified": page.updatedAt
    });

    // Add Breadcrumbs
    structuredData["@graph"].push({
      "@type": "BreadcrumbList",
      "@id": `${url}/#breadcrumb`,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": siteUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": title,
          "item": url
        }
      ]
    });
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={getKeywords(title, description)} />
      <meta name="author" content={siteName} />
      <meta name="publisher" content={siteName} />
      
      {/* Charset and Viewport */}
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Robots */}
      <meta name="robots" content={shouldNoIndex ? "noindex, nofollow" : "index, follow"} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={isHomePage ? "website" : "article"} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Open Graph Images - using favicon as fallback */}
      <meta property="og:image" content={`${siteUrl}/api/favicon/`} />
      <meta property="og:image:alt" content={`${title} - ${siteName}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* Open Graph Locale */}
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}/api/favicon/`} />
      <meta name="twitter:image:alt" content={`${title} - ${siteName}`} />
      <meta name="twitter:site" content="@asul_ultimate" />
      <meta name="twitter:creator" content="@asul_ultimate" />

      {/* Schema.org Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Alternate Links */}
      <link rel="alternate" hrefLang="en" href={url} />
      
      {/* Theme Color */}
      <meta name="theme-color" content="#ffffff" />
      
      {/* Mobile Web App Capable */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Application Name */}
      <meta name="application-name" content={siteName} />

      {/* Preload critical resources */}
      <link rel="preload" href={`${siteUrl}/api/favicon/`} as="image" />
    </Helmet>
  );
}

function getKeywords(title: string, description: string): string {
  // Extract meaningful keywords from title and description
  const allText = `${title} ${description}`.toLowerCase();
  const words = allText.split(/\s+/).filter(word => 
    word.length > 3 && !/[\d\W]/.test(word[0]) && word
  );
  
  // Remove duplicates and limit to 10 keywords
  const uniqueWords = [...new Set(words)];
  return uniqueWords.slice(0, 10).join(", ");
}

export default SEO;