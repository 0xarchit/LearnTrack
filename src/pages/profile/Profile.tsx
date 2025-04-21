import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { Camera, Mail, Lock, User, Phone, MapPin, Building, Calendar } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();

  // sync form state when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        department: user.department || '',
        joinDate: user.joinDate || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  // don't render until user is loaded
  if (!user) return null;

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    department: user?.department || '',
    joinDate: user?.joinDate || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // update profile fields
      await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        department: formData.department,
        joinDate: formData.joinDate,
      });
      // if password fields are set and match, update password
      if (
        formData.currentPassword &&
        formData.newPassword &&
        formData.newPassword === formData.confirmPassword
      ) {
        await changePassword(formData.currentPassword, formData.newPassword);
      }
    } catch (error) {
      console.error('Profile update failed:', error);
    }
    setIsEditing(false);
    // reset password fields
    setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h2>
              <Button
                type="button"
                variant={isEditing ? 'outline' : 'primary'}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                leftIcon={<User size={18} />}
              />
              
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                leftIcon={<Mail size={18} />}
              />
              
              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                leftIcon={<Phone size={18} />}
              />
              
              <Input
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                leftIcon={<MapPin size={18} />}
              />
              
              <Input
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                disabled={!isEditing}
                leftIcon={<Building size={18} />}
              />
              
              <Input
                label="Join Date"
                name="joinDate"
                type="date"
                value={formData.joinDate}
                onChange={handleInputChange}
                disabled={!isEditing}
                leftIcon={<Calendar size={18} />}
              />
            </div>

            {isEditing && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
                <div className="space-y-4">
                  <Input
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    leftIcon={<Lock size={18} />}
                  />
                  
                  <Input
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    leftIcon={<Lock size={18} />}
                  />
                  
                  <Input
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    leftIcon={<Lock size={18} />}
                  />
                </div>
              </div>
            )}

            {isEditing && (
              <div className="mt-6 flex justify-end">
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-full w-full p-4 text-gray-400" />
                    )}
                  </div>
                  <button aria-label="Change avatar" className="absolute bottom-0 right-0 p-1.5 bg-primary-500 rounded-full text-white hover:bg-primary-600 transition-colors">
                    <Camera size={16} />
                  </button>
                </div>
                
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{user?.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                
                <div className="mt-4 px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded-full text-sm font-medium">
                  {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Email Notifications</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input aria-label="Email Notifications" type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Lock className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Two-Factor Authentication</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input aria-label="Two-Factor Authentication" type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;