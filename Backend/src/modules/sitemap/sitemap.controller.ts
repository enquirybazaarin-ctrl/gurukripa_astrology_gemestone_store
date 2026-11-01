import { Request, Response } from 'express';
import { Product } from '../products/product.model';
import { Category } from '../categories/category.model';
import { logger } from '../../common/utils/logger';

export const generateSitemap = async (req: Request, res: Response) => {
    try {
        const baseUrl = process.env.FRONTEND_URL || 'https://rajahomedecor.com';

        // Fetch active products and categories
        const products = await Product.find({ isActive: true }).select('slug _id updatedAt category');
        const categories = await Category.find({ isActive: true }).select('slug updatedAt');

        // Start XML building
        let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
        sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        // Add static routes
        const staticRoutes = [
            '/',
            '/about',
            '/faq',
            '/bulk-enquiry',
            '/privacy-policy',
            '/terms',
            '/refund-policy',
            '/shipping-policy',
            '/products'
        ];

        staticRoutes.forEach(route => {
            sitemap += `  <url>\n`;
            sitemap += `    <loc>${baseUrl}${route}</loc>\n`;
            sitemap += `    <changefreq>weekly</changefreq>\n`;
            sitemap += `    <priority>${route === '/' ? '1.0' : '0.8'}</priority>\n`;
            sitemap += `  </url>\n`;
        });

        // Add Categories
        categories.forEach(category => {
            sitemap += `  <url>\n`;
            const locUrl = `${baseUrl}/category/${category.slug}`;
            sitemap += `    <loc>${locUrl.replace(/&/g, '&amp;')}</loc>\n`;
            // @ts-ignore
            if (category.updatedAt) {
                 // @ts-ignore
                sitemap += `    <lastmod>${category.updatedAt.toISOString()}</lastmod>\n`;
            }
            sitemap += `    <changefreq>daily</changefreq>\n`;
            sitemap += `    <priority>0.9</priority>\n`;
            sitemap += `  </url>\n`;
        });

        // Add Products
        products.forEach(product => {
            sitemap += `  <url>\n`;
            const locUrl = `${baseUrl}/product/${product._id}`;
            sitemap += `    <loc>${locUrl.replace(/&/g, '&amp;')}</loc>\n`;
            // @ts-ignore
            if (product.updatedAt) {
                 // @ts-ignore
                sitemap += `    <lastmod>${product.updatedAt.toISOString()}</lastmod>\n`;
            }
            sitemap += `    <changefreq>weekly</changefreq>\n`;
            sitemap += `    <priority>0.7</priority>\n`;
            sitemap += `  </url>\n`;
        });

        sitemap += '</urlset>';

        res.header('Content-Type', 'application/xml');
        res.status(200).send(sitemap);
    } catch (error) {
        logger.error(`Error generating sitemap: ${error}`);
        res.status(500).end();
    }
};
