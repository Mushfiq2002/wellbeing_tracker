import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { getEmergencyContacts, addEmergencyContact, removeEmergencyContact } from '../services/userService';
import { ShieldAlert, Trash2, Plus } from 'lucide-react';

const EmergencyContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', relation: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const data = await getEmergencyContacts();
            setContacts(data);
        } catch (err) {
            console.error('Failed to fetch contacts:', err);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddContact = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const updatedContacts = await addEmergencyContact(formData);
            setContacts(updatedContacts);
            setFormData({ name: '', email: '', relation: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add contact');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveContact = async (id) => {
        if (!window.confirm('Are you sure you want to remove this contact?')) return;
        try {
            const updatedContacts = await removeEmergencyContact(id);
            setContacts(updatedContacts);
        } catch (err) {
            console.error('Failed to remove contact:', err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Card className="shadow-lg border-0 bg-white mb-8">
                <CardHeader className="bg-red-50 text-red-800 rounded-t-lg border-b border-red-100 flex flex-row items-center gap-3">
                    <ShieldAlert className="w-8 h-8 text-red-600" />
                    <div>
                        <CardTitle className="text-2xl font-bold text-red-700">Emergency Alerts</CardTitle>
                        <p className="mt-1 text-red-600 text-sm">
                            If you are inactive for 3 days, an alert will be automatically sent to these contacts.
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={handleAddContact} className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-gray-500" />
                            Add New Contact
                        </h3>
                        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                name="relation"
                                placeholder="Relation (e.g. Brother)"
                                required
                                value={formData.relation}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Adding...' : 'Add Contact'}
                        </button>
                    </form>

                    <div>
                        <h3 className="font-semibold text-gray-800 mb-4">Registered Contacts</h3>
                        {contacts.length === 0 ? (
                            <p className="text-gray-500 text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                No emergency contacts added yet.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {contacts.map(contact => (
                                    <div key={contact._id} className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition">
                                        <div>
                                            <h4 className="font-bold text-gray-800">{contact.name}</h4>
                                            <p className="text-sm text-gray-600">{contact.email} &bull; {contact.relation}</p>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveContact(contact._id)}
                                            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default EmergencyContacts;
