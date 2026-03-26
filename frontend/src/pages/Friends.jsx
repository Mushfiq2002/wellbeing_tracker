import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../services/axiosInstance';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

const Friends = () => {
    const { user } = useSelector((state) => state.auth);
    const [allUsers, setAllUsers] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('discover'); // 'discover' or 'requests'

    useEffect(() => {
        if (user && user.role !== 'user') {
            setMessage('This feature is not available for therapists');
            return;
        }
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const [usersRes, incomingRes, friendsRes, sentRes] = await Promise.all([
                axiosInstance.get('/friends/users'),
                axiosInstance.get('/friends/requests/incoming'),
                axiosInstance.get('/friends/friends'),
                axiosInstance.get('/friends/requests/sent')
            ]);
            setAllUsers(usersRes.data);
            setIncomingRequests(incomingRes.data);
            setFriends(friendsRes.data);
            setSentRequests(sentRes.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
        }
    };

    const handleSendRequest = async (receiverId) => {
        try {
            await axiosInstance.post(`/friends/send/${receiverId}`);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancelRequest = async (receiverId) => {
        try {
            await axiosInstance.delete(`/friends/cancel/${receiverId}`);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleAcceptRequest = async (senderId) => {
        try {
            await axiosInstance.patch(`/friends/accept/${senderId}`);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleRejectRequest = async (senderId) => {
        try {
            await axiosInstance.patch(`/friends/reject/${senderId}`);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemoveFriend = async (friendId) => {
        try {
            await axiosInstance.delete(`/friends/remove/${friendId}`);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    if (message) {
        return <div className="p-8 text-center text-red-500 font-bold">{message}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Friends</h1>
            
            {/* Custom Tabs Navigation */}
            <div className="flex space-x-6 border-b mb-6 border-gray-200">
                <button 
                    onClick={() => setActiveTab('discover')} 
                    className={`pb-2 px-1 font-medium text-lg transition border-b-2 ${activeTab === 'discover' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Discover
                </button>
                <button 
                    onClick={() => setActiveTab('requests')} 
                    className={`pb-2 px-1 font-medium text-lg transition border-b-2 flex items-center space-x-2 ${activeTab === 'requests' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    <span>Requests</span>
                    {incomingRequests.length > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {incomingRequests.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Tab Content: Discover */}
            {activeTab === 'discover' && (
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {allUsers.map((u) => {
                            const isFriend = friends.find(f => f.sender._id === u._id || f.receiver._id === u._id);
                            const sentReq = sentRequests.find(r => r.receiver === u._id);
                            const incomingReq = incomingRequests.find(r => r.sender._id === u._id);

                            return (
                                <Card key={u._id} className="shadow-md transition hover:shadow-lg">
                                    <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                                        <div>
                                            <h2 className="text-xl font-semibold">{u.name}</h2>
                                            {u.description && <p className="text-sm text-gray-500">{u.description}</p>}
                                        </div>
                                        <div>
                                            {isFriend ? (
                                                <Button variant="destructive" onClick={() => handleRemoveFriend(u._id)}>Remove Friend</Button>
                                            ) : sentReq?.status === 'pending' ? (
                                                <Button variant="outline" className="text-yellow-600 border-yellow-600" onClick={() => handleCancelRequest(u._id)}>Cancel Request</Button>
                                            ) : incomingReq ? (
                                                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAcceptRequest(u._id)}>Accept</Button>
                                            ) : (
                                                <div className="flex items-center space-x-3">
                                                    {sentReq?.status === 'rejected' && <span className="text-red-500 text-sm font-semibold">Rejected</span>}
                                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleSendRequest(u._id)}>
                                                        {sentReq?.status === 'rejected' ? 'Send Again' : 'Send Request'}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                    {allUsers.length === 0 && <p className="text-gray-500 text-center mt-8">No other users found.</p>}
                </div>
            )}

            {/* Tab Content: Requests */}
            {activeTab === 'requests' && (
                <div>
                    {incomingRequests.length === 0 ? (
                        <p className="text-gray-500 text-center mt-8">No pending friend requests</p>
                    ) : (
                        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
                            {incomingRequests.map((req) => (
                                <Card key={req._id} className="shadow-md transition hover:shadow-lg">
                                    <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                                        <div>
                                            <h2 className="text-xl font-semibold">{req.sender.name}</h2>
                                            {req.sender.description && <p className="text-sm text-gray-500">{req.sender.description}</p>}
                                        </div>
                                        <div className="space-x-2">
                                            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAcceptRequest(req.sender._id)}>Accept</Button>
                                            <Button variant="destructive" onClick={() => handleRejectRequest(req.sender._id)}>Reject</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Friends;
