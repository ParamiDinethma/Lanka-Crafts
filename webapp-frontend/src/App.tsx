import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { BrowseArtists } from './pages/BrowseArtists';
import { ArtistProfile } from './pages/ArtistProfile';
import { ArtistRegistration } from './pages/ArtistRegistration';
import { FullMap } from './pages/FullMap';
import { MobileScreens } from './pages/MobileScreens';
import { ChatWidget } from './components/chatbot/ChatWidget';
import { ChatAdmin } from './pages/ChatAdmin';
import { BookWorkshop } from './pages/BookWorkshop';
import { Login } from './pages/Login';
import { ArtistDashboard } from './pages/ArtistDashboard';
import { AuthProvider } from './context/AuthContext';
import { TouristLogin } from './pages/tourist/TouristLogin';
import { TouristRegister } from './pages/tourist/TouristRegister';
import { TouristDashboard } from './pages/tourist/TouristDashboard';
import { TouristBlogs } from './pages/tourist/TouristBlogs';


// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<BrowseArtists />} />
          <Route path="/artist/:id" element={<ArtistProfile />} />
          <Route path="/register" element={<ArtistRegistration />} />
          <Route path="/map" element={<FullMap />} />
          <Route path="/mobile" element={<MobileScreens />} />
          <Route path="/admin/chat" element={<ChatAdmin />} />
          <Route path="/book" element={<BookWorkshop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ArtistDashboard />} />
          {/* Tourist routes */}
          <Route path="/tourist/login" element={<TouristLogin />} />
          <Route path="/tourist/register" element={<TouristRegister />} />
          <Route path="/tourist/dashboard" element={<TouristDashboard />} />
          <Route path="/tourist/blogs" element={<TouristBlogs />} />
        </Routes>
        <ChatWidget />
      </BrowserRouter>
    </AuthProvider>
  );
}