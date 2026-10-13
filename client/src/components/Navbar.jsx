import React, { useState, useEffect } from 'react';
import {
  ShoppingBag, User as UserIcon, Menu, X,
  Gamepad2, Cake, ShieldCheck, LogOut, Package,
  ChevronDown, Home, MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ activeTab, setActiveTab, onOpenAuth }) {
  const { user, login, logout, isAdmin } = useAuth();
  const { cartCount, setIsDrawerOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { id: 'home',    label: 'Home',        icon: Home },
    { id: 'menu',    label: 'Menu',        badge: null },
    { id: 'custom',  label: 'Custom Cakes',icon: Cake,     badge: 'Popular' },
    { id: 'game',    label: 'BakeMaster',  icon: Gamepad2, badge: 'Game' },
    { id: 'contact', label: 'Contact',     icon: MessageSquare },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminClick = async () => {
    if (isAdmin) {
      handleNavClick('admin');
    } else {
      try {
        await login('admin@bakeease.in', 'admin123');
        handleNavClick('admin');
      } catch {
        onOpenAuth();
      }
    }
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#FDF8F3]/96 backdrop-blur-xl shadow-[0_2px_24px_-4px_rgba(44,24,16,0.12)] border-b border-[#EADBC8]/80'
            : 'bg-[#FDF8F3]/90 backdrop-blur-lg border-b border-[#EADBC8]/50'
        }`}
      >
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center h-[68px] gap-4">

            {/* Logo */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 group select-none flex-shrink-0 focus:outline-none"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#B05E2D] via-[#C97A47] to-[#6B3A2A] flex items-center justify-center shadow-md shadow-[#B05E2D]/30 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
                <span className="text-[22px] leading-none">🧁</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-[22px] font-bold text-[#2C1810] tracking-tight">
                  Bake<span className="text-[#B05E2D] italic">Ease</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.22em] text-[#7A665A] font-semibold mt-[3px]">
                  Artisan Bakery Â· Mumbai
                </span>
              </div>
            </button>

            {/* Desktop nav pill */}
            <div className="hidden lg:flex flex-1 justify-center">
              <div className="flex items-center gap-0.5 bg-white/70 backdrop-blur rounded-2xl border border-[#EADBC8]/70 p-1 shadow-[inset_0_1px_2px_rgba(44,24,16,0.04)]">
                {navItems.map(({ id, label, icon: Icon, badge }) => {
                  const active = activeTab === id;
                  return (
                    <button
                      key={id}
                      onClick={() => handleNavClick(id)}
                      className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                        active
                          ? 'bg-[#B05E2D] text-white shadow-md shadow-[#B05E2D]/30'
                          : 'text-[#7A665A] hover:text-[#2C1810] hover:bg-[#F8EDE3]'
                      }`}
                    >
                      {Icon && (
                        <Icon className={`w-[15px] h-[15px] flex-shrink-0 ${active ? 'text-white/90' : 'text-[#B05E2D]'}`} />
                      )}
                      <span>{label}</span>
                      {badge && (
                        <span className={`text-[8px] px-1.5 py-px rounded-full font-bold uppercase tracking-wider ${
                          active
                            ? 'bg-white/25 text-white'
                            : 'bg-[#F4A261]/20 text-[#B05E2D] border border-[#F4A261]/40'
                        }`}>
                          {badge}
                        </span>
                      )}
                    </button>
                  );
                })}

                {/* Orders â€” only if logged in */}
                {user && (
                  <button
                    onClick={() => handleNavClick('orders')}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      activeTab === 'orders'
                        ? 'bg-[#B05E2D] text-white shadow-md shadow-[#B05E2D]/30'
                        : 'text-[#7A665A] hover:text-[#2C1810] hover:bg-[#F8EDE3]'
                    }`}
                  >
                    <Package className={`w-[15px] h-[15px] flex-shrink-0 ${activeTab === 'orders' ? 'text-white/90' : 'text-[#B05E2D]'}`} />
                    <span>Orders</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right cluster */}
            <div className="flex items-center gap-2 ml-auto lg:ml-0 flex-shrink-0">

              {/* Admin Suite badge */}
              <button
                onClick={handleAdminClick}
                className={`hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all duration-200 flex-shrink-0 ${
                  activeTab === 'admin'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-500/30'
                    : 'bg-amber-50 text-amber-800 border-amber-300/80 hover:bg-amber-100 hover:border-amber-400'
                }`}
                title="Admin Management Suite"
              >
                <ShieldCheck className={`w-3.5 h-3.5 ${activeTab === 'admin' ? 'text-white/90' : 'text-amber-600'}`} />
                <span>Admin</span>
              </button>

              {/* Cart */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="relative p-2.5 rounded-xl bg-white border border-[#EADBC8]/80 text-[#2C1810] hover:border-[#B05E2D]/40 hover:text-[#B05E2D] hover:bg-[#F8EDE3] transition-all duration-200 shadow-sm active:scale-95"
                title="Shopping Cart"
              >
                <ShoppingBag className="w-[19px] h-[19px]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-br from-[#B05E2D] to-[#F4A261] text-white text-[9px] font-black flex items-center justify-center ring-2 ring-[#FDF8F3]">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Auth / User menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(v => !v)}
                    className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl bg-white border border-[#EADBC8]/80 hover:border-[#B05E2D]/40 transition-all duration-200 shadow-sm"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#B05E2D] to-[#6B3A2A] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                      {initials}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-[#2C1810] max-w-[90px] truncate">
                      {user.fullName?.split(' ')[0] || 'You'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#7A665A] transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#EADBC8]/80 py-2 z-50 overflow-hidden">
                        <div className="px-4 py-3 border-b border-[#EADBC8]/60">
                          <p className="text-[11px] text-[#7A665A] uppercase tracking-wider font-semibold">Signed in as</p>
                          <p className="text-sm font-semibold text-[#2C1810] mt-0.5 truncate">{user.fullName}</p>
                          <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 mt-1.5 rounded-full bg-[#F8EDE3] text-[#B05E2D] border border-[#EADBC8]">
                            {user.role}
                          </span>
                        </div>

                        <button
                          onClick={() => { handleNavClick('orders'); setUserDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-[#2C1810] hover:bg-[#FDF8F3] flex items-center gap-2.5 transition-colors"
                        >
                          <Package className="w-4 h-4 text-[#7A665A]" />
                          My Orders
                        </button>

                        {isAdmin && (
                          <button
                            onClick={() => { handleNavClick('admin'); setUserDropdownOpen(false); }}
                            className="w-full text-left px-4 py-2.5 text-sm text-amber-800 hover:bg-amber-50 flex items-center gap-2.5 transition-colors font-medium"
                          >
                            <ShieldCheck className="w-4 h-4 text-amber-600" />
                            Admin Dashboard
                          </button>
                        )}

                        <div className="mx-4 my-1.5 h-px bg-[#EADBC8]/60" />

                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                            if (activeTab === 'admin') handleNavClick('home');
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#B05E2D] to-[#8C4318] hover:from-[#944D23] hover:to-[#7A3A16] text-white text-sm font-semibold shadow-md shadow-[#B05E2D]/25 hover:shadow-lg hover:shadow-[#B05E2D]/35 transition-all duration-200 active:scale-95"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(v => !v)}
                className="lg:hidden p-2.5 rounded-xl text-[#2C1810] hover:bg-[#F8EDE3] border border-[#EADBC8]/60 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FDF8F3]/98 backdrop-blur-xl border-t border-[#EADBC8]/60 px-4 pt-3 pb-5 space-y-1">
            {navItems.map(({ id, label, icon: Icon, badge }) => (
              <button
                key={id}
                onClick={() => handleNavClick(id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === id
                    ? 'bg-[#B05E2D] text-white'
                    : 'text-[#2C1810] hover:bg-white/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {Icon && <Icon className={`w-4 h-4 ${activeTab === id ? 'text-white/80' : 'text-[#B05E2D]'}`} />}
                  <span>{label}</span>
                </div>
                {badge && (
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    activeTab === id ? 'bg-white/25 text-white' : 'bg-[#F4A261]/20 text-[#B05E2D]'
                  }`}>
                    {badge}
                  </span>
                )}
              </button>
            ))}

            {user && (
              <button
                onClick={() => handleNavClick('orders')}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === 'orders' ? 'bg-[#B05E2D] text-white' : 'text-[#2C1810] hover:bg-white/80'
                }`}
              >
                <Package className={`w-4 h-4 ${activeTab === 'orders' ? 'text-white/80' : 'text-[#B05E2D]'}`} />
                My Orders
              </button>
            )}

            <button
              onClick={handleAdminClick}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors border ${
                activeTab === 'admin'
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className={`w-4 h-4 ${activeTab === 'admin' ? 'text-white/80' : 'text-amber-600'}`} />
                Admin Suite
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-bold uppercase tracking-wider">
                Admin
              </span>
            </button>

            {user && (
              <>
                <div className="h-px bg-[#EADBC8]/60 !mt-3 !mb-1" />
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    if (activeTab === 'admin') handleNavClick('home');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  Sign Out
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
