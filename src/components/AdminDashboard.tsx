import React, { useState } from 'react';
import { Participant, NotificationLog, VerificationStatus, KecamatanInfo } from '../types';
import { CABANG_OLAHRAGA } from '../data/initialData';
import { KecamatanRecapGrid } from './KecamatanRecapGrid';
import { ParticipantTable } from './ParticipantTable';
import { CaborMatrixTable } from './CaborMatrixTable';
import { NotificationCenter } from './NotificationCenter';
import { KecamatanEditModal } from './KecamatanEditModal';
import { exportParticipantsToExcel } from '../services/excelExport';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Building2,
  Trophy,
  Bell,
  ListFilter,
  FileCheck,
  Edit3
} from 'lucide-react';

interface AdminDashboardProps {
  participants: Participant[];
  notifications: NotificationLog[];
  kecamatanList: KecamatanInfo[];
  onViewIdCard: (participant: Participant) => void;
  onUpdateStatus: (id: string, status: VerificationStatus, notes?: string) => void;
  onDeleteParticipant: (id: string) => void;
  onSendManualNotif: (notif: NotificationLog) => void;
  onUpdateKecamatan: (updated: KecamatanInfo) => void;
  onResetData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  participants,
  notifications,
  kecamatanList,
  onViewIdCard,
  onUpdateStatus,
  onDeleteParticipant,
  onSendManualNotif,
  onUpdateKecamatan,
  onResetData,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'kecamatan' | 'peserta' | 'cabor' | 'notifikasi'>('kecamatan');
  const [selectedKecFilter, setSelectedKecFilter] = useState<string>('all');
  const [editingKecamatan, setEditingKecamatan] = useState<KecamatanInfo | null>(null);

  // Stats calculation
  const total = participants.length;
  const totalQuotaAllKec = kecamatanList.reduce((acc, k) => acc + k.kuotaMaksimal, 0);
  const verifiedCount = participants.filter(p => p.status === 'Terverifikasi').length;
  const pendingCount = participants.filter(p => p.status === 'Menunggu Verifikasi').length;
  const revisionCount = participants.filter(p => p.status === 'Perlu Perbaikan').length;

  const withSkCount = participants.filter(p => !!(p.skDocumentName || p.skDocumentUrl)).length;
  const withKtaCount = participants.filter(p => !!(p.ktaDocumentName || p.ktaDocumentUrl)).length;

  const maleCount = participants.filter(p => p.gender === 'L').length;
  const femaleCount = participants.filter(p => p.gender === 'P').length;
  const atletCount = participants.filter(p => p.role === 'Atlet').length;
  const officialCount = participants.filter(p => p.role === 'Official' || p.role === 'Pelatih').length;

  const handleKecamatanCardClick = (kecId: string) => {
    setSelectedKecFilter(kecId);
    setActiveSubTab('peserta');
  };

  const handleExportAll = () => {
    exportParticipantsToExcel(participants, kecamatanList, 'Kabupaten_Mempawah_Lengkap');
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Dashboard Administrator & Panitia Pelaksana PGRI Kab. Mempawah</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Rekapitulasi 9 Kecamatan POR PGRI Mempawah 2026
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Pantauan pendaftaran atlet, verifikasi berkas SK Guru & KTA PGRI, manajemen kecamatan (dapat diedit), matriks cabang olahraga, dan pelaporan langsung.
          </p>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportAll}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Unduh Laporan Excel</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset data peserta & kecamatan ke setelan awal 9 kecamatan Kabupaten Mempawah?')) {
                onResetData();
              }
            }}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors"
            title="Reset Data Simulasi"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Peserta */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pendaftar</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-mono">
            {total}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            <span>{atletCount} Atlet</span>
            <span>·</span>
            <span>{officialCount} Official/Pelatih</span>
            <span>·</span>
            <span className="font-semibold text-emerald-700">{totalQuotaAllKec > 0 ? Math.round((total / totalQuotaAllKec) * 100) : 0}% Kuota</span>
          </div>
        </div>

        {/* Terverifikasi Sah */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Terverifikasi (Sah)</span>
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-800 mt-2 font-mono">
            {verifiedCount}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            <span>ID Card Aktif</span>
            <span className="text-emerald-700 font-bold font-mono">
              {total > 0 ? Math.round((verifiedCount / total) * 100) : 0}% Lolos
            </span>
          </div>
        </div>

        {/* Dokumen SK & KTA PGRI */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider">Dokumen SK & KTA</span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-800 mt-2 font-mono">
            {withSkCount} <span className="text-sm font-normal text-slate-400">/ {total}</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>SK Guru: <strong className="text-slate-700">{withSkCount}</strong></span>
            <span>·</span>
            <span>KTA: <strong className="text-slate-700">{withKtaCount}</strong></span>
          </div>
        </div>

        {/* Antrean / Perlu Revisi */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Antre / Revisi</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-800 mt-2 font-mono">
            {pendingCount + revisionCount}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>Antre: {pendingCount}</span>
            <span>·</span>
            <span>Perlu Perbaikan: {revisionCount}</span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('kecamatan')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeSubTab === 'kecamatan'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4 text-emerald-400" />
          <span>9 Kecamatan Mempawah ({kecamatanList.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('peserta')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeSubTab === 'peserta'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ListFilter className="w-4 h-4 text-emerald-400" />
          <span>Daftar Peserta & Dokumen SK/KTA ({participants.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('cabor')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeSubTab === 'cabor'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Matriks 9 Wilayah vs Cabor</span>
        </button>

        <button
          onClick={() => setActiveSubTab('notifikasi')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeSubTab === 'notifikasi'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4 text-emerald-400" />
          <span>Pusat Notifikasi Otomatis ({notifications.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeSubTab === 'kecamatan' && (
        <KecamatanRecapGrid
          participants={participants}
          kecamatanList={kecamatanList}
          selectedKecamatanFilter={selectedKecFilter}
          onSelectKecamatan={handleKecamatanCardClick}
          onEditKecamatan={(kec) => setEditingKecamatan(kec)}
        />
      )}

      {activeSubTab === 'peserta' && (
        <ParticipantTable
          participants={participants}
          kecamatanList={kecamatanList}
          onViewIdCard={onViewIdCard}
          onUpdateStatus={onUpdateStatus}
          onDelete={onDeleteParticipant}
          initialKecamatanFilter={selectedKecFilter}
        />
      )}

      {activeSubTab === 'cabor' && (
        <CaborMatrixTable
          participants={participants}
          kecamatanList={kecamatanList}
        />
      )}

      {activeSubTab === 'notifikasi' && (
        <NotificationCenter
          notifications={notifications}
          participants={participants}
          kecamatanList={kecamatanList}
          onSendManualNotif={onSendManualNotif}
        />
      )}

      {/* Modal Edit Kecamatan */}
      {editingKecamatan && (
        <KecamatanEditModal
          kecamatan={editingKecamatan}
          onSave={(updated) => {
            onUpdateKecamatan(updated);
            setEditingKecamatan(null);
          }}
          onClose={() => setEditingKecamatan(null)}
        />
      )}
    </div>
  );
};
