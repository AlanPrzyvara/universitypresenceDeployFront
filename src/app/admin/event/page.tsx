"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventItem from '@/app/components/eventItem';
import Divider from '@/app/components/Divider';
import EventAdd from '@/app/components/eventAdd';
import styles from '../../styles/event.module.css';
import { Urbanist } from 'next/font/google';
import { useRouter } from 'next/navigation';

const urbanist = Urbanist({ subsets: ['latin'] });
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const EventList: React.FC = () => {
    const router = useRouter();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get(`${apiUrl}/admin/events?q[sorts]=event_start asc`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setEvents(response.data.data);
            } catch (err) {
                setError('Erro ao carregar eventos.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className={`${styles.container} ${urbanist.className}`}>
            <h1 className={styles.title}>Eventos</h1>
            <Divider />
            <div className={styles.eventList}>
                {events.map((event) => (
                    <EventItem
                        key={event.id}
                        id={event.attributes.id}
                        name={event.attributes.name}
                        description={event.attributes.description}
                        eventStart={event.attributes.event_start}
                        eventEnd={event.attributes.event_end}
                        location={event.attributes.location.amenity}
                        onViewDetails={(id) => router.push(`/admin/event/${id}`)}
                    />
                ))}
            </div>
            <EventAdd />
        </div>
    );
};

export default EventList;
