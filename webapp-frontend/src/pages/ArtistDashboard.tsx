import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/Button';
import {
  User,
  Settings,
  Trash2,
  Eye,
  Edit2,
  LogOut,
  MapPin,
  Star,
  Calendar,
  Clock,
  Plus,
  X,
  Save,
  Lock,
  MessageCircle,
  Check } from
'lucide-react';
import { useNavigate } from 'react-router-dom';
// Mock initial data matching ArtistProfile structure
const INITIAL_DATA = {
  name: 'Nimal Perera',
  username: 'nimal.p',
  email: 'nimal@example.com',
  craft: 'Kandyan Lacquerwork',
  region: 'Kandy',
  location: 'Kandy, Central Province',
  bio: "For over four decades, I have dedicated my life to the ancient art of Kandyan lacquerwork (Laksha). Learning from my father at the age of 12, I've mastered the traditional technique of applying natural lacquer to turned wood using only the heat of friction. My workshop is not just a place of production, but a sanctuary where this dying art form is preserved and passed down to the next generation.",
  rating: 4.9,
  reviews: 124,
  initials: 'NP',
  specialties: ['Ceremonial Staffs', 'Jewelry Boxes', 'Traditional Vases'],
  schedule: [
  {
    day: 'Mon',
    slots: ['10:00 AM', '2:00 PM']
  },
  {
    day: 'Tue',
    slots: ['10:00 AM', '2:00 PM']
  },
  {
    day: 'Wed',
    slots: ['10:00 AM']
  },
  {
    day: 'Thu',
    slots: ['10:00 AM', '2:00 PM']
  },
  {
    day: 'Fri',
    slots: ['10:00 AM', '2:00 PM']
  },
  {
    day: 'Sat',
    slots: ['9:00 AM']
  }]

};
export function ArtistDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'view' | 'edit' | 'schedule' | 'settings'>(
    'view');
  const [artistData, setArtistData] = useState(INITIAL_DATA);
  // Edit Form State
  const [editForm, setEditForm] = useState(INITIAL_DATA);
  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const handleLogout = () => {
    navigate('/login');
  };
  const handleDeleteProfile = () => {
    if (
    window.confirm(
      'Are you sure you want to delete your profile? This action cannot be undone.'
    ))
    {
      alert('Profile deleted successfully');
      navigate('/');
    }
  };
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setArtistData(editForm);
    alert('Profile updated successfully!');
    setActiveTab('view');
  };
  const handleSaveSchedule = () => {
    setArtistData((prev) => ({
      ...prev,
      schedule: editForm.schedule
    }));
    alert('Schedule updated successfully!');
  };
  const handleAddSlot = (dayIndex: number) => {
    const time = prompt('Enter time (e.g., 3:00 PM):');
    if (time) {
      const newSchedule = [...editForm.schedule];
      newSchedule[dayIndex].slots.push(time);
      setEditForm({
        ...editForm,
        schedule: newSchedule
      });
    }
  };
  const handleRemoveSlot = (dayIndex: number, slotIndex: number) => {
    const newSchedule = [...editForm.schedule];
    newSchedule[dayIndex].slots.splice(slotIndex, 1);
    setEditForm({
      ...editForm,
      schedule: newSchedule
    });
  };
  const handleSpecialtyChange = (index: number, value: string) => {
    const newSpecialties = [...editForm.specialties];
    newSpecialties[index] = value;
    setEditForm({
      ...editForm,
      specialties: newSpecialties
    });
  };
  return (
    <div className="min-h-screen bg-offwhite font-body flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <h1 className="text-4xl font-black text-forest mb-2 font-display">
                Artist Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your profile, schedule, and settings
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300">

              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-32">
                <div className="p-6 border-b border-gray-100 bg-forest text-white text-center">
                  <div className="w-20 h-20 bg-mustard rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-forest border-4 border-white/20">
                    {artistData.initials}
                  </div>
                  <h3 className="font-bold text-lg">{artistData.name}</h3>
                  <p className="text-white/70 text-sm">{artistData.craft}</p>
                </div>
                <div className="p-2 space-y-1">
                  <SidebarItem
                    icon={<Eye className="w-4 h-4" />}
                    label="View Profile"
                    active={activeTab === 'view'}
                    onClick={() => setActiveTab('view')} />

                  <SidebarItem
                    icon={<Edit2 className="w-4 h-4" />}
                    label="Edit Profile"
                    active={activeTab === 'edit'}
                    onClick={() => setActiveTab('edit')} />

                  <SidebarItem
                    icon={<Calendar className="w-4 h-4" />}
                    label="Manage Schedule"
                    active={activeTab === 'schedule'}
                    onClick={() => setActiveTab('schedule')} />

                  <SidebarItem
                    icon={<Settings className="w-4 h-4" />}
                    label="Settings"
                    active={activeTab === 'settings'}
                    onClick={() => setActiveTab('settings')} />

                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <motion.div
                key={activeTab}
                initial={{
                  opacity: 0,
                  x: 20
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                transition={{
                  duration: 0.3
                }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                {/* VIEW PROFILE TAB (Tourist View) */}
                {activeTab === 'view' &&
                <div className="flex flex-col">
                    {/* Preview Banner */}
                    <div className="bg-mustard/10 p-3 text-center text-mustard-dark text-sm font-bold border-b border-mustard/20">
                      <Eye className="w-4 h-4 inline-block mr-2" />
                      This is how travelers see your profile
                    </div>

                    {/* Hero Section (Miniaturized) */}
                    <div className="relative h-[300px] bg-forest overflow-hidden">
                      <div className="absolute inset-0 opacity-20">
                        <svg
                        width="100%"
                        height="100%"
                        xmlns="http://www.w3.org/2000/svg">

                          <defs>
                            <pattern
                            id="profile-pattern"
                            x="0"
                            y="0"
                            width="40"
                            height="40"
                            patternUnits="userSpaceOnUse">

                              <circle cx="20" cy="20" r="2" fill="white" />
                            </pattern>
                          </defs>
                          <rect
                          width="100%"
                          height="100%"
                          fill="url(#profile-pattern)" />

                        </svg>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-forest to-transparent" />

                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="flex flex-col md:flex-row md:items-end gap-6">
                          <div className="w-24 h-24 rounded-full border-4 border-white bg-terracotta shadow-xl flex items-center justify-center text-white text-2xl font-display font-bold">
                            {artistData.initials}
                          </div>
                          <div className="flex-1 text-white">
                            <div className="flex items-center gap-2 mb-2 text-mustard font-bold uppercase tracking-wider text-xs">
                              <Star className="w-3 h-3 fill-current" />
                              Master Artisan
                            </div>
                            <h1 className="text-3xl font-black font-display mb-2">
                              {artistData.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                              <span className="font-semibold">
                                {artistData.craft}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-white/40" />
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />{' '}
                                {artistData.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-8">
                        <section>
                          <h2 className="text-xl font-bold text-forest mb-4 font-display">
                            About the Artisan
                          </h2>
                          <p className="text-gray-600 leading-relaxed">
                            {artistData.bio}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {artistData.specialties.map((tag) =>
                          <span
                            key={tag}
                            className="px-3 py-1 bg-offwhite rounded-lg text-xs font-semibold text-forest-dark">

                                {tag}
                              </span>
                          )}
                          </div>
                        </section>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-offwhite p-5 rounded-xl border border-gray-200">
                          <h3 className="text-lg font-bold text-forest mb-3 font-display flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Availability
                          </h3>
                          <div className="space-y-2">
                            {artistData.schedule.map((day) =>
                          <div
                            key={day.day}
                            className="flex items-start text-sm border-b border-gray-200/50 pb-2 last:border-0">

                                <span className="w-10 font-bold text-gray-900">
                                  {day.day}
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {day.slots.length > 0 ?
                              day.slots.map((slot) =>
                              <span
                                key={slot}
                                className="text-gray-600">

                                        {slot},
                                      </span>
                              ) :

                              <span className="text-gray-400 italic">
                                      No slots
                                    </span>
                              }
                                </div>
                              </div>
                          )}
                          </div>
                          <Button className="w-full mt-4" size="sm">
                            Request Booking
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                }

                {/* EDIT PROFILE TAB */}
                {activeTab === 'edit' &&
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-forest font-display">
                        Edit Profile
                      </h2>
                      <Button onClick={handleSaveProfile} className="gap-2">
                        <Save className="w-4 h-4" /> Save Changes
                      </Button>
                    </div>

                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Full Name
                          </label>
                          <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            name: e.target.value
                          })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard outline-none" />

                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            email: e.target.value
                          })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard outline-none" />

                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Craft Type
                          </label>
                          <select
                          value={editForm.craft}
                          onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            craft: e.target.value
                          })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard outline-none bg-white">

                            <option>Kandyan Lacquerwork</option>
                            <option>Batik Textiles</option>
                            <option>Mask Carving</option>
                            <option>Pottery</option>
                            <option>Brasswork</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Region
                          </label>
                          <select
                          value={editForm.region}
                          onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            region: e.target.value
                          })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard outline-none bg-white">

                            <option>Kandy</option>
                            <option>Galle</option>
                            <option>Colombo</option>
                            <option>Jaffna</option>
                            <option>Ratnapura</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Bio
                          </label>
                          <textarea
                          rows={5}
                          value={editForm.bio}
                          onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            bio: e.target.value
                          })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard outline-none resize-none" />

                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Specialties
                          </label>
                          <div className="space-y-3">
                            {editForm.specialties.map((specialty, index) =>
                          <div key={index} className="flex gap-2">
                                <input
                              type="text"
                              value={specialty}
                              onChange={(e) =>
                              handleSpecialtyChange(index, e.target.value)
                              }
                              className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard outline-none" />

                              </div>
                          )}
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                }

                {/* SCHEDULE TAB */}
                {activeTab === 'schedule' &&
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-forest font-display">
                          Manage Schedule
                        </h2>
                        <p className="text-gray-500 text-sm">
                          Set your weekly workshop availability
                        </p>
                      </div>
                      <Button onClick={handleSaveSchedule} className="gap-2">
                        <Save className="w-4 h-4" /> Save Schedule
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {editForm.schedule.map((day, dayIndex) =>
                    <div
                      key={day.day}
                      className="bg-offwhite rounded-xl p-4 border border-gray-200">

                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="w-16 font-bold text-lg text-forest">
                              {day.day}
                            </div>

                            <div className="flex-1 flex flex-wrap gap-2">
                              {day.slots.length > 0 ?
                          day.slots.map((slot, slotIndex) =>
                          <div
                            key={slotIndex}
                            className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium flex items-center gap-2 shadow-sm">

                                    {slot}
                                    <button
                              onClick={() =>
                              handleRemoveSlot(dayIndex, slotIndex)
                              }
                              className="text-gray-400 hover:text-red-500 transition-colors">

                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                          ) :

                          <span className="text-gray-400 text-sm italic py-1.5">
                                  No slots available
                                </span>
                          }

                              <button
                            onClick={() => handleAddSlot(dayIndex)}
                            className="px-3 py-1.5 rounded-lg border border-dashed border-gray-300 text-sm font-medium text-gray-500 hover:text-forest hover:border-forest hover:bg-white transition-all flex items-center gap-1">

                                <Plus className="w-3 h-3" /> Add Slot
                              </button>
                            </div>
                          </div>
                        </div>
                    )}
                    </div>
                  </div>
                }

                {/* SETTINGS TAB */}
                {activeTab === 'settings' &&
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-forest font-display mb-6">
                      Account Settings
                    </h2>

                    {/* Password Section */}
                    <div className="mb-10">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-gray-400" /> Change
                        Password
                      </h3>
                      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4 max-w-lg">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Current Password
                          </label>
                          <input
                          type="password"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard outline-none bg-white"
                          placeholder="••••••••" />

                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                          type="password"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard outline-none bg-white"
                          placeholder="••••••••" />

                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                          type="password"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mustard outline-none bg-white"
                          placeholder="••••••••" />

                        </div>
                        <Button className="w-full">Update Password</Button>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div>
                      <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                        <Trash2 className="w-5 h-5" /> Danger Zone
                      </h3>
                      <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                        <h4 className="font-bold text-red-900 mb-2">
                          Delete Account
                        </h4>
                        <p className="text-red-700 text-sm mb-6 max-w-xl">
                          Once you delete your account, there is no going back.
                          Please be certain. All your listings, messages, and
                          booking history will be permanently removed.
                        </p>
                        <Button
                        onClick={handleDeleteProfile}
                        className="bg-red-600 hover:bg-red-700 text-white border-none shadow-none">

                          Delete My Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                }
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>);

}
function SidebarItem({
  icon,
  label,
  active,
  onClick





}: {icon: React.ReactNode;label: string;active: boolean;onClick: () => void;}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 ${active ? 'bg-forest text-white shadow-md translate-x-1' : 'text-gray-600 hover:bg-gray-50 hover:text-forest'}`}>

      <span className={active ? 'text-mustard' : 'text-gray-400'}>{icon}</span>
      {label}
      {active &&
      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-mustard" />
      }
    </button>);

}