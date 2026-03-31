import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export function TouristLogin() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5002/api/tourists/login',
        { email, password }
      );

      if (response.status === 200) {
        localStorage.setItem('userEmail', response.data.user.email);
        localStorage.setItem('userName', response.data.user.name);
        navigate('/tourist/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-body">
      {/* 🔹 ALL your existing big JSX stays here exactly as it was */}
    </div>
  );

}  