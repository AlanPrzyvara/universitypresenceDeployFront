"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import EventCard from '@/app/components/eventCard';
import { LocationProvider, useLocation } from '@/app/context/LocationContext';
import EventParticipants from '@/app/styles/eventParticipants.module.css'; 
import { Urbanist } from 'next/font/google';
import Modal from '@/app/components/Modal';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const urbanist = Urbanist({ subsets: ['latin'] });

type EventData = {
    data: {
        attributes: {
            name: string;
            event_start: string;
            event_end: string;
            description: string;
            location: {
                amenity: string;
                road: string;
                town: string;
                state: string;
                postcode: string;
            };
        };
    };
    included?: {
        attributes: {
            name: string;
        };
    }[];
};

const EventDetails: React.FC = () => {
    const { event_id } = useParams();
    const { coords, requestLocation } = useLocation();
    const [event, setEvent] = useState<EventData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ra, setRa] = useState('');
    const [presenceConfirmed, setPresenceConfirmed] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`${apiUrl}/participants/${event_id}?include=course`);
                setEvent(response.data);
            } catch (err) {
                console.error(err); // evita eslint error
                setError('Erro ao carregar detalhes do evento.');
            } finally {
                setLoading(false);
            }
        };

        if (event_id) {
            fetchEvent();
        }
    }, [event_id]);

    useEffect(() => {
        requestLocation();
    }, [requestLocation]);

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>{error}</p>;
    if (!event) return <p>Evento não encontrado.</p>;

    const eventAttributes = event.data.attributes;
    const courseAttributes = event.included?.[0]?.attributes;

    const handleLocationAndOpenModal = () => {
        requestLocation();
        if (coords) setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            data: {
                type: 'participant',
                attributes: {
                    ra: ra,
                    latitude: coords?.latitude,
                    longitude: coords?.longitude
                }
            }
        };

        try {
            await fetch(`${apiUrl}/participants/${event_id}/confirm_presence`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
            });

            setPresenceConfirmed(true);
            setIsModalOpen(false);

            setTimeout(() => {
                setPresenceConfirmed(false);
            }, 2000);
        } catch (err) {
            console.error(err); // evita eslint error
            setError('Ocorreu um erro ao confirmar sua presença.');
        }
    };

    return (    
        <>
            <div className={EventParticipants.card}>
                <EventCard 
                    name={eventAttributes.name}
                    eventStart={eventAttributes.event_start}
                    eventEnd={eventAttributes.event_end}
                    course={courseAttributes?.name || ''}
                    location={`${eventAttributes.location.amenity}, ${eventAttributes.location.road}, ${eventAttributes.location.town}, ${eventAttributes.location.state}, ${eventAttributes.location.postcode}`}
                    description={eventAttributes.description}
                />
            </div>
            <div className={`${EventParticipants.confirmButtonContainer} ${urbanist.className}`}>
                <button 
                    className={`${EventParticipants.confirmButton} ${urbanist.className}`} 
                    onClick={handleLocationAndOpenModal}
                    disabled={!coords}
                >
                    Confirmar Presença
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className={EventParticipants.modalContent}>
                    {presenceConfirmed ? (
                        <p className={EventParticipants.successMessage}>
                            Presença confirmada com sucesso!
                        </p>
                    ) : (
                        <form className={EventParticipants.formContainer} onSubmit={handleSubmit}>
                            <h1>Insira seu R.A. para confirmar sua presença</h1>
                            <input 
                                type="text" 
                                placeholder='R.A.' 
                                value={ra}
                                onChange={(e) => setRa(e.target.value)}
                            />
                            <button 
                                type="submit"
                                className={`${EventParticipants.conteinerConfirmButton} ${urbanist.className}`} 
                                disabled={!coords || !ra}
                            >
                                Confirmar Presença
                            </button>
                        </form>
                    )}
                </div>
            </Modal>

            {presenceConfirmed && (
                <div className={EventParticipants.toastMessage}>
                    Presença confirmada com sucesso!
                </div>
            )}
        </>
    );
};

const EventShow: React.FC = () => {
    return (
        <div className={EventParticipants.page}>
            <LocationProvider>
                <EventDetails />
            </LocationProvider>
        </div>
    );
};

export default EventShow;
