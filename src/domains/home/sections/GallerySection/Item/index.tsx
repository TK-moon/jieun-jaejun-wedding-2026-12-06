import { motion } from 'motion/react';
import {
  cloneElement,
  isValidElement,
  useState,
  type FC,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
} from 'react';
import { MOTION_EASE, MOTION_FADE_UP } from '@/constants/motion';
import { Photo } from '../Photo';
import { useRevealMotion } from './_hooks/useRevealMotion';
import styles from './index.module.css';

interface Props extends PropsWithChildren {
  index: number;
}

const Item: FC<Props> = (props) => {
  const { index, children } = props;

  const photo = asPhoto(children);

  const [isReady, setIsReady] = useState(!photo);
  const { ref, canAnimate, skipInitial } = useRevealMotion({
    isReady,
  });

  return (
    <li ref={ref} className={styles.item}>
      <motion.div
        className={styles.card}
        initial={skipInitial ? false : MOTION_FADE_UP.hidden}
        animate={canAnimate ? MOTION_FADE_UP.visible : MOTION_FADE_UP.hidden}
        transition={{ delay: index * 0.1, duration: 1, ease: MOTION_EASE }}
      >
        {photo ? cloneElement(photo, { onReady: () => setIsReady(true) }) : children}
      </motion.div>
    </li>
  );
};

export { Item };

function asPhoto(node: ReactNode): ReactElement<{ onReady?: () => void }> | null {
  if (!isValidElement(node) || node.type !== Photo) {
    return null;
  }

  return node as ReactElement<{ onReady?: () => void }>;
}
