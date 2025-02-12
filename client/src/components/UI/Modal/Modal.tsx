import classes from './Modal.module.css';
import { createPortal } from 'react-dom';
import React from 'react';

const Modal = ({
  children,
  onClick,
}: {
  children: React.JSX.Element;
  onClick?: React.MouseEventHandler<HTMLElement>
}) => {
  const modalEl = document.getElementById('modal') as HTMLDivElement;

  return (
    <>
      {createPortal(
        <>
          <div className={classes.bgc} onClick={onClick} />
          <dialog open className={`${classes.card}`}>
            {children}
          </dialog>
        </>,
        modalEl,
      )}
    </>
  );
};

export default Modal;
