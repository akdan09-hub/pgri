import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { Participant, KecamatanInfo } from '../types';
import { CABANG_OLAHRAGA } from '../data/initialData';
import { Printer, Download, Share2, X, CheckCircle, ShieldCheck, AlertCircle, FileCheck } from 'lucide-react';

interface IdCardModalProps {
  participant: Participant;
  kecamatanList: KecamatanInfo[];
  onClose: () => void;
}

export const IdCardModal: React.FC<IdCardModalProps> = ({ participant, kecamatanList, onClose }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  const [isCopied, setIsCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const kec = kecamatanList.find(k => k.id === participant.kecamatanId);
  const cabor = CABANG_OLAHRAGA.find(c => c.id === participant.caborId);
  const kategori = cabor?.kategori.find(k => k.id === participant.caborCategoryId);

  useEffect(() => {
    // Generate secure QR payload
    const verificationPayload = JSON.stringify({
      app: 'POR-PGRI-MEMPAWAH-2026',
      id: participant.id,
      name: participant.fullName,
      nuptk: participant.nuptk,
      kec: kec?.name,
      cabor: cabor?.name,
      status: participant.status,
      hasSk: !!participant.skDocumentName,
      hasKta: !!participant.ktaDocumentName,
      vAt: participant.verifiedAt || participant.registeredAt,
    });

    QRCode.toDataURL(verificationPayload, {
      width: 280,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then(url => setQrCodeDataUrl(url))
      .catch(err => console.error('Error generating QR code', err));
  }, [participant, kec, cabor]);

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Halo Bapak/Ibu ${participant.fullName},\n\nBerikut bukti ID Card Digital resmi untuk POR PGRI Kabupaten Mempawah 2026:\n` +
      `• No. Registrasi: ${participant.id}\n` +
      `• Kontingen: ${kec?.name}\n` +
      `• Cabor: ${cabor?.name} (${kategori?.name || '-'})\n` +
      `• Status: ${participant.status}\n` +
      `• Dokumen SK & KTA: ${participant.skDocumentName ? 'Lengkap' : 'Menunggu'}\n` +
      `• Lokasi Venue: ${cabor?.lokasiTanding}\n\n` +
      `Harap membawa atau menunjukkan QR Code ini pada saat verifikasi fisik dan technical meeting.`
    );
    const cleanPhone = participant.phone.replace(/^0/, '62').replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(participant.id);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Topbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Kartu Peserta Digital POR PGRI Mempawah</h3>
            <p className="text-xs text-slate-500">ID Registrasi: <span className="font-mono font-medium text-slate-700">{participant.id}</span></p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card View Switcher */}
        <div className="flex justify-center border-b border-slate-100 py-2.5 bg-slate-50/50">
          <div className="inline-flex rounded-lg bg-slate-200/80 p-1 text-xs font-medium">
            <button
              onClick={() => setActiveSide('front')}
              className={`px-4 py-1.5 rounded-md transition-all ${
                activeSide === 'front'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tampak Depan
            </button>
            <button
              onClick={() => setActiveSide('back')}
              className={`px-4 py-1.5 rounded-md transition-all ${
                activeSide === 'back'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tampak Belakang (Tata Tertib)
            </button>
          </div>
        </div>

        {/* Printable Card Area */}
        <div className="p-6 flex flex-col items-center justify-center bg-slate-100/60 print:p-0 print:bg-white">
          <div
            ref={cardRef}
            id="printable-id-card"
            className="w-full max-w-[360px] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden relative print:shadow-none print:border-2 print:border-slate-800"
          >
            {activeSide === 'front' ? (
              <div>
                {/* Header PGRI */}
                <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-3.5 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none" />
                  <div className="text-[10px] tracking-wider uppercase font-semibold text-emerald-200">
                    Pengurus PGRI Kabupaten Mempawah
                  </div>
                  <h4 className="font-extrabold text-sm tracking-tight text-white leading-tight">
                    PEKAN OLAHRAGA PGRI (POR PGRI)
                  </h4>
                  <div className="text-[10px] text-emerald-100 font-medium">
                    Tahun 2026 · 9 Kecamatan Kab. Mempawah
                  </div>

                  {/* District Banner */}
                  <div
                    className="mt-2 text-xs font-bold py-1 px-3 rounded-full inline-block shadow-sm"
                    style={{ backgroundColor: kec?.warnaTema || '#059669', color: '#ffffff' }}
                  >
                    KONTINGEN {kec?.name.toUpperCase()}
                  </div>
                </div>

                {/* Sub Ribbon Role */}
                <div className="bg-slate-900 text-white px-4 py-1 flex items-center justify-between text-[11px] font-semibold">
                  <span className="tracking-wide uppercase text-amber-300">{participant.role}</span>
                  <span className="font-mono text-[10px] text-slate-300">{participant.id}</span>
                </div>

                {/* Body Content */}
                <div className="p-4">
                  <div className="flex gap-3.5 items-start">
                    {/* Photo with frame */}
                    <div className="relative shrink-0">
                      <img
                        src={participant.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                        alt={participant.fullName}
                        className="w-24 h-32 object-cover rounded-lg border-2 border-slate-200 shadow-sm"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.fullName)}&background=059669&color=fff&size=256`;
                        }}
                      />
                      <span className="absolute bottom-1 right-1 bg-white/95 text-[9px] font-bold px-1.5 py-0.5 rounded shadow text-slate-800">
                        {participant.gender === 'L' ? 'L' : 'P'}
                      </span>
                    </div>

                    {/* Metadata details */}
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                        {participant.fullName}
                      </h5>
                      <p className="text-[11px] text-slate-600 font-mono mt-0.5">
                        NUPTK: {participant.nuptk || '-'}
                      </p>
                      <p className="text-[11px] text-slate-700 font-medium truncate mt-1">
                        🏫 {participant.schoolUnit}
                      </p>

                      <div className="mt-2 pt-2 border-t border-slate-100">
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                          Cabang Olahraga
                        </div>
                        <div className="text-xs font-bold text-emerald-800">
                          {cabor?.name}
                        </div>
                        <div className="text-[11px] text-slate-600">
                          {kategori?.name}
                        </div>
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500">
                        <span>Jersey: <strong className="text-slate-800">{participant.jerseySize}</strong></span>
                        <span>·</span>
                        <span>Darah: <strong className="text-slate-800">{participant.bloodType}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* QR Code and Official Verification Badges */}
                  <div className="mt-3.5 pt-3 border-t border-dashed border-slate-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {qrCodeDataUrl ? (
                        <img
                          src={qrCodeDataUrl}
                          alt="QR Code Verifikasi"
                          className="w-16 h-16 border border-slate-300 rounded p-0.5 bg-white shadow-xs"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-slate-200 animate-pulse rounded" />
                      )}
                      <div>
                        <div className="text-[9px] font-bold text-slate-800 uppercase flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          QR Code Resmi
                        </div>
                        <p className="text-[8px] text-slate-500 leading-tight mt-0.5">
                          Pindai untuk verifikasi keabsahan atlet oleh wasit & panitia POR PGRI Mempawah
                        </p>
                        {/* SK and KTA Check status on card */}
                        <div className="mt-1 flex items-center gap-1 text-[8px] text-emerald-700 font-bold">
                          <FileCheck className="w-2.5 h-2.5 text-emerald-600" />
                          <span>SK & KTA PGRI Sah</span>
                        </div>
                      </div>
                    </div>

                    {/* Verification Status Pill */}
                    <div className="text-right">
                      <div className={`text-[10px] font-bold px-2 py-0.5 rounded inline-flex items-center gap-1 ${
                        participant.status === 'Terverifikasi'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : participant.status === 'Perlu Perbaikan'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}>
                        {participant.status === 'Terverifikasi' && <CheckCircle className="w-3 h-3" />}
                        {participant.status === 'Perlu Perbaikan' && <AlertCircle className="w-3 h-3" />}
                        <span>{participant.status}</span>
                      </div>
                      <div className="text-[8px] text-slate-400 mt-0.5 font-mono">
                        POR-MEMPAWAH-{new Date().getFullYear()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Bar */}
                <div className="bg-slate-100 px-3 py-1.5 text-center text-[9px] text-slate-600 border-t border-slate-200">
                  Venue: <strong>{cabor?.lokasiTanding || 'GOR Opu Daeng Manambon Mempawah'}</strong>
                </div>
              </div>
            ) : (
              /* Back of Card */
              <div className="p-4 bg-white text-slate-800">
                <div className="border-b border-slate-200 pb-2 mb-3 text-center">
                  <h5 className="font-bold text-xs uppercase tracking-wide text-slate-900">
                    Tata Tertib Peserta POR PGRI Kab. Mempawah
                  </h5>
                  <p className="text-[10px] text-slate-500">Pekan Olahraga Persatuan Guru Republik Indonesia</p>
                </div>

                <div className="space-y-2 text-[10px] text-slate-700 leading-relaxed">
                  <div className="flex gap-2">
                    <span className="font-bold text-emerald-700">1.</span>
                    <span>Kartu tanda peserta ini wajib dibawa dan dikenakan selama rangkaian pertandingan POR PGRI.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-emerald-700">2.</span>
                    <span>Atlet wajib memperlihatkan QR Code dan SK Tugas/KTA PGRI asli saat verifikasi meja pertandingan.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-emerald-700">3.</span>
                    <span>Hadir di venue pertandingan minimal 30 menit sebelum jadwal resmi dimulai.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-emerald-700">4.</span>
                    <span>Menjunjung tinggi sportivitas, persaudaraan, dan etika profesi guru PGRI Mempawah.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-emerald-700">5.</span>
                    <span>Keputusan dewan wasit dan panitia pelaksana bersifat mutlak dan final.</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 bg-slate-50 p-2.5 rounded text-[9px] text-slate-600">
                  <div className="font-semibold text-slate-800 mb-1">Sekretariat Panitia Pelaksana:</div>
                  <div>Gedung PGRI Kabupaten Mempawah · Kontak: {kec?.kontak || '0812-5678-1001'}</div>
                  <div className="mt-1 text-slate-500 italic">"Guru Bangkit, Pulihkan Pendidikan, Mempawah Cerdas & Sportif"</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyId}
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              {isCopied ? 'Tersalin!' : 'Salin No. Reg'}
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              Kirim WA
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-all inline-flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak Kartu Peserta
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Selesai
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
