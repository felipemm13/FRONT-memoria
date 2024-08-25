"use client";

import { Card } from '@tremor/react';
import React, { useEffect, useState } from 'react';
import Connect from '@/Connect/Connect';
import { useRouter } from 'next/navigation';


export default function EditDevice() {
  const [device, setDevice] = useState(null);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const connect = new Connect();
  const router = useRouter();


  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const encodedDevice = searchParams.get('device');

    if (encodedDevice) {
      try {
        const decodedDevice = JSON.parse(decodeURIComponent(encodedDevice));
        setDevice(decodedDevice);
      } catch (error) {
        console.error('Failed to parse device JSON:', error);
      }
    }
  }, []);

  const handleDeviceChange = (e, field) => {
    setDevice((prevDevice) => ({
      ...prevDevice,
      [field]: e.target.value,
    }));
  };

  const handleInputChange = (e, tabId, field) => {
    setDevice((prevDevice) => ({
      ...prevDevice,
      tabs: prevDevice.tabs.map((tab) =>
        tab.id === tabId ? { ...tab, [field]: e.target.value } : tab
      ),
    }));
  };

  const handleElementChange = (e, tabId, elementId, field) => {
    setDevice((prevDevice) => ({
      ...prevDevice,
      tabs: prevDevice.tabs.map((tab) =>
        tab.id === tabId
          ? {
              ...tab,
              elements: tab.elements.map((element) =>
                element.id === elementId
                  ? { ...element, [field]: e.target.value }
                  : element
              ),
            }
          : tab
      ),
    }));
  };

  const addNewElement = (tabId) => {
    const newElement = {
      id: device.tabs.find(tab => tab.id === tabId).elements.length + 1,
      nameId: 1,
      label: "Firmware Version",
      enabled: true,
      visible: true,
      readOnly: true,
      type: "integer",
      length: 10,
      offset: 0,
    };

    setDevice((prevDevice) => ({
      ...prevDevice,
      tabs: prevDevice.tabs.map((tab) =>
        tab.id === tabId
          ? { ...tab, elements: [...tab.elements, newElement] }
          : tab
      ),
    }));
  };

  const removeTab = (tabId) => {
    setDevice((prevDevice) => ({
      ...prevDevice,
      tabs: prevDevice.tabs.filter((tab) => tab.id !== tabId),
    }));
    setCurrentTabIndex(0);
  };

  const removeElement = (tabId, elementId) => {
    setDevice((prevDevice) => ({
      ...prevDevice,
      tabs: prevDevice.tabs.map((tab) =>
        tab.id === tabId
          ? { ...tab, elements: tab.elements.filter((element) => element.id !== elementId) }
          : tab
      ),
    }));
  };

  const goToNextTab = () => {
    setCurrentTabIndex((prevIndex) => Math.min(prevIndex + 1, device.tabs.length - 1));
  };

  const goToPreviousTab = () => {
    setCurrentTabIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const createNewTab = () => {
    const newTabId = device.tabs.length + 1;
    const newTab = {
      id: newTabId,
      label: `Tab ${newTabId}`,
      enabled: true,
      visible: true,
      elements: [],
    };

    setDevice((prevDevice) => ({
      ...prevDevice,
      tabs: [...prevDevice.tabs, newTab],
    }));

    setCurrentTabIndex(newTabId - 1); // Cambia a la nueva tab creada
  };

  const saveDevice = async () => {
    try {
      console.log(device)
      await connect.update(`/devices/${device.deviceId}`, device);
      alert('Device updated successfully!');
      router.push('/home');
    } catch (error) {
      console.error('Failed to update the device:', error);
      alert('Failed to update the device.');
    }
  };

  if (!device) {
    return <div>Loading...</div>;
  }

  const currentTab = device.tabs[currentTabIndex];

  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen space-y-4 px-4">
      {/* Card para editar las propiedades principales del dispositivo */}
      <Card className="w-full mb-4 p-4 shadow-lg rounded-lg relative">
        <button
          onClick={saveDevice}
          className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg"
        >
          Guardar
        </button>
        <h2 className="text-lg font-semibold mb-4 text-center">Device Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={device.name}
              onChange={(e) => handleDeviceChange(e, 'name')}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Minimum Firmware Version</label>
            <input
              type="text"
              value={device.minFwVersion}
              onChange={(e) => handleDeviceChange(e, 'minFwVersion')}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Minimum Hardware Version</label>
            <input
              type="text"
              value={device.minHwVersion}
              onChange={(e) => handleDeviceChange(e, 'minHwVersion')}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Number of Elements</label>
            <input
              type="number"
              value={device.numElements}
              onChange={(e) => handleDeviceChange(e, 'numElements')}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </Card>

      <div className="w-full">
        <Card className="mb-4 p-4 shadow-lg rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-center flex justify-between items-center">
            {currentTab.label}
            <button
              onClick={() => removeTab(currentTab.id)}
              className="bg-red-500 text-white px-4 py-1 rounded shadow-lg"
            >
              Eliminar Tab
            </button>
          </h2>

          {/* Propiedades principales en ancho completo */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium">ID</label>
              <input
                type="text"
                value={currentTab.id}
                onChange={(e) => handleInputChange(e, currentTab.id, 'id')}
                className="w-full p-2 border rounded"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Label</label>
              <input
                type="text"
                value={currentTab.label}
                onChange={(e) => handleInputChange(e, currentTab.id, 'label')}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Enabled</label>
              <select
                value={currentTab.enabled}
                onChange={(e) => handleInputChange(e, currentTab.id, 'enabled')}
                className="w-full p-2 border rounded"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Visible</label>
              <select
                value={currentTab.visible}
                onChange={(e) => handleInputChange(e, currentTab.id, 'visible')}
                className="w-full p-2 border rounded"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          </div>

          {/* Elementos en formato grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {currentTab.elements.map((element) => (
              <React.Fragment key={element.id}>
                <div className="col-span-1 relative">
                  <button
                    onClick={() => removeElement(currentTab.id, element.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded shadow-lg"
                  >
                    Eliminar
                  </button>
                  <div className="p-2 bg-gray-200 rounded-md shadow-md">
                    <strong>Element ID: {element.id}</strong>
                  </div>
                  <div className="mt-2">
                    <label className="block text-sm font-medium">Label</label>
                    <input
                      type="text"
                      value={element.label}
                      onChange={(e) =>
                        handleElementChange(e, currentTab.id, element.id, 'label')
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mt-2">
                    <label className="block text-sm font-medium">Type</label>
                    <input
                      type="text"
                      value={element.type}
                      onChange={(e) =>
                        handleElementChange(e, currentTab.id, element.id, 'type')
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mt-2">
                    <label className="block text-sm font-medium">Enabled</label>
                    <select
                      value={element.enabled}
                      onChange={(e) =>
                        handleElementChange(e, currentTab.id, element.id, 'enabled')
                      }
                      className="w-full p-2 border rounded"
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </div>
                  <div className="mt-2">
                    <label className="block text-sm font-medium">Visible</label>
                    <select
                      value={element.visible}
                      onChange={(e) =>
                        handleElementChange(e, currentTab.id, element.id, 'visible')
                      }
                      className="w-full p-2 border rounded"
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </div>
                  <div className="mt-2">
                    <label className="block text-sm font-medium">ReadOnly</label>
                    <select
                      value={element.readOnly}
                      onChange={(e) =>
                        handleElementChange(e, currentTab.id, element.id, 'readOnly')
                      }
                      className="w-full p-2 border rounded"
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </div>
                  <div className="mt-2">
                    <label className="block text-sm font-medium">Length</label>
                    <input
                      type="number"
                      value={element.length}
                      onChange={(e) =>
                        handleElementChange(e, currentTab.id, element.id, 'length')
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mt-2">
                    <label className="block text-sm font-medium">Offset</label>
                    <input
                      type="number"
                      value={element.offset}
                      onChange={(e) =>
                        handleElementChange(e, currentTab.id, element.id, 'offset')
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Botón para añadir un nuevo elemento */}
          <button
            onClick={() => addNewElement(currentTab.id)}
            className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
          >
            Add New Element
          </button>
        </Card>

        <div className="flex justify-between mt-4">
          <button
            onClick={goToPreviousTab}
            disabled={currentTabIndex === 0}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>
          {currentTabIndex === device.tabs.length - 1 && (
            <button
              onClick={createNewTab}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Create New Tab
            </button>
          )}
          <button
            onClick={goToNextTab}
            disabled={currentTabIndex === device.tabs.length - 1}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
