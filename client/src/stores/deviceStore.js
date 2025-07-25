import { create } from 'zustand';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useDeviceStore = create((set, get) => ({
  devices: [],
  device: null,
  loading: false,
  error: null,

  fetchDevices: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/devices');
      set({ devices: response.data, loading: false });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch devices';
      set({ error: message, loading: false });
      toast.error(message);
      return [];
    }
  },

  fetchDevice: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/devices/${id}`);
      set({ device: response.data, loading: false });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch device';
      set({ error: message, loading: false });
      toast.error(message);
      return null;
    }
  },

  addDevice: async (deviceData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/devices', deviceData);
      set(state => ({ 
        devices: [...state.devices, response.data],
        loading: false 
      }));
      toast.success('Device added successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add device';
      set({ error: message, loading: false });
      toast.error(message);
      return null;
    }
  },

  updateDevice: async (id, deviceData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/devices/${id}`, deviceData);
      set(state => ({
        devices: state.devices.map(device => 
          device._id === id ? response.data : device
        ),
        device: response.data,
        loading: false
      }));
      toast.success('Device updated successfully');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update device';
      set({ error: message, loading: false });
      toast.error(message);
      return null;
    }
  },

  deleteDevice: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/devices/${id}`);
      set(state => ({
        devices: state.devices.filter(device => device._id !== id),
        loading: false
      }));
      toast.success('Device deleted successfully');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete device';
      set({ error: message, loading: false });
      toast.error(message);
      return false;
    }
  },

  clearDevice: () => {
    set({ device: null });
  },

  // Update a device in the store with real-time data
  updateDeviceInStore: (deviceId, updateData) => {
    set(state => {
      // Find the device in the devices array
      const updatedDevices = state.devices.map(device => {
        if (device._id === deviceId) {
          // Update the device with the new data
          return {
            ...device,
            status: updateData.status || device.status,
            lastSeen: updateData.lastSeen || device.lastSeen,
            metrics: updateData.metrics || device.metrics
          };
        }
        return device;
      });

      // If the currently selected device is being updated, update it too
      const updatedDevice = state.device && state.device._id === deviceId
        ? {
            ...state.device,
            status: updateData.status || state.device.status,
            lastSeen: updateData.lastSeen || state.device.lastSeen,
            metrics: updateData.metrics || state.device.metrics
          }
        : state.device;

      return {
        devices: updatedDevices,
        device: updatedDevice
      };
    });
  }
}));