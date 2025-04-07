import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/eventAdd.module.css';

const EventAdd: React.FC = () => {
    const router = useRouter();

    const handleAddEvent = () => {
        router.push('/admin/event/create');
    };

    return (
        <button className={styles.addButton} onClick={handleAddEvent}>
            +
        </button>
    );
};

export default EventAdd;
