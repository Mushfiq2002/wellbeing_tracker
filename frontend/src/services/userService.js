import axiosInstance from './axiosInstance';

export const getEmergencyContacts = async () => {
    const response = await axiosInstance.get('/users/emergency-contacts');
    return response.data;
};

export const addEmergencyContact = async (contactData) => {
    const response = await axiosInstance.post('/users/emergency-contacts', contactData);
    return response.data;
};

export const removeEmergencyContact = async (contactId) => {
    const response = await axiosInstance.delete(`/users/emergency-contacts/${contactId}`);
    return response.data;
};
