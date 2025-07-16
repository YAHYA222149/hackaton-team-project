import { motion } from 'framer-motion';
import logoSvg from '../assets/logo.svg';

const Logo = ({ size = 'large', className = '' }) => {
  const sizeClasses = {
    small: 'h-6 md:h-8',
    medium: 'h-8 md:h-10 lg:h-12',
    large: 'h-10 md:h-12 lg:h-14 xl:h-16'
  };

  return (
    <motion.div
      className={`flex items-center ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.img
        src={logoSvg}
        alt="4U FLIX - Premium Streaming"
        className={`w-auto ${sizeClasses[size]}`}
        initial={{ filter: 'brightness(0.8)' }}
        animate={{ filter: 'brightness(1)' }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
      />
    </motion.div>
  );
};

export default Logo;
