import { motion, Variants } from "framer-motion";
import { Home, ShieldCheck, Heart, MapPin } from "lucide-react";

const features = [
  {
    icon: <Home className="w-8 h-8 text-primary" />,
    title: "Premium Properties",
    description: "Discover handpicked properties that match your lifestyle and preferences."
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: "Verified Listings",
    description: "Every property is thoroughly vetted to ensure quality and accuracy."
  },
  {
    icon: <Heart className="w-8 h-8 text-primary" />,
    title: "Save Favorites",
    description: "Easily save and compare your favorite properties in one place."
  },
  {
    icon: <MapPin className="w-8 h-8 text-primary" />,
    title: "Prime Locations",
    description: "Find properties in the most sought-after neighborhoods and cities."
  }
];

const FeaturesSection = () => {
    const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <section className="py-16 rounded-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Why Choose Snappad?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Experience the difference with our premium property listings and exceptional service.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-white dark:bg-gray-800 p-4 sm:p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full"
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 text-center">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center leading-tight sm:leading-normal">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
