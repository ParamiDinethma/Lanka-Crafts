import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links = [
  {
    name: 'Explore',
    path: '/map'
  },
  {
    name: 'Crafts',
    path: '/#crafts'
  },
  {
    name: 'Artists',
    path: '/browse'
  },
  {
    name: 'Book a Workshop',
    path: '/book'
  }];

  const handleLinkClick = (link: {name: string;path: string;}) => {
    if (link.name === 'Crafts') {
      const craftsSection = document.getElementById('crafts');
      if (craftsSection) {
        craftsSection.scrollIntoView({
          behavior: 'smooth'
        });
      } else {
        window.location.href = '/#crafts';
      }
    }
  };
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: '#2F5D50',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.25)' : 'none'
      }}>

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" fill="#C9A227" opacity="0.2" />
            <path
              d="M16 4 C10 4 6 10 6 16 C6 22 10 28 16 28 C22 28 26 22 26 16 C26 10 22 4 16 4Z"
              fill="#C9A227"
              opacity="0.6" />

            <path
              d="M16 8 L18 14 L24 14 L19 18 L21 24 L16 20 L11 24 L13 18 L8 14 L14 14 Z"
              fill="#C9A227" />

          </svg>
          <span
            className="text-white text-xl font-bold tracking-wide"
            style={{
              fontFamily: 'Fraunces, serif'
            }}>

            Lanka Craft
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) =>
          <Link
            key={link.name}
            to={link.name === 'Crafts' ? '#' : link.path}
            onClick={(e) => {
              if (link.name === 'Crafts') {
                e.preventDefault();
                handleLinkClick(link);
              }
            }}
            className="text-white/85 hover:text-white text-sm font-medium tracking-wide transition-colors duration-200 relative group">

              {link.name}
              <span
              className="absolute -bottom-1 left-0 w-0 h-0.5 bg-mustard group-hover:w-full transition-all duration-300"
              style={{
                backgroundColor: '#C9A227'
              }} />

            </Link>
          )}
          <div className="flex items-center gap-3 ml-4">
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
              style={{
                backgroundColor: '#2F5D50',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)'
              }}>

              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 border-2"
              style={{
                borderColor: '#C65D3B',
                color: '#C65D3B',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#C65D3B';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#C65D3B';
              }}>

              Register as Artist
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setMenuOpen(!menuOpen)}>

          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen &&
      <motion.div
        initial={{
          opacity: 0,
          y: -10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="md:hidden px-6 pb-6 flex flex-col gap-4"
        style={{
          backgroundColor: '#2F5D50'
        }}>

          {links.map((link) =>
        <Link
          key={link.name}
          to={link.name === 'Crafts' ? '#' : link.path}
          className="text-white/85 hover:text-white font-medium py-1"
          onClick={(e) => {
            setMenuOpen(false);
            if (link.name === 'Crafts') {
              e.preventDefault();
              handleLinkClick(link);
            }
          }}>

              {link.name}
            </Link>
        )}
          <Link
          to="/login"
          className="px-5 py-2.5 rounded-full text-sm font-semibold text-center mt-2"
          style={{
            backgroundColor: '#2F5D50',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)'
          }}
          onClick={() => setMenuOpen(false)}>

            Login
          </Link>
          <Link
          to="/register"
          className="px-5 py-2.5 rounded-full text-sm font-semibold text-center border-2"
          style={{
            borderColor: '#C65D3B',
            color: '#C65D3B'
          }}
          onClick={() => setMenuOpen(false)}>

            Register as Artist
          </Link>
        </motion.div>
      }
    </nav>);

}