import { useState, useEffect } from 'react';
import { FiPlus, FiCheck, FiMapPin, FiTrash2 } from 'react-icons/fi';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';

interface Address {
    _id: string;
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
}

interface AddressSelectorProps {
    selectedId?: string;
    onSelect: (address: Address) => void;
}

export const AddressSelector = ({ selectedId, onSelect }: AddressSelectorProps) => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newAddress, setNewAddress] = useState<Partial<Address>>({});

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const response = await api.get('/addresses');
            if (response.data.success) {
                setAddresses(Array.isArray(response.data.data) ? response.data.data : []);
                // Auto-select default if no selection
                if (!selectedId && Array.isArray(response.data.data)) {
                    const defaultAddr = response.data.data.find((a: Address) => a.isDefault);
                    if (defaultAddr) onSelect(defaultAddr);
                }
            }
        } catch (error) {
            console.error("Failed to load addresses");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/addresses', newAddress);
            if (response.data.success) {
                toast.success('Address saved');
                const created = response.data.data;
                setAddresses(prev => [...(Array.isArray(prev) ? prev : []), created]);
                onSelect(created);
                setShowForm(false);
                setNewAddress({});
            }
        } catch (error) {
            toast.error('Failed to save address');
        }
    };

    return (
        <div className="space-y-4">
            {isLoading ? (
                <div className="text-center py-4 text-gray-500">Loading addresses...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.isArray(addresses) && addresses.map((addr) => (
                        <div
                            key={addr._id}
                            onClick={() => onSelect(addr)}
                            className={`relative p-4 border rounded-xl cursor-pointer transition-all ${selectedId === addr._id
                                ? 'border-black bg-gray-50 ring-1 ring-black'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            {selectedId === addr._id && (
                                <div className="absolute top-3 right-3 text-black">
                                    <FiCheck className="w-5 h-5" />
                                </div>
                            )}
                            <div className="flex items-start gap-3">
                                <FiMapPin className={`mt-1 ${selectedId === addr._id ? 'text-black' : 'text-gray-400'}`} />
                                <div>
                                    <p className="font-bold text-gray-900">{addr.fullName}</p>
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                        {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">Phone: {addr.phone}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add New Button */}
                    <button
                        type="button"
                        onClick={() => setShowForm(true)}
                        className="flex flex-col items-center justify-center p-4 border border-dashed border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all text-gray-500 min-h-[140px]"
                    >
                        <FiPlus className="w-6 h-6 mb-2" />
                        <span className="font-medium text-sm">Add New Address</span>
                    </button>
                </div>
            )}

            {/* Basic Modal for New Address */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Add New Address</h3>
                        <form onSubmit={handleCreate} className="space-y-3">
                            <input
                                placeholder="Full Name"
                                className="w-full p-2 border rounded"
                                onChange={e => setNewAddress({ ...newAddress, fullName: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Phone"
                                className="w-full p-2 border rounded"
                                onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Address"
                                className="w-full p-2 border rounded"
                                onChange={e => setNewAddress({ ...newAddress, address: e.target.value })}
                                required
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    placeholder="City"
                                    className="w-full p-2 border rounded"
                                    onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                    required
                                />
                                <input
                                    placeholder="State"
                                    className="w-full p-2 border rounded"
                                    onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                                    required
                                />
                            </div>
                            <input
                                placeholder="Pincode"
                                className="w-full p-2 border rounded"
                                onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                required
                            />

                            <div className="flex gap-2 mt-4">
                                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 border rounded text-gray-700">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-black text-white rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
