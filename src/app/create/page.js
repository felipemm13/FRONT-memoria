"use client";

import { Card } from '@tremor/react';
import React, { useState } from 'react';
import Connect from '@/Connect/Connect';
import { useRouter } from 'next/navigation';

export default function CreateDevice() {
  const [device, setDevice] = useState({
    deviceId: '', // Parámetro principal
    name: '',
    minFwVersion: '',
    minHwVersion: '',
    numElements: 0,
    tabs: [],
  });
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const connect = new Connect();
  const router = useRouter();

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
      await connect.post('/devices', device);
      alert('Device created successfully!');
      router.push('/home'); // Redirige al usuario a la página principal después de crear el dispositivo
    } catch (error) {
      console.error('Failed to create the device:', error);
      alert('Failed to create the device.');
    }
  };

  const currentTab = device.tabs[currentTabIndex];

  return (
    <div className="relative flex flex-col items-center min-h-screen space-y-4 p-4">
      {/* Card para editar las propiedades principales del dispositivo */}
      <Card className="w-full mb-4 p-4 shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Device Information</h2>
          {/* Botón Guardar */}
          <button
            onClick={saveDevice}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow-lg"
          >
            Guardar
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Device ID</label>
            <input
              type="text"
              value={device.deviceId}
              onChange={(e) => handleDeviceChange(e, 'deviceId')}
              className="w-full p-2 border rounded"
            />
          </div>
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

      {device.tabs.length > 0 && (
        <>
          <Card className="w-full mb-4 p-4 shadow-lg rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Tab Properties</h2>
              <button
                onClick={() => removeTab(currentTab.id)}
                className="bg-red-500 text-white px-4 py-2 rounded shadow-lg"
              >
                Eliminar Tab
              </button>
            </div>
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
          </Card>

          <Card className="w-full mb-4 p-4 shadow-lg rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Elements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentTab.elements.map((element) => (
                <Card key={element.id} className="p-4 shadow-lg rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <strong>Element ID: {element.id}</strong>
                    <button
                      onClick={() => removeElement(currentTab.id, element.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded shadow-lg"
                    >
                      Eliminar
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div>
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
                    <div>
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
                    <div>
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
                    <div>
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
                    <div>
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
                    <div>
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
                    <div>
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
                </Card>
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
        </>
      )}

      <div className="flex justify-between w-full mt-4">
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
  );
}
