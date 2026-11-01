import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  name?: string;
  type?: string;
  image?: string;
  url?: string;
}

export const SEO = ({
  title,
  description,
  name = 'Raja Home Decor',
  type = 'website',
  image = 'https://rajahomedecor.com/og-image.jpg', // A placeholder image url
  url = 'https://rajahomedecor.com',
}: SEOProps) => {
  const fullTitle = title ? `${title} | ${name}` : name;
  const metaDescription = description || 'Premium bedsheets and home decor from Raja Home Decor. Discover comfort and luxury for your bedroom.';

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name='description' content={metaDescription} />
      <link rel="canonical" href={url} />
      
      {/* Open Graph tags (Facebook/LinkedIn) */}
      <meta property='og:type' content={type} />
      <meta property='og:title' content={fullTitle} />
      <meta property='og:description' content={metaDescription} />
      <meta property='og:image' content={image} />
      <meta property='og:url' content={url} />
      <meta property='og:site_name' content={name} />

      {/* Twitter tags */}
      <meta name='twitter:creator' content={name} />
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={fullTitle} />
      <meta name='twitter:description' content={metaDescription} />
      <meta name='twitter:image' content={image} />
    </Helmet>
  );
};
