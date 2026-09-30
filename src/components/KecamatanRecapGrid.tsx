import React from 'react';
import { Participant, KecamatanInfo } from '../types';
import { CABANG_OLAHRAGA } from '../data/initialData';
import { Users, Phone, MapPin, CheckCircle, Clock, AlertCircle, Edit3 } from 'lucide-react';

interface KecamatanRecapGridProps {
  participants: Participant[];
  kecamatanList: KecamatanInfo[];
  selectedKecamatanFilter: string;
  onSelectKecamatan: (kecamatanId: string) => void;
  onEditKecamatan: (kecamatan: KecamatanInfo) => void;
}

export const KecamatanRecapGrid: React.FC<KecamatanRecapGridProps> = ({
  participants,
  kecamatanList,
  selectedKecamatanFilter,
  onSelectKecamatan,
  onEditKecamatan,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">Rekapitulasi 9 Wilayah Kontingen Kecamatan Kab. Mempawah</h3>
          <p className="text-xs text-slate-500">
            Monitoring keterisian kuota dan status verifikasi berkas SK & KTA PGRI per wilayah. Klik tombol edit untuk memperbarui data kecamatan.
          </p>
        </div>
        {selectedKecamatanFilter !== 'all' && (
          <button
            onClick={() => onSelectKecamatan('all')}
            className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
          >
            Tampilkan Semua 9 Wilayah
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kecamatanList.map((kec) => {
          const kecParticipants = participants.filter(p => p.kecamatanId === kec.id);
          const total = kecParticipants.length;
          const max = kec.kuotaMaksimal;
          const percentage = Math.round((total / max) * 100);

          const terverifikasi = kecParticipants.filter(p => p.status === 'Terverifikasi').length;
          const pending = kecParticipants.filter(p => p.status === 'Menunggu Verifikasi').length;
          const revisi = kecParticipants.filter(p => p.status === 'Perlu Perbaikan').length;

          const atlet = kecParticipants.filter(p => p.role === 'Atlet').length;
          const official = kecParticipants.filter(p => p.role === 'Official' || p.role === 'Pelatih').length;

          const isSelected = selectedKecamatanFilter === kec.id;

          return (
            <div
              key={kec.id}
              className={`rounded-2xl border bg-white p-5 transition-all duration-200 shadow-xs hover:shadow-md relative ${
                isSelected
                  ? 'border-emerald-600 ring-2 ring-emerald-500/30 bg-emerald-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div
                  className="cursor-pointer flex-1"
                  onClick={() => onSelectKecamatan(isSelected ? 'all' : kec.id)}
                >
                  <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500">
                    {kec.badgeText} · {kec.code}
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-base leading-tight mt-0.5 hover:text-emerald-700 transition-colors">
                    {kec.name}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="w-3.5 h-3.5 rounded-full shadow-xs"
                    style={{ backgroundColor: kec.warnaTema }}
                  />
                  {/* EDIT KECAMATAN BUTTON */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditKecamatan(kec);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                    title={`Edit Pengaturan ${kec.name}`}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Coordinator contact */}
              <div
                className="mt-2.5 pt-2.5 border-t border-slate-100 text-xs text-slate-600 space-y-1 cursor-pointer"
                onClick={() => onSelectKecamatan(isSelected ? 'all' : kec.id)}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-medium text-slate-800 truncate">{kec.ketuaRanting || 'Koordinator Belum Diatur'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{kec.kontak || '-'}</span>
                </div>
              </div>

              {/* Quota Progress */}
              <div
                className="mt-3.5 cursor-pointer"
                onClick={() => onSelectKecamatan(isSelected ? 'all' : kec.id)}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-500">Keterisian Kuota</span>
                  <span className="font-bold text-slate-800">
                    {total} <span className="text-slate-400 font-normal">/ {max} Peserta ({percentage}%)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, percentage)}%`,
                      backgroundColor: kec.warnaTema,
                    }}
                  />
                </div>
              </div>

              {/* Status Breakdown Badges */}
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                <div className="bg-emerald-50 rounded-lg py-1.5 px-1 border border-emerald-100">
                  <div className="text-[10px] font-semibold text-emerald-800 flex items-center justify-center gap-0.5">
                    <CheckCircle className="w-2.5 h-2.5" /> Sah
                  </div>
                  <div className="font-bold text-emerald-900 text-sm">{terverifikasi}</div>
                </div>

                <div className="bg-blue-50 rounded-lg py-1.5 px-1 border border-blue-100">
                  <div className="text-[10px] font-semibold text-blue-800 flex items-center justify-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" /> Antre
                  </div>
                  <div className="font-bold text-blue-900 text-sm">{pending}</div>
                </div>

                <div className="bg-amber-50 rounded-lg py-1.5 px-1 border border-amber-100">
                  <div className="text-[10px] font-semibold text-amber-800 flex items-center justify-center gap-0.5">
                    <AlertCircle className="w-2.5 h-2.5" /> Revisi
                  </div>
                  <div className="font-bold text-amber-900 text-sm">{revisi}</div>
                </div>
              </div>

              {/* Role Ratio & Quick Filter */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span>Atlet: <strong className="text-slate-700">{atlet}</strong></span>
                <span>·</span>
                <span>Official: <strong className="text-slate-700">{official}</strong></span>
                <span>·</span>
                <button
                  onClick={() => onSelectKecamatan(isSelected ? 'all' : kec.id)}
                  className="text-emerald-700 font-semibold hover:underline"
                >
                  {isSelected ? 'Tutup Filter' : 'Filter Atlet →'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
