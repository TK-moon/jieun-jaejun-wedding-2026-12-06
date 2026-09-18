import { useId, type FC } from 'react';
import { PHOTO_GIFT } from '../../../../_constants';
import styles from './index.module.css';

interface Props {}

const CHARACTER_POSITIONS = [
  { x: 34, y: 34 },
  { x: 66, y: 34 },
  { x: 34, y: 66 },
  { x: 66, y: 66 },
] as const;

const Stamp: FC<Props> = () => {
  const textureId = `stamp-texture-${useId().replaceAll(':', '')}`;

  return (
    <div className={styles.stamp} aria-hidden="true">
      <svg className={styles.mark} viewBox="0 0 100 100" focusable="false">
        <defs>
          <filter
            id={textureId}
            x="-8%"
            y="-8%"
            width="116%"
            height="116%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.08 0.14"
              numOctaves="3"
              seed="12"
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0.24 0.66 0.1 0 0"
              result="noiseAlpha"
            />
            <feComponentTransfer in="noiseAlpha" result="inkMask">
              <feFuncA type="table" tableValues="0.24 0.48 0.74 0.94" />
            </feComponentTransfer>
            <feComposite in="SourceGraphic" in2="inkMask" operator="in" result="wornInk" />
            <feDisplacementMap
              in="wornInk"
              in2="noise"
              scale="1.2"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        <g className={styles.imprint} filter={`url(#${textureId})`}>
          <rect className={styles.frame} x="12" y="12" width="76" height="76" />
          {CHARACTER_POSITIONS.map(({ x, y }, index) => (
            <text
              key={`${x}-${y}`}
              className={styles.character}
              x={x}
              y={y}
              dominantBaseline="central"
              textAnchor="middle"
            >
              {PHOTO_GIFT.passport.stamp.at(index)}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
};

export { Stamp };
