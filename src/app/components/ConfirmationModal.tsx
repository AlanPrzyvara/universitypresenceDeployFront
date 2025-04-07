import React from 'react';
import styles from '../styles/ConfirmationModal.module.css';

interface ConfirmationModalProps {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <p className={styles.message}>{message}</p>
                <div className={styles.buttonContainer}>
                    <button className={styles.cancelButton} onClick={onCancel}>Voltar</button>
                    <button className={styles.confirmButton} onClick={onConfirm}>Confirmar</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;