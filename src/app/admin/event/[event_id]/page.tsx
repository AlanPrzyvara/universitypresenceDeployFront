"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import axios from 'axios';
import styles from '../../../styles/eventShow.module.css';
import { Urbanist } from 'next/font/google';
import EventCard from '@/app/components/eventCard';
import QRCode from 'react-qr-code';
import Divider from '@/app/components/Divider';
import ReactModal from 'react-modal';
import ParticipantsPresence from '../../../components/ParticipantsPresence';

const urbanist = Urbanist({ subsets: ['latin'] });

const EventShow: React.FC = () => {
    const { event_id } = useParams();
    const [event, setEvent] = useState<any | null>(null);
    const [presenceUrl, setPresenceUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);
    const router = useRouter();

    const openQrCodeModal = () => setIsQrCodeModalOpen(true);
    const closeQrCodeModal = () => setIsQrCodeModalOpen(false);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get(`${apiUrl}/admin/events/${event_id}?include=course`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setEvent(response.data);
                setPresenceUrl(response.data.meta?.presence_url || null);
            } catch (err) {
                setError('Erro ao carregar detalhes do evento.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [event_id]);

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const eventAttributes = event.data.attributes;
    const courseAttributes = event.included?.[0]?.attributes;

    return (    
        <>
        <div className={`${styles.container} ${urbanist.className}`}>
            <div className={styles.titleContainer}>
                <button className={styles.button} onClick={() => router.push('/admin/event')}>
                    <img src="/angle-left.svg" alt="Back Arrow" className={styles.arrowIcon} />
                </button>
                <h1 className={styles.title}>{eventAttributes.name}</h1>
            </div>
            <Divider />
            <div className={styles.eventCard}>
                <div className={styles.eventInfo}>
                    <EventCard 
                        name={eventAttributes.name}
                        eventStart={eventAttributes.event_start}
                        eventEnd={eventAttributes.event_end}
                        course={courseAttributes?.name}
                        location={`${eventAttributes.location.amenity}, ${eventAttributes.location.road}, ${eventAttributes.location.town}, ${eventAttributes.location.state}, ${eventAttributes.location.postcode}`}
                        description={eventAttributes.description}
                    />
                </div>
                {presenceUrl && (
                    <div className={styles.qrCodeContainer}>
                        <h2 className={styles.qrCodeTitle}>QR Code para Presença:</h2>
                        <QRCode value={presenceUrl} onClick={openQrCodeModal} style={{ cursor: 'pointer' }} />
                    </div>
                )}
                <div className={styles.participantsList}>
                    <h2 className={styles.participantTitle}>Participantes do Evento</h2>
                    {event_id && <ParticipantsPresence eventId={event_id as string} />}
                </div>
            </div>
        </div>

        <ReactModal
            isOpen={isQrCodeModalOpen}
            onRequestClose={closeQrCodeModal}
            className={styles.fullscreenModal}
            overlayClassName={styles.overlay}
        >
            <div className={styles.modalHeader}>
                <button className={styles.closeButton} onClick={closeQrCodeModal}>Fechar</button>
            </div>
            <div className={styles.qrCodeFullscreenContainer}>
                <QRCode value={presenceUrl || ''} size={512} />
            </div>
        </ReactModal>
        </>
    );
};

export default EventShow;
