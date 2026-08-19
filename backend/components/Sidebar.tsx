'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Image as ImageIcon, 
  Briefcase, 
  Award, 
  Info, 
  ShieldCheck, 
  Users, 
  Handshake, 
  FileText, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: ImageIcon },
  { name: 'Hero Banner', href: '/admin/hero-banners', icon: ImageIcon },
  { name: 'Services', href: '/admin/services', icon: Briefcase },
  { name: 'Best Works', href: '/admin/portfolio', icon: Award },
  { name: 'About Maheen', href: '/admin/about-maheen', icon: Info },
  { name: 'Smart Policies', href: '/admin/policies', icon: ShieldCheck },
  { name: 'Management', href: '/admin/members', icon: Users },
  { name: 'Working Partners', href: '/admin/partners', icon: Handshake },
  { name: 'Related Blog', href: '/admin/blogs', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Top Toggle Button */}
      <div className="lg:hidden fixed top-3 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-white rounded-xl shadow-md border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Overlay Background for Mobile */}
      {isOpen && (
        <div 
          onClick={toggleSidebar}
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 z-40 w-72 bg-white border-r border-slate-100 h-screen flex flex-col justify-between p-4 shrink-0 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo & Brand Header */}
          <div className="flex items-center justify-between px-3 py-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#521323] rounded-xl flex items-center justify-center font-bold text-white text-base lg:text-lg tracking-wider shrink-0 shadow-sm">
                MA
              </div>
              <div>
                <h2 className="font-extrabold text-slate-900 text-xs lg:text-sm tracking-wide uppercase leading-tight">
                  MAHEEN ACCESSORIES
                </h2>
                <p className="text-[10px] lg:text-[11px] text-slate-400 font-medium">AdminPanel-v1.0</p>
              </div>
            </div>

            {/* Mobile Close Button inside Sidebar Header */}
            <button 
              onClick={toggleSidebar} 
              className="lg:hidden text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)} // Close sidebar on mobile item click
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#faf3f5] text-[#801b38]'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-[#801b38]' : 'text-slate-400'} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout Section */}
        <div className="pt-4 border-t border-slate-100">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-red-600 bg-red-50/50 hover:bg-red-50 transition-colors w-full"
          >
            <LogOut size={20} />
            <span>Logout Account</span>
          </Link>
        </div>
      </aside>
    </>
  );
}