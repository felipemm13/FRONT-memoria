"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = (e) => {
        e.preventDefault();

        // Verificar las credenciales con las del .env
        const envUsername = process.env.NEXT_PUBLIC_USERNAME;
        const envPassword = process.env.NEXT_PUBLIC_PASSWORD;

        if (username === envUsername && password === envPassword) {
            router.push('/home');
        } else {
            alert('Las credenciales son incorrectas');
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <h1 className="text-xl mb-6">Plataforma De Configuración Para Archivos De Telemetría</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="userInput" className="block text-sm font-medium text-gray-700">Usuario</label>
                        <input
                            type="text"
                            id="userInput"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="passwordInput" className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            id="passwordInput"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col space-y-4">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                            Enviar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
