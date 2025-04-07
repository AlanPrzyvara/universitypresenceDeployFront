import React from 'react';
import styles from '../styles/eventCard.module.css';
import { Urbanist } from 'next/font/google';

interface EventCardProps {
    name: string;
    eventStart: string;
    eventEnd: string;
    course: string;
    location: string;
    description: string;
}

const urbanist = Urbanist({ subsets: ['latin'] });

const formatDatePtBr = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
    });
};

const formatTimePtBr = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

const EventCard: React.FC<EventCardProps> = ({ name, eventStart, eventEnd, course, location,  description }) => {
    const startDate = formatDatePtBr(eventStart);
    const startTime = formatTimePtBr(eventStart);
    const endDate = formatDatePtBr(eventEnd);
    const endTime = formatTimePtBr(eventEnd);

    return (
        <div className={`${styles.card} ${urbanist.className}`}>
            <div className={styles.detailsContainer}>
                <div className={styles.eventName}>
                    <p className={styles.detailContent}>{name}</p>
                </div>
                <div className={styles.detailItem}>
                    <img src="/calendar.svg" alt="Calendar Icon" className={styles.calendarIcon} />
                    <p className={styles.detailContent}>De {startDate} a {endDate}</p>
                </div>
                <div className={styles.detailItem}>
                    <img src="/clock.svg" alt="Clock Icon" className={styles.clockIcon} />
                    <p className={styles.detailContent}>{startTime} a {endTime}</p>
                </div>
                <div className={styles.detailItem}>
                    <img src="/graduation.svg" alt="Graduation Icon" className={styles.graduationIcon} />
                    <p className={styles.detailContent}>{course}</p>
                </div>
                <div className={styles.detailItem}>
                    <div className={styles.locationContainer}>
                        <img src="/map-pin.svg" alt="Location Icon" className={styles.locationIcon} />
                        <p className={styles.detailContent}>{location}</p>
                    </div>
                </div>
                <div className={styles.dateTimeContainer}>
                    <div className={styles.detailItem}>
                        <div className={styles.descriptionContainer}>
                            <p className={styles.detailContent}>{description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
