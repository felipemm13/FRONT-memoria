"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card } from '@tremor/react';
import Cards from '@/Components/Cards';
import Connect from '@/Connect/Connect';
import { useRouter } from 'next/navigation';

const Home = () => {
  const [devices, setDevices] = useState([]);
  const router = useRouter();

  const connect = useMemo(() => new Connect(), []);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await connect.get('/devices');
        setDevices(response);
      } catch (error) {
        console.error('Failed to fetch devices:', error);
      }
    };

    fetchDevices();
  }, [connect]);

  const handleAddDevice = () => {
    router.push('/create');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      {/* Botón Añadir Dispositivo */}
      <Button
        onClick={handleAddDevice}
        className="bg-green-500 text-white px-4 py-2 rounded shadow-lg"
      >
        Añadir Dispositivo
      </Button>

      <Card className="w-full max-w-4xl">
        <Cards data={devices} setDevices={setDevices} />
      </Card>
    </div>
  );
};

export default Home;
