import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, Mail, ShieldAlert } from 'lucide-react';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('icu_token', response.data.token);
      localStorage.setItem('icu_user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070f15] flex flex-col justify-center items-center py-12 px-4 font-body select-none">
      {/* AIIMS Header Logo block */}
      <div className="flex items-center gap-3.5 mb-8">
        <div className="flex items-center justify-center p-2.5 bg-[#0ba5e9] rounded-xl text-black shadow-lg shadow-[#0ba5e9]/10">
          <Activity className="h-7 w-7 stroke-[2.5]" />
        </div>
        <div className="text-left">
          <h2 className="text-2xl font-bold font-heading text-white tracking-wide leading-tight">
            AIIMS Jodhpur
          </h2>
          <p className="text-[#64748b] text-[13px] font-semibold tracking-wide">
            ICU Patient Data System
          </p>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-[480px]">
        <div className="bg-[#0f1b26] py-10 px-8 sm:px-10 rounded-2xl border border-[#1e2e3d]/60 shadow-2xl">
          <h3 className="text-xl font-bold font-heading text-white mb-1.5">
            Doctor Login
          </h3>
          <p className="text-[#64748b] text-sm font-medium mb-8">
            Use credentials created in the Admin panel
          </p>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl flex items-center gap-3 animate-fade-in">
                <ShieldAlert className="h-4.5 w-4.5 text-rose-500 shrink-0" />
                <p className="text-xs text-rose-400 font-bold leading-normal">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-bold text-[#94a3b8] uppercase tracking-wider">
                Email
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4.5 w-4.5 text-[#475569]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@aiims.edu"
                  className="block w-full pl-11 pr-4 py-3 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white placeholder-[#475569] text-sm focus:outline-none focus:ring-2 focus:ring-[#0ba5e9] focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-xs font-bold text-[#94a3b8] uppercase tracking-wider">
                Password
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4.5 w-4.5 text-[#475569]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-4 py-3 bg-[#0a131a] border border-[#1e2e3d] rounded-xl text-white placeholder-[#475569] text-sm focus:outline-none focus:ring-2 focus:ring-[#0ba5e9] focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-bold text-black bg-[#0ba5e9] hover:bg-[#38bdf8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#070f15] focus:ring-[#0ba5e9] transition duration-150 ease-in-out disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Copy footer */}
      <div className="mt-8 text-center">
        <p className="text-xs font-semibold text-[#475569] tracking-wider">
          &copy; 2024 AIIMS Jodhpur. All rights reserved.
        </p>
      </div>
    </div>
  );
}
