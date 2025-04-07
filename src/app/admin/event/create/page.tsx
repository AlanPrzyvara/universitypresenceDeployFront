"use client";

import React, { useState, useEffect } from 'react';
import styles from '../../../styles/eventForm.module.css';
import { useRouter } from 'next/navigation';
import ConfirmationModal from '../../../components/ConfirmationModal';
import Divider from '../../../components/Divider';
import { Urbanist } from 'next/font/google';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const urbanist = Urbanist({ subsets: ['latin'] })

const CreateEventPage: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        event_start: '',
        event_end: '',
        course_id: '',
        location: '',
        class_room_ids: '',
    });
    const [courses, setCourses] = useState<{ id: string; attributes: { name: string } }[]>([]);
    const [classRooms, setClassRooms] = useState<{ id: string; attributes: { name: string } }[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState<'create' | 'cancel' | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await fetch(`${apiUrl}/admin/courses`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setCourses(data.data);
                } else {
                    console.error('Erro ao buscar cursos.');
                }
            } catch (error) {
                console.error('Erro:', error);
            }
        };
        fetchCourses();
    }, []);

    const handleCourseChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCourseId = e.target.value;
        setFormData({ ...formData, course_id: selectedCourseId });

        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`${apiUrl}/admin/courses/${selectedCourseId}/class_rooms`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setClassRooms(data.data);
            } else {
                console.error('Erro ao buscar turmas.');
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const handleClassRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({ ...formData, class_room_ids: e.target.value });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('authToken');

        const formatToGMT3 = (date: string) => {
            if (!date) return '';
            return `${date}:00-03:00`;
        };

        const payload = {
            data: {
                type: 'event',
                attributes: {
                    ...formData,
                    event_start: formatToGMT3(formData.event_start),
                    event_end: formatToGMT3(formData.event_end),
                    class_room_ids: formData.class_room_ids.split(',').map(id => id.trim()),
                },
            },
        };

        try {
            const response = await fetch(`${apiUrl}/admin/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                router.push('/admin/event');
            } else {
                alert('Erro ao criar evento.');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao criar evento.');
        }
    };

    const handleModalConfirm = () => {
        if (modalAction === 'create') {
            handleSubmit();
        } else if (modalAction === 'cancel') {
            router.push('/admin/event');
        }
        setIsModalOpen(false);
        setModalAction(null);
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
        setModalAction(null);
    };

    return (
        
        <div className={`${styles.pageContainer} ${urbanist.className}`}>
            <h1 className={styles.title}>Criar Evento</h1>
            <Divider />
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    setModalAction('create');
                    setIsModalOpen(true);
                }}
                className={styles.form}
            >
                <p className={styles.namefield}>Nome:</p>
                <input
                    type="text"
                    name="name"
                    placeholder="Nome do evento"
                    value={formData.name}
                    onChange={handleChange}
                    className={styles.input}
                    required
                />
                <p className={styles.namefield}>Descrição:</p>
                <textarea
                    name="description"
                    placeholder="Descrição"
                    value={formData.description}
                    onChange={handleChange}
                    className={styles.textarea}
                    required
                />
                <p className={styles.namefield}>Data e hora inicial:</p>
                <input
                    type="datetime-local"
                    name="event_start"
                    value={formData.event_start}
                    onChange={handleChange}
                    onFocus={(e) => {
                        if ('showPicker' in e.target) {
                            (e.target as any).showPicker();
                        }
                    }}
                    className={styles.inputDateTime}
                    // className={styles.input}
                    required
                />
                <p className={styles.namefield}>Data e hora final:</p>
                <input
                    type="datetime-local"
                    name="event_end"
                    value={formData.event_end}
                    onChange={handleChange}
                    onFocus={(e) => {
                        if ('showPicker' in e.target) {
                            (e.target as any).showPicker();
                        }
                    }}
                    className={styles.inputDateTime}
                    // className={styles.input}
                    required
                />
                <p className={styles.namefield}>Local:</p>
                <input
                    type="text"
                    name="location"
                    placeholder="Localização"
                    value={formData.location}
                    onChange={handleChange}
                    className={styles.input}
                    required
                />
                <p className={styles.namefield}>Curso:</p>
                <select
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleCourseChange}
                    className={styles.select}
                    required
                >
                    <option value="">Selecione um curso</option>
                    {courses.map(course => (
                        <option key={course.id} value={course.id}>
                            {course.attributes.name}
                        </option>
                    ))}
                </select>
                <p className={styles.namefield}>Turma:</p>
                <select
                    name="class_room_ids"
                    value={formData.class_room_ids}
                    onChange={handleClassRoomChange}
                    className={styles.select}
                    required
                >
                    <option value="">Selecione uma turma</option>
                    {classRooms.map(classRoom => (
                        <option key={classRoom.id} value={classRoom.id}>
                            {classRoom.attributes.name}
                        </option>
                    ))}
                </select>
                <div className={styles.buttonContainer}>
                    <button
                        type="button"
                        className={styles.closeButton}
                        onClick={() => {
                            setModalAction('cancel');
                            setIsModalOpen(true);
                        }}
                    >
                        Cancelar
                    </button>
                    <button type="submit" className={styles.submitButton}>Criar Evento</button>
                </div>
            </form>
            <ConfirmationModal
                isOpen={isModalOpen}
                message={modalAction === 'create' ? 'Confira as informações do evento antes de criar. Tem certeza que deseja criar o evento?' : 'Tem certeza que deseja cancelar a criação do evento? As informações não serão salvas.'}
                onConfirm={handleModalConfirm}
                onCancel={handleModalCancel}
            />
        </div>
    );
};

export default CreateEventPage;
