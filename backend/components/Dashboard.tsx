'use client';

import React, { useEffect, useState } from 'react';
import { 
  Search, Bell, Settings, Image as ImageIcon, Briefcase, 
  Layers, Info, ShieldCheck, Users, Handshake, FileText, 
  Plus, RefreshCw, Loader2 
} from 'lucide-react';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('redwanul15-3333@diu.edu.bd');
  const [counts, setCounts] = useState({
    heroBanner: 0, services: 0, portfolio: 0, aboutMaheen: 0,
    policy: 0, members: 0, partners: 0, blogs: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Session Check
        const sessionRes = await fetch('/api/auth/session').catch(() => null);
        if (sessionRes?.ok) {
          const session = await sessionRes.json();
          if (session?.user?.email) setUserEmail(session.user.email);
        }

        // Fetch Model Counts
        const endpoints = [
          '/api/hero-banner', '/api/services', '/api/portfolio', '/api/about-maheen',
          '/api/policies', '/api/members', '/api/partners', '/api/blogs'
        ];
        
        const responses = await Promise.allSettled(endpoints.map(url => fetch(url)));
        const results = await Promise.all(responses.map(async (res) => {
          if (res.status === 'fulfilled' && res.value.ok) {
            const data = await res.value.json();
            return Array.isArray(data) ? data.length : (data.count || 0);
          }
          return 0;
        }));

        setCounts({
          heroBanner: results[0], services: results[1], portfolio: results[2],
          aboutMaheen: results[3], policy: results[4], members: results[5],
          partners: results[6], blogs: results[7]
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const modules = [
    { name: 'Hero Banner', count: counts.heroBanner, icon: ImageIcon, link: '/admin/hero-banner' },
    { name: 'Services', count: counts.services, icon: Briefcase, link: '/admin/services' },
    { name: 'Best Works', count: counts.portfolio, icon: Layers, link: '/admin/portfolio' },
    { name: 'About Maheen', count: counts.aboutMaheen, icon: Info, link: '/admin/about' },
    { name: 'Smart Policies', count: counts.policy, icon: ShieldCheck, link: '/admin/policies' },
    { name: 'Management', count: counts.members, icon: Users, link: '/admin/management' },
    { name: 'Working Partners', count: counts.partners, icon: Handshake, link: '/admin/partners' },
    { name: 'Related Blogs', count: counts.blogs, icon: FileText, link: '/admin/blogs' },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 text-slate-800 pb-10">
      
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-gray-100 rounded-lg pl-9 pr-3 py-1.5 text-sm outline-none focus:bg-white focus:ring-1 focus:ring-slate-300"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            <Bell size={18} />
          </button>
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            <Settings size={18} />
          </button>
          
          <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-[#521323] text-white font-bold flex items-center justify-center text-sm">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-xs">
              <p className="font-semibold text-gray-900">{userEmail}</p>
              <p className="text-gray-400">Admin</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 pt-6 space-y-6">
        
        {/* Welcome Banner */}
        <div className="bg-[#521323] text-white rounded-xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-xl font-bold">Welcome back, Admin 👋</h1>
            <p className="text-xs text-gray-200 mt-1">Manage your website content easily from one place.</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Modules Grid */}
        <div>
          <h2 className="text-sm font-bold text-gray-700 mb-3">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {modules.map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={index}
                  href={item.link}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:border-slate-400 transition shadow-sm flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 font-medium">{item.name}</p>
                    {loading ? (
                      <Loader2 size={16} className="animate-spin text-gray-400 my-1" />
                    ) : (
                      <p className="text-2xl font-bold text-gray-900">{item.count}</p>
                    )}
                  </div>
                  <div className="p-2.5 bg-gray-100 rounded-lg text-slate-700">
                    <Icon size={20} />
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h3>
          <div className="flex flex-wrap gap-2.5">
            {[
              { label: 'Add Banner', href: '/admin/hero-banner' },
              { label: 'Add Service', href: '/admin/services' },
              { label: 'New Work', href: '/admin/portfolio' },
              { label: 'Create Blog', href: '/admin/blogs' },
            ].map((action, i) => (
              <a
                key={i}
                href={action.href}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg text-xs font-medium transition"
              >
                <Plus size={14} />
                <span>{action.label}</span>
              </a>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}