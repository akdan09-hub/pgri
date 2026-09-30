import React, { useState, useEffect, useCallback } from 'react';
import { Participant, NotificationLog, VerificationStatus, KecamatanInfo } from './types';
import { storageService } from './services/storageService';
import { exportParticipantsToExcel } from './services/excelExport';
import { Header } from './components/Header';
import { RegistrationForm } from './components/RegistrationForm';
import { AdminDashboard } from './components/AdminDashboard';
import { NotificationCenter } from './components/NotificationCenter';
import { IdCardModal } from './components/IdCardModal';
import { QrScannerModal } from './components/QrScannerModal';
import { RegistrationSuccessModal } from './components/RegistrationSuccessModal';
import { Toast } from './components/Toast';

export default function App() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [kecamatanList, setKecamatanList] = useState<KecamatanInfo[]>([]);
  const [activeTab, setActiveTab] = useState<'register' | 'dashboard' | 'notifications'>('dashboard');

  // Modals state
  const [selectedParticipantForCard, setSelectedParticipantForCard] = useState<Participant | null>(null);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [registrationSuccessData, setRegistrationSuccessData] = useState<{
    participant: Participant;
    notification: NotificationLog;
  } | null>(null);

  // Live Toast state
  const [toast, setToast] = useState<{ message: string; subMessage?: string } | null>(null);

  // Load data initially
  const loadData = useCallback(() => {
    const k = storageService.getKecamatanList();
    const p = storageService.getParticipants();
    const n = storageService.getNotifications();
    setKecamatanList(k);
    setParticipants(p);
    setNotifications(n);
  }, []);

  useEffect(() => {
    loadData();

    // Subscribe to BroadcastChannel for real-time synchronization across browser tabs
    const unsubscribe = storageService.subscribe((event) => {
      loadData();
      if (event.type === 'PARTICIPANTS_UPDATED') {
        const latest = storageService.getParticipants()[0];
        const kecs = storageService.getKecamatanList();
        if (latest) {
          const kec = kecs.find(k => k.id === latest.kecamatanId);
          setToast({
            message: `Pendaftar Baru: ${latest.fullName}`,
            subMessage: `Kontingen ${kec?.name || ''} · ${latest.caborId}`,
          });
        }
      } else if (event.type === 'KECAMATAN_UPDATED') {
        setToast({
          message: 'Data Kecamatan Diperbarui',
          subMessage: 'Pengaturan kecamatan dan kuota kontingen telah disinkronkan.',
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [loadData]);

  // Handle successful registration
  const handleRegistrationSuccess = (participant: Participant, notification: NotificationLog) => {
    loadData();
    setRegistrationSuccessData({ participant, notification });
    const kec = kecamatanList.find(k => k.id === participant.kecamatanId);
    setToast({
      message: `Pendaftaran Berhasil: ${participant.fullName}`,
      subMessage: `Kontingen ${kec?.name || ''} · ID: ${participant.id}`,
    });
  };

  // Handle status update
  const handleUpdateStatus = (id: string, status: VerificationStatus, notes?: string) => {
    const updated = storageService.updateParticipantStatus(id, status, notes);
    if (updated) {
      loadData();
      setToast({
        message: `Status Verifikasi Diperbarui`,
        subMessage: `${updated.fullName} sekarang berstatus: ${status}`,
      });
    }
  };

  // Handle update kecamatan (edit menu)
  const handleUpdateKecamatan = (updatedKec: KecamatanInfo) => {
    storageService.updateKecamatan(updatedKec);
    loadData();
    setToast({
      message: 'Kecamatan Berhasil Diperbarui',
      subMessage: `${updatedKec.name} (${updatedKec.code}) telah disimpan.`,
    });
  };

  // Handle delete participant
  const handleDeleteParticipant = (id: string) => {
    storageService.deleteParticipant(id);
    loadData();
  };

  // Handle manual broadcast notif
  const handleSendManualNotif = (notif: NotificationLog) => {
    const currentNotifs = [notif, ...storageService.getNotifications()];
    storageService.saveNotifications(currentNotifs);
    loadData();
  };

  // Handle reset data
  const handleResetData = () => {
    storageService.resetToDefault();
    loadData();
    setToast({
      message: 'Data Direset ke Awal',
      subMessage: 'Basis data 9 kecamatan Kabupaten Mempawah telah dikembalikan ke simulasi resmi.',
    });
  };

  // Handle export excel
  const handleExportExcel = () => {
    exportParticipantsToExcel(participants, kecamatanList, 'POR_PGRI_Mempawah_2026');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 antialiased font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenScanner={() => setIsQrScannerOpen(true)}
        onExportExcel={handleExportExcel}
        totalParticipants={participants.length}
        unreadNotifsCount={notifications.length}
      />

      {/* Main Content Body */}
      <main className="flex-1 pb-16">
        {activeTab === 'register' && (
          <RegistrationForm
            participants={participants}
            kecamatanList={kecamatanList}
            onSuccess={handleRegistrationSuccess}
          />
        )}

        {activeTab === 'dashboard' && (
          <AdminDashboard
            participants={participants}
            notifications={notifications}
            kecamatanList={kecamatanList}
            onViewIdCard={(p) => setSelectedParticipantForCard(p)}
            onUpdateStatus={handleUpdateStatus}
            onDeleteParticipant={handleDeleteParticipant}
            onSendManualNotif={handleSendManualNotif}
            onUpdateKecamatan={handleUpdateKecamatan}
            onResetData={handleResetData}
          />
        )}

        {activeTab === 'notifications' && (
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-slate-900">
                Pusat Notifikasi Otomatis Wilayah Kab. Mempawah
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Sistem pengiriman notifikasi otomatis terintegrasi ke nomor WhatsApp dan email resmi peserta di 9 kecamatan Kabupaten Mempawah.
              </p>
            </div>
            <NotificationCenter
              notifications={notifications}
              participants={participants}
              kecamatanList={kecamatanList}
              onSendManualNotif={handleSendManualNotif}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-xs text-center print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">POR PGRI KAB. MEMPAWAH 2026</span>
            <span>·</span>
            <span>9 Kecamatan (Mempawah Hilir, Mempawah Timur, Sungai Pinyuh, Anjongan, Segedong, Sungai Kunyit, Toho, Sadaniang, Jongkat)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 text-[11px]">
            <span>Verifikasi SK Guru & KTA PGRI</span>
            <span>·</span>
            <span>QR Code Keabsahan Wasit</span>
            <span>·</span>
            <span>Laporan Excel Multi-Sheet</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedParticipantForCard && (
        <IdCardModal
          participant={selectedParticipantForCard}
          kecamatanList={kecamatanList}
          onClose={() => setSelectedParticipantForCard(null)}
        />
      )}

      {isQrScannerOpen && (
        <QrScannerModal
          participants={participants}
          kecamatanList={kecamatanList}
          onClose={() => setIsQrScannerOpen(false)}
          onSelectParticipant={(p) => setSelectedParticipantForCard(p)}
        />
      )}

      {registrationSuccessData && (
        <RegistrationSuccessModal
          participant={registrationSuccessData.participant}
          notification={registrationSuccessData.notification}
          kecamatanList={kecamatanList}
          onViewIdCard={(p) => {
            setRegistrationSuccessData(null);
            setSelectedParticipantForCard(p);
          }}
          onClose={() => setRegistrationSuccessData(null)}
        />
      )}

      {/* Real-time Event Toast */}
      {toast && (
        <Toast
          message={toast.message}
          subMessage={toast.subMessage}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
