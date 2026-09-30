import React, { useState } from 'react';
import { KecamatanInfo } from '../types';
import { X, Building2, Save, MapPin, Phone, UserCheck, Palette, Hash } from 'lucide-react';

interface KecamatanEditModalProps {
  kecamatan: KecamatanInfo;
  onSave: (updated: KecamatanInfo) => void;
  onClose: () => void;
}

const PRESET_COLORS = [
  '#059669', // Emerald
  '#2563eb', // Blue
  '#d97706', // Amber
  '#7c3aed', // Purple
  '#0284c7', // Sky
  '#dc2626', // Red
  '#4f46e5', // Indigo
  '#0d9488', // Teal
  '#ea580c', // Orange
  '#16a34a', // Green
  '#9333ea', // Violet
  '#e11d48', // Rose
];

export const KecamatanEditModal: React.FC<KecamatanEditModalProps> = ({
  kecamatan,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(kecamatan.name);
  const [code, setCode] = useState(kecamatan.code);
  const [ketuaRanting, setKetuaRanting] = useState(kecamatan.ketuaRanting);
  const [kontak, setKontak] = useState(kecamatan.kontak);
  const [alamatSekretariat, setAlamatSekretariat] = useState(kecamatan.alamatSekretariat);
  const [kuotaMaksimal, setKuotaMaksimal] = useState(kecamatan.kuotaMaksimal);
  const [warnaTema, setWarnaTema] = useState(kecamatan.warnaTema);
  const [badgeText, setBadgeText] = useState(kecamatan.badgeText);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Nama kecamatan tidak boleh kosong');
      return;
    }
    if (!code.trim()) {
      setErrorMsg('Kode singkatan wilayah tidak boleh kosong');
      return;
    }

    const updated: KecamatanInfo = {
      ...kecamatan,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      ketuaRanting: ketuaRanting.trim(),
      kontak: kontak.trim(),
      alamatSekretariat: alamatSekretariat.trim(),
      kuotaMaksimal: Number(kuotaMaksimal) || 45,
      warnaTema,
      badgeText: badgeText.trim(),
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: warnaTema }}
            >
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Edit Data Kecamatan / Kontingen</h3>
              <p className="text-xs text-slate-500">Pembaruan informasi PGRI Ranting Kab. Mempawah</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Nama Kecamatan */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Kecamatan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Kecamatan Mempawah Hilir"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Kode Singkatan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kode Singkatan (ID Peserta) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={5}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Contoh: MPH"
                  className="w-full pl-8 pr-3 py-2 text-sm font-mono uppercase border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Label Wilayah */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Label Wilayah / Badge
              </label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="Contoh: Ibukota Kab. Mempawah"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Ketua Ranting */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ketua Cabang PGRI / Koordinator Kontingen
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={ketuaRanting}
                  onChange={(e) => setKetuaRanting(e.target.value)}
                  placeholder="Nama lengkap & gelar ketua cabang"
                  className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <UserCheck className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Nomor Kontak WhatsApp */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Kontak / WhatsApp
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={kontak}
                  onChange={(e) => setKontak(e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Kuota Maksimal */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kuota Maksimal Kontingen
              </label>
              <input
                type="number"
                min={5}
                max={200}
                value={kuotaMaksimal}
                onChange={(e) => setKuotaMaksimal(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Alamat Sekretariat */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alamat Sekretariat Cabang PGRI
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={alamatSekretariat}
                  onChange={(e) => setAlamatSekretariat(e.target.value)}
                  placeholder="Gedung / Sekolah sekretariat PGRI kecamatan..."
                  className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Warna Identitas */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Warna Tema Identitas Kontingen</span>
                <span className="font-mono text-[10px] text-slate-500">{warnaTema}</span>
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setWarnaTema(c)}
                    className={`w-7 h-7 rounded-full transition-transform hover:scale-110 flex items-center justify-center ${
                      warnaTema === c ? 'ring-2 ring-slate-900 ring-offset-2' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <input
                  type="color"
                  value={warnaTema}
                  onChange={(e) => setWarnaTema(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300"
                  title="Pilih warna custom"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
