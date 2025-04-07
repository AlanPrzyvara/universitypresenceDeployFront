"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/login.module.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/users/sign_in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: {
                        email,
                        password,
                    },
                }),
            });

            if (response.status === 200) {
                const authorizationHeader = response.headers.get('Authorization');

                if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
                    const token = authorizationHeader.split(' ')[1];
                    localStorage.setItem('authToken', token);
                    console.log('Token salvo no localStorage:', token);
                } else {
                    console.warn('Cabeçalho Authorization não encontrado ou inválido.');
                }

                const data = await response.json();
                console.log('Usuário logado:', data.data.attributes);
                router.push('/admin/event');
            } else {
                throw new Error('Erro ao realizar login');
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                <img src="/logo.svg" alt="Logo" />
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h1 className={styles.title}>Insira seu usuário e senha</h1>
                <div className={styles.inputGroup}>
                    <input
                        type="email"
                        id="email"
                        placeholder='Usuário'
                        autoComplete='username'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <input
                        type="password"
                        id="password"
                        placeholder='Digite sua senha'
                        autoComplete='current-password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className={styles.button}>
                    Entrar
                </button>
            </form>
        </div>
    );
};

export default Login;