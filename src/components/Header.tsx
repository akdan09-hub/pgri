import React from 'react';
import { Trophy, FileSpreadsheet, QrCode, Bell, UserPlus, LayoutDashboard, Building2 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'register' | 'dashboard' | 'notifications';
  setActiveTab: (tab: 'register' | 'dashboard' | 'notifications') => void;
  onOpenScanner: () => void;
  onExportExcel: () => void;
  totalParticipants: number;
  unreadNotifsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenScanner,
  onExportExcel,
  totalParticipants,
  unreadNotifsCount,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      {/* Top Banner with Event Info & Live Status */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Sistem Real-Time Aktif
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">9 Kecamatan Kab. Mempawah Terhubung</span>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-emerald-300 font-semibold">{totalParticipants} Terdaftar</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Pekan Olahraga PGRI Kab. Mempawah 2026</span>
            <span className="hidden md:inline">·</span>
            <span className="hidden md:inline">Kalimantan Barat</span>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-900/30 text-white font-black text-xl border border-emerald-400/40">
            <Trophy className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-lg text-white tracking-tight">
                POR PGRI <span className="text-emerald-400">MEMPAWAH</span>
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded">
                9 KECAMATAN
              </span>
            </div>
            <p className="text-xs text-slate-400">Sistem Pendaftaran & Rekapitulasi Ranting PGRI Kab. Mempawah</p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700/80">
          <button
            onClick={() => setActiveTab('register')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Pendaftaran Baru</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard & Rekap</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 relative ${
              activeTab === 'notifications'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Notifikasi</span>
            {unreadNotifsCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500 text-slate-950">
                {unreadNotifsCount}
              </span>
            )}
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenScanner}
            className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            title="Pindai QR / Cek ID Peserta"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Pindai QR</span>
          </button>

          <button
            onClick={onExportExcel}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            title="Download Laporan Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-950" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>
    </header>
  );
};
