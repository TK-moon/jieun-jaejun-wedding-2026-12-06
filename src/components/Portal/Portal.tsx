import type { FC, PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

interface Props extends PropsWithChildren {
  container?: Element | DocumentFragment;
}

const Portal: FC<Props> = (props) => {
  const { children, container = document.body } = props;

  return createPortal(children, container);
};

export { Portal };
