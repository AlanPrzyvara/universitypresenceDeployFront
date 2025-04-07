import React from 'react';
import styles from '../styles/eventItem.module.css';

interface EventItemProps {
    id: string;
    name: string;
    description: string;
    location: string;
    eventStart: string;
    eventEnd: string;
    onViewDetails: (id: string) => void;
}

const truncateDescription = (text: string, maxLength: number): string => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const EventItem: React.FC<EventItemProps> = ({ id, name, description, location, eventStart, eventEnd, onViewDetails }) => {
    return (
        <div className={styles.eventItemWrapper}>
            <div className={styles.card}>
                <div className={styles.banner} />
                <p className={styles.datetime}>
                    {new Date(eventStart).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                    })}, {new Date(eventStart).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </p>
                <img src="/logo.svg" alt="Logo" className={styles.logo} />
                <div className={styles.locationContainer}>
                    <img src="/map-pin.svg" alt="Location Icon" className={styles.locationIcon} />
                    <p className={styles.location}>{location}</p>
                </div>
            </div>
            <div className={styles.info}>
                <h2 className={styles.title}>{name}</h2>
                <p className={styles.description}>{truncateDescription(description, 150)}</p>
                <button className={styles.button} onClick={() => onViewDetails(id)}>
                    Ver Detalhes
                </button>
            </div>
        </div>
    );
};


export default EventItem;
