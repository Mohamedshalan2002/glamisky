import { motion } from 'framer-motion';
import { Crown, Gem, Leaf, Truck } from 'lucide-react';

const stories = [
  {
    icon: Crown,
    title: 'The Glamisky Promise',
    description: 'Every piece in our collection is hand-selected for quality, style, and value. We believe luxury should be accessible, not exclusive.',
    accent: 'gold',
  },
  {
    icon: Gem,
    title: 'Crafted with Intention',
    description: 'From the stitching on our bags to the plating on our jewelry, every detail is considered. Fast fashion, slowed down.',
    accent: 'champagne',
  },
  {
    icon: Leaf,
    title: 'Conscious Choices',
    description: 'We partner with suppliers who share our values: ethical labor, sustainable materials, and transparent practices.',
    accent: 'emerald',
  },
  {
    icon: Truck,
    title: 'Global Delivery',
    description: 'Express shipping via DHL & FedEx to 120+ countries. Track your order from our atelier to your doorstep.',
    accent: 'blue',
  },
];

export function StorySection() {
  
  return (
    <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-24"
        >
          <span className="text-gold-400 text-sm font-semibold tracking-widest uppercase">OUR PHILOSOPHY</span>
          <h2 className="section-title mt-4">Where Luxury Meets Accessibility</h2>
          <p className="section-subtitle mt-6">
            We're redefining what it means to shop luxury. No middlemen. No markup games. Just exceptional pieces at honest prices.
          </p>
        </motion.div>

        <div className="space-y-8 lg:space-y-12">
          {stories.map((story, index) => {
            return (
              <motion.div
                key={story.title}
                className="relative flex flex-col lg:flex-row gap-8 lg:gap-16 items-start"
              >
                <div
                  className={`relative flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 flex items-center justify-center rounded-none ${
                    story.accent === 'gold' ? 'bg-gold-gradient' :
                    story.accent === 'champagne' ? 'bg-champagne-gradient' :
                    story.accent === 'emerald' ? 'bg-emerald-500/20 border border-emerald-500/30' :
                    'bg-blue-500/20 border border-blue-500/30'
                  }`}
                >
                  <story.icon className={`w-10 h-10 ${story.accent === 'gold' ? 'text-obsidian-950' : 'text-white'}`} />
                </div>
                
                <div className="flex-1 pt-2 lg:pt-4">
                  <h3 className="font-heading text-2xl lg:text-3xl font-medium text-obsidian-950 mb-3">
                    {story.title}
                  </h3>
                  <p className="text-lg text-obsidian-500 leading-relaxed">
                    {story.description}
                  </p>
                </div>
                
                {/* Connecting line */}
                {index < stories.length - 1 && (
                  <div className="absolute left-10 lg:left-[7.5rem] top-[5.5rem] lg:top-[6rem] w-0.5 h-32 lg:h-40 bg-gradient-to-b from-gold-400/30 to-transparent" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gold-gradient/5 blur-3xl"
            style={{
              width: `${100 + i * 80}px`,
              height: `${100 + i * 80}px`,
              top: `${15 + i * 18}%`,
              left: `${5 + i * 12}%`,
            }}
            animate={{
              x: [0, 40 * (i % 2 === 0 ? 1 : -1), 0],
              y: [0, 30 * (i % 3 === 0 ? 1 : -1), 0],
            }}
            transition={{ duration: 20 + i * 5, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </section>
  );
}