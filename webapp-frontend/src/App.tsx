import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { Home } from "./pages/Home";
import { CraftShop } from "./pages/CraftShop";
import { BrowseArtists } from "./pages/BrowseArtists";
import { ArtistProfile } from "./pages/ArtistProfile";
import { ArtistRegistration } from "./pages/ArtistRegistration";
import { FullMap } from "./pages/FullMap";
import { ChatWidget } from "./components/chatbot/ChatWidget";
import { BookWorkshop } from "./pages/BookWorkshop";
import { UnifiedLogin } from "./pages/UnifiedLogin";
import { RegisterSelect } from "./pages/RegisterSelect";
import { ArtistDashboard } from "./pages/ArtistDashboard";
import { ArtistHome } from "./pages/ArtistHome";
import { AdminDashboard } from "./pages/AdminDashboard";

import { TouristLogin } from "./pages/tourist/TouristLogin";
import { TouristRegister } from "./pages/tourist/TouristRegister";
import { TouristDashboard } from "./pages/tourist/TouristDashboard";
import { TouristHome } from "./pages/tourist/TouristHome";
import { TouristBlogs } from "./pages/tourist/TouristBlogs";
import EditBooking from "./pages/EditBooking";
import { Inbox } from "./pages/Inbox";
import MyBookings from "./pages/MyBookings";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/crafts" element={<CraftShop />} />
        <Route path="/artists" element={<BrowseArtists />} />
        <Route path="/browse" element={<BrowseArtists />} />
        <Route path="/artist/:id" element={<ArtistProfile />} />
        <Route path="/book" element={<BookWorkshop />} />
        <Route path="/map" element={<FullMap />} />

        {/* Auth routes */}
        <Route path="/login" element={<UnifiedLogin />} />
        <Route path="/register" element={<RegisterSelect />} />
        <Route path="/artist/register" element={<ArtistRegistration />} />
        <Route path="/tourist/login" element={<TouristLogin />} />
        <Route path="/tourist/register" element={<TouristRegister />} />

        {/* Tourist routes */}
        <Route path="/tourist/home" element={<TouristHome />} />
        <Route path="/tourist/dashboard" element={<TouristDashboard />} />
        <Route path="/tourist/blogs" element={<TouristBlogs />} />
        <Route path="/tourist/bookings" element={<MyBookings />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/edit-booking/:id" element={<EditBooking />} />
        {/* Artist routes */}
        <Route path="/artist/home" element={<ArtistHome />} />
        <Route path="/dashboard" element={<ArtistDashboard />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>

      <ChatWidget />
    </BrowserRouter>
  );
}