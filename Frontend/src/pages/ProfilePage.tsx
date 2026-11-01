import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { RootState } from '../store';
import { api } from '../services/api';
import { FiUser, FiPhone, FiLock, FiSave } from 'react-icons/fi';
import { getErrorMessage } from '../utils/errorHandler';

const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(6, 'Password must be at least 6 characters').optional(),
}).refine((data) => {
    if (data.newPassword && !data.currentPassword) {
        return false;
    }
    return true;
}, {
    message: "Current password is required to set a new password",
    path: ["currentPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfilePage = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const [isServing, setIsServing] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || '',
            phone: user?.phone || '',
        }
    });

    const onSubmit = async (data: ProfileFormValues) => {
        setIsServing(true);
        try {
            const response = await api.put('/auth/profile', data);

            if (response.data.success) {
                toast.success('Profile updated successfully');
                // Update local state if needed implementation dependent
                // dispatch(loginSuccess({ user: response.data.data.user, token: localStorage.getItem('token') }));

                // Clear password fields
                reset({
                    name: data.name,
                    phone: data.phone,
                    currentPassword: '',
                    newPassword: ''
                });
            }
        } catch (error: any) {
            toast.error(getErrorMessage(error, 'Failed to update profile'));
        } finally {
            setIsServing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 pb-28 md:pb-12">
            <div className="container mx-auto px-4 max-w-xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">My Profile</h1>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* Personal Info Section */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FiUser className="text-primary-600" /> Personal Details
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        {...register('name')}
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <div className="relative">
                                        <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            {...register('phone')}
                                            type="text"
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="text"
                                        value={user?.email}
                                        disabled
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Security Section */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FiLock className="text-primary-600" /> Security
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password (Optional)</label>
                                    <input
                                        {...register('newPassword')}
                                        type="password"
                                        placeholder="Leave blank to keep current"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    />
                                    {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                    <input
                                        {...register('currentPassword')}
                                        type="password"
                                        placeholder="Required to set new password"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    />
                                    {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isServing}
                            className="w-full bg-black text-white hover:bg-gray-800 font-bold py-3 rounded-xl shadow-lg shadow-gray-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {isServing ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <FiSave /> Save Changes
                                </>
                            )}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};
