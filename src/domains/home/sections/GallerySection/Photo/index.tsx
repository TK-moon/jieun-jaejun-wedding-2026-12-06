import { useState, type FC } from 'react';
import { motion } from 'motion/react';
import { MOTION_DURATION, MOTION_EASE } from '@/constants/motion';
import styles from './index.module.css';

interface Props {
  id: string;
  src: string;
  alt: string;
  index: number;
  isSectionVisible: boolean;
  shouldReduceMotion: boolean | null;
  onReady?: (photoId: string) => void;
}

const Photo: FC<Props> = (props) => {
  const { id, src, alt, index, isSectionVisible, shouldReduceMotion, onReady } = props;
  const [isReady, setIsReady] = useState(false);
  const canAnimate = Boolean(shouldReduceMotion) || (isSectionVisible && isReady);

  const handleReady = () => {
    setIsReady(true);
    onReady?.(id);
  };

  return (
    <motion.div
      className={styles.frame}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={canAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        delay: shouldReduceMotion || !canAnimate ? 0 : (index + 1) * 0.1,
        duration: shouldReduceMotion ? 0 : MOTION_DURATION,
        ease: MOTION_EASE,
      }}
    >
      <img
        className={styles.image}
        src={src}
        alt={alt}
        width={1200}
        height={1800}
        loading="lazy"
        decoding="async"
        onLoad={handleReady}
        onError={handleReady}
      />
    </motion.div>
  );
};

export { Photo };
