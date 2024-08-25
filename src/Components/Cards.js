import { useRouter } from 'next/navigation';
import { Card } from '@tremor/react';
import { TrashIcon } from '@heroicons/react/24/solid';
import Connect from '@/Connect/Connect';

export default function Cards({ data, setDevices }) {  // Asegúrate de recibir setDevices como props
  const router = useRouter();
  const connect = new Connect();

  const handleCardClick = (device) => {
    const deviceJson = JSON.stringify(device);
    const encodedDevice = encodeURIComponent(deviceJson);

    router.push(`/edit?device=${encodedDevice}`);
  };

  const handleDeleteClick = async (deviceId) => {
    const confirmed = window.confirm('Are you sure you want to delete this device?');
    if (confirmed) {
      try {
        await connect.delete(`/devices/${deviceId}`);
        alert('Device deleted successfully.');
        
        // Actualiza el estado local eliminando el dispositivo
        setDevices(prevDevices => prevDevices.filter(device => device.deviceId !== deviceId));
      } catch (error) {
        console.error('Failed to delete the device:', error);
        alert('Failed to delete the device.');
      }
    }
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
      {data.map(device => (
        <Card
          key={device.id}
          className="relative mb-4 p-4 shadow-lg rounded-lg cursor-pointer"
          onClick={() => handleCardClick(device)}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">{device.name}</p>
              <p className="text-3xl text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">{device.deviceId}</p>
            </div>
            <TrashIcon
              className="h-6 w-6 text-red-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation(); // Evita que se dispare el onClick del Card
                handleDeleteClick(device.deviceId);
              }}
            />
          </div>
        </Card>
      ))}
    </div>
  );
}
