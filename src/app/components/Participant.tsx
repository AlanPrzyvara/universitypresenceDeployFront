import React from 'react';
import styles from '../styles/Participant.module.css';

const Participant = ({
    name,
    ra,
    location,
    present,
}: {
    name: string;
    ra: string;
    location: string | null;
    present: boolean;
}) => {
    return (
        <div className={`${styles.participant} ${present ? styles.present : styles.absent}`}>
            <img
                src={present ? '/check.svg' : '/close.svg'}
                alt={present ? 'Presente' : 'Ausente'}
                className={styles.statusIcon}
            />
            <p>
                <strong>Nome:</strong> {name} <strong>RA:</strong> {ra}{' '}
                <strong>Localização:</strong> {location || 'Não confirmou presença'}
            </p>
        </div>
    );
};

export default Participant;
