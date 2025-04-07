import React, { useEffect, useState } from 'react';
import Participant from './Participant';
import styles from '../styles/ParticipantsList.module.css';

type ParticipantData = {
  id: string;
  attributes: {
    student_name: string;
    student_ra?: string;
    student_id?: string;
    location?: {
      amenity?: string;
    };
    present: boolean;
  };
};

const ParticipantsPresence = ({ eventId }: { eventId: string }) => {
  const [participants, setParticipants] = useState<ParticipantData[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(
          `${apiUrl}/admin/events/${eventId}/participants?per_page=60`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setParticipants(data.data);
      } catch (error) {
        console.error('Erro ao buscar participantes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [eventId]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.participantsContainer}>
      {participants.map((participant) => (
        <div key={participant.id} className={styles.participantCard}>
          <Participant
            name={participant.attributes.student_name}
            ra={
              participant.attributes.student_ra ||
              participant.attributes.student_id ||
              ''
            }
            location={
              participant.attributes.location?.amenity ||
              'Presença não confirmada ainda'
            }
            present={participant.attributes.present}
          />
        </div>
      ))}
    </div>
  );
};

export default ParticipantsPresence;
