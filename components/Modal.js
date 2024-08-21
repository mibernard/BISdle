import React, { forwardRef } from 'react';
import styles from './Modal.module.css';

const Modal = forwardRef(({ isOpen, onClose, children }, ref) => {
  if (!isOpen) return null;

  return (
    <div ref={ref} className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
});

export default Modal;
