import React, { useState } from 'react';
import { Participant, KecamatanInfo } from '../types';
import { CABANG_OLAHRAGA } from '../data/initialData';
import { X, Search, CheckCircle2, AlertTriangle, ShieldCheck, QrCode, FileText, CreditCard } from 'lucide-react';

interface QrScannerModalProps {
  participants: Participant[];
  kecamatanList: KecamatanInfo[];
  onClose: () => void;
  onSelectParticipant: (participant: Participant) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  participants,
  kecamatanList,
  onClose,
  onSelectParticipant,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [searchResult, setSearchResult] = useState<Participant | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleVerify = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setHasSearched(true);

    let searchId = trimmed;
    try {
      if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
        const parsed = JSON.parse(trimmed);
        if (parsed.id) searchId = parsed.id;
      }
    } catch {
      // not JSON
    }

    const match = participants.find(
      p =>
        p.id.toLowerCase() === searchId.toLowerCase() ||
        p.nuptk === searchId ||
        p.nik === searchId ||
        p.fullName.toLowerCase().includes(searchId.toLowerCase())
    );

    setSearchResult(match || null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Verifikasi QR Code & ID Peserta</h3>
              <p className="text-xs text-slate-500">Pemeriksaan atlet POR PGRI Kab. Mempawah</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input & Search Form */}
        <div className="p-6">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Pindai QR / Masukkan No. Registrasi / NUPTK:
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Contoh: POR-26-MPH-0001 atau NUPTK..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleVerify(inputVal);
                }}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
            <button
              onClick={() => handleVerify(inputVal)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Cek
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div className="mt-3">
            <span className="text-[11px] text-slate-500">Coba nomor registrasi cepat:</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {participants.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setInputVal(p.id);
                    handleVerify(p.id);
                  }}
                  className="px-2 py-1 text-[10px] font-mono bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                >
                  {p.id}
                </button>
              ))}
            </div>
          </div>

          {/* Search Result Display */}
          <div className="mt-6">
            {searchResult ? (
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-900 uppercase">
                    Data Atlet Terverifikasi Ditemukan
                  </span>
                </div>

                <div className="flex gap-3 items-start bg-white p-3 rounded-lg border border-emerald-100 shadow-xs">
                  <img
                    src={searchResult.photoUrl}
                    alt={searchResult.fullName}
                    className="w-16 h-20 object-cover rounded border border-slate-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(searchResult.fullName)}&background=059669&color=fff`;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm">{searchResult.fullName}</h4>
                    <p className="text-xs text-slate-500 font-mono">Reg: {searchResult.id}</p>
                    <p className="text-xs text-slate-600 font-medium mt-1">
                      {kecamatanList.find(k => k.id === searchResult.kecamatanId)?.name}
                    </p>
                    <p className="text-xs text-emerald-700 font-semibold">
                      {CABANG_OLAHRAGA.find(c => c.id === searchResult.caborId)?.name}
                    </p>

                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        searchResult.status === 'Terverifikasi'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {searchResult.status}
                      </span>
                      {searchResult.skDocumentName && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                          <FileText className="w-2.5 h-2.5" /> SK Ada
                        </span>
                      )}
                      {searchResult.ktaDocumentName && (
                        <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 flex items-center gap-1">
                          <CreditCard className="w-2.5 h-2.5" /> KTA Ada
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      onSelectParticipant(searchResult);
                      onClose();
                    }}
                    className="flex-1 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Buka Kartu Peserta
                  </button>
                </div>
              </div>
            ) : hasSearched ? (
              <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-center">
                <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <h5 className="font-bold text-red-900 text-sm">Peserta Tidak Ditemukan</h5>
                <p className="text-xs text-red-700 mt-1">
                  Nomor registrasi atau NUPTK tidak terdaftar pada basis data POR PGRI Kab. Mempawah.
                </p>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
                <QrCode className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-xs text-slate-500">
                  Masukkan nomor registrasi atau tempel hasil scan untuk verifikasi
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
