import React from 'react';
import { Participant, NotificationLog, KecamatanInfo } from '../types';
import { CABANG_OLAHRAGA } from '../data/initialData';
import { CheckCircle2, MessageCircle, CreditCard, X, ArrowRight, ShieldCheck, FileCheck } from 'lucide-react';

interface RegistrationSuccessModalProps {
  participant: Participant;
  notification: NotificationLog;
  kecamatanList: KecamatanInfo[];
  onViewIdCard: (participant: Participant) => void;
  onClose: () => void;
}

export const RegistrationSuccessModal: React.FC<RegistrationSuccessModalProps> = ({
  participant,
  notification,
  kecamatanList,
  onViewIdCard,
  onClose,
}) => {
  const kec = kecamatanList.find(k => k.id === participant.kecamatanId);
  const cabor = CABANG_OLAHRAGA.find(c => c.id === participant.caborId);

  const cleanPhone = participant.phone.replace(/^0/, '62').replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(notification.message)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Success Header */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-200" />
          </div>

          <h3 className="font-extrabold text-xl text-white">
            Pendaftaran Berhasil Terdaftar!
          </h3>
          <p className="text-xs text-emerald-100 mt-1 max-w-sm mx-auto">
            Data peserta & dokumen keabsahan telah masuk ke kontingen {kec?.name || participant.kecamatanId} di POR PGRI Kabupaten Mempawah 2026.
          </p>

          <div className="mt-3 inline-flex items-center gap-2 bg-emerald-950/40 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-mono text-emerald-200 font-semibold">
            <span>No. Registrasi:</span>
            <span className="text-white font-bold">{participant.id}</span>
          </div>
        </div>

        {/* Participant Summary */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Nama Lengkap</span>
              <span className="font-bold text-slate-800">{participant.fullName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">NUPTK / NIP</span>
              <span className="font-mono text-slate-700">{participant.nuptk || '-'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Kontingen Kecamatan</span>
              <span className="font-semibold text-emerald-800">{kec?.name} ({kec?.badgeText})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Cabang Olahraga</span>
              <span className="font-semibold text-slate-800">{cabor?.name} ({participant.role})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Lampiran SK Guru</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5" />
                {participant.skDocumentName ? participant.skDocumentName : 'Terunggah'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Lampiran Kartu PGRI</span>
              <span className="font-semibold text-blue-700 flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5" />
                {participant.ktaDocumentName ? participant.ktaDocumentName : 'Terunggah'}
              </span>
            </div>
          </div>

          {/* Automated Notification Broadcast Preview */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Notifikasi Otomatis Terkirim</span>
              </div>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 font-semibold px-2 py-0.5 rounded">
                WhatsApp API Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed italic bg-white p-2.5 rounded border border-emerald-100">
              "{notification.message}"
            </p>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Tujuan: <strong>{participant.phone}</strong></span>
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 hover:text-emerald-900 font-bold inline-flex items-center gap-1"
              >
                Kirim via WhatsApp Web <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button
              onClick={() => onViewIdCard(participant)}
              className="flex-1 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Lihat & Cetak Kartu QR Peserta</span>
            </button>
            <button
              onClick={onClose}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Tutup
            </button>
          </div>

          <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Terverifikasi di sistem panitia POR PGRI Kabupaten Mempawah</span>
          </div>
        </div>
      </div>
    </div>
  );
};
