import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { products, getProductsByCategory, type Category, type Product } from '../data/products';

interface ProductGridProps {
  category?: Category;
  title?: string;
  subtitle?: string;
  maxItems?: number;
  products?: Product[];
}

export function ProductGrid({ category, title, subtitle, maxItems, products: customProducts }: ProductGridProps) {
  const itemsToShow = customProducts 
    ? customProducts
    : category 
      ? getProductsByCategory(category)
      : products;
  
  const displayItems = maxItems ? itemsToShow.slice(0, maxItems) : itemsToShow;

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="section-container">
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-12 lg:mb-16"
          >
            {title && (
              <h2 className="section-title mb-4">{title}</h2>
            )}
            {subtitle && (
              <p className="section-subtitle">{subtitle}</p>
            )}
          </motion.div>
        )}

        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {displayItems.map((product, index) => (
            <motion.div key={product.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <ProductCard product={product} index={index} priority={index < 4} />
            </motion.div>
          ))}
        </motion.div>

        {!maxItems && category && !customProducts && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12 lg:mt-16"
          >
            <a
              href={`/category/${category}`}
              className="btn-secondary inline-flex items-center gap-2"
            >
              View All {title}
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}