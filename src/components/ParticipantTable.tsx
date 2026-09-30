import React, { useState } from 'react';
import { Participant, VerificationStatus, KecamatanInfo } from '../types';
import { CABANG_OLAHRAGA } from '../data/initialData';
import {
  Search,
  Filter,
  CreditCard,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Phone,
  MessageCircle,
  FileText,
  Eye,
  ExternalLink
} from 'lucide-react';

interface ParticipantTableProps {
  participants: Participant[];
  kecamatanList: KecamatanInfo[];
  onViewIdCard: (participant: Participant) => void;
  onUpdateStatus: (id: string, status: VerificationStatus, notes?: string) => void;
  onDelete: (id: string) => void;
  initialKecamatanFilter?: string;
}

export const ParticipantTable: React.FC<ParticipantTableProps> = ({
  participants,
  kecamatanList,
  onViewIdCard,
  onUpdateStatus,
  onDelete,
  initialKecamatanFilter = 'all',
}) => {
  const [search, setSearch] = useState('');
  const [filterKec, setFilterKec] = useState(initialKecamatanFilter);
  const [filterCabor, setFilterCabor] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');

  // Preview Document Modal State
  const [previewDoc, setPreviewDoc] = useState<{ title: string; url: string; isPdf: boolean } | null>(null);

  // Synchronize initial filter if prop changes
  React.useEffect(() => {
    if (initialKecamatanFilter) {
      setFilterKec(initialKecamatanFilter);
    }
  }, [initialKecamatanFilter]);

  // Filter Logic
  const filtered = participants.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.fullName.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.nuptk.toLowerCase().includes(q) ||
      p.schoolUnit.toLowerCase().includes(q) ||
      p.phone.includes(q);

    const matchKec = filterKec === 'all' || p.kecamatanId === filterKec;
    const matchCabor = filterCabor === 'all' || p.caborId === filterCabor;
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchRole = filterRole === 'all' || p.role === filterRole;

    return matchSearch && matchKec && matchCabor && matchStatus && matchRole;
  });

  const handleStatusChange = (participant: Participant, newStatus: VerificationStatus) => {
    let note = participant.notes;
    if (newStatus === 'Perlu Perbaikan') {
      const promptNote = window.prompt(
        'Masukkan catatan perbaikan berkas untuk atlet ini:',
        participant.notes || 'Pas foto buram / lampiran SK Guru / KTA PGRI kurang jelas'
      );
      if (promptNote === null) return;
      note = promptNote;
    }
    onUpdateStatus(participant.id, newStatus, note);
  };

  const handleOpenDoc = (title: string, url?: string, fileName?: string) => {
    if (!url) return;
    const isPdf = url.startsWith('data:application/pdf') || (fileName && fileName.endsWith('.pdf')) || false;
    setPreviewDoc({ title, url, isPdf });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Top Filter and Search Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Cari nama atlet, nomor registrasi, NUPTK, sekolah di Kab. Mempawah..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 sm:top-3" />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
            <span>Ditemukan: <strong className="text-slate-800 font-bold">{filtered.length}</strong> dari {participants.length} data</span>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {/* Kecamatan Mempawah */}
          <select
            value={filterKec}
            onChange={(e) => setFilterKec(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
          >
            <option value="all">Semua 9 Kecamatan Mempawah</option>
            {kecamatanList.map((k) => (
              <option key={k.id} value={k.id}>
                {k.name} ({k.code})
              </option>
            ))}
          </select>

          {/* Cabor */}
          <select
            value={filterCabor}
            onChange={(e) => setFilterCabor(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
          >
            <option value="all">Semua Cabang Olahraga</option>
            {CABANG_OLAHRAGA.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
          >
            <option value="all">Semua Status Verifikasi</option>
            <option value="Terverifikasi">Terverifikasi (Sah)</option>
            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
            <option value="Perlu Perbaikan">Perlu Perbaikan Berkas</option>
          </select>

          {/* Role */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
          >
            <option value="all">Semua Peran (Atlet / Official)</option>
            <option value="Atlet">Atlet</option>
            <option value="Official">Official Kontingen</option>
            <option value="Pelatih">Pelatih</option>
          </select>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/70 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              <th className="py-3 px-4">Peserta & Identitas</th>
              <th className="py-3 px-4">Kontingen Wilayah</th>
              <th className="py-3 px-4">Cabor & Nomor</th>
              <th className="py-3 px-4">Unit Sekolah</th>
              <th className="py-3 px-4">Lampiran SK & KTA</th>
              <th className="py-3 px-4">Status Berkas</th>
              <th className="py-3 px-4 text-center">Verifikasi</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  Tidak ada data peserta yang cocok dengan kriteria pencarian atau filter.
                </td>
              </tr>
            ) : (
              filtered.map((p) => {
                const kec = kecamatanList.find(k => k.id === p.kecamatanId);
                const cabor = CABANG_OLAHRAGA.find(c => c.id === p.caborId);
                const kategori = cabor?.kategori.find(k => k.id === p.caborCategoryId);

                const hasSk = !!(p.skDocumentUrl || p.skDocumentName);
                const hasKta = !!(p.ktaDocumentUrl || p.ktaDocumentName);

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Athlete photo and info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.photoUrl}
                          alt={p.fullName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.fullName)}&background=059669&color=fff`;
                          }}
                        />
                        <div>
                          <div className="font-bold text-slate-900 leading-tight">
                            {p.fullName}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                            <span>{p.id}</span>
                            <span>·</span>
                            <span>{p.gender === 'L' ? 'Putra' : 'Putri'}</span>
                            <span>·</span>
                            <span>{p.role}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Kontingen */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: kec?.warnaTema || '#059669' }}
                        />
                        <span className="font-semibold text-slate-800">{kec?.name || p.kecamatanId}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block ml-3.5">
                        {kec?.badgeText || kec?.code}
                      </span>
                    </td>

                    {/* Cabor */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-emerald-800">{cabor?.name}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[150px]">
                        {kategori?.name || '-'}
                      </div>
                    </td>

                    {/* School */}
                    <td className="py-3 px-4 text-slate-700">
                      <div className="font-medium truncate max-w-[160px]">{p.schoolUnit}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        NUPTK: {p.nuptk || '-'}
                      </div>
                    </td>

                    {/* SK & KTA PGRI Documents Column */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        {hasSk ? (
                          <button
                            onClick={() => handleOpenDoc(`SK Guru - ${p.fullName}`, p.skDocumentUrl, p.skDocumentName)}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 transition-colors w-fit"
                          >
                            <FileText className="w-3 h-3 text-emerald-600" />
                            <span>SK Guru</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">SK: Belum ada</span>
                        )}

                        {hasKta ? (
                          <button
                            onClick={() => handleOpenDoc(`KTA PGRI - ${p.fullName}`, p.ktaDocumentUrl, p.ktaDocumentName)}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 transition-colors w-fit"
                          >
                            <CreditCard className="w-3 h-3 text-blue-600" />
                            <span>KTA PGRI</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">KTA: Belum ada</span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        p.status === 'Terverifikasi'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'Perlu Perbaikan'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {p.status === 'Terverifikasi' && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                        {p.status === 'Perlu Perbaikan' && <AlertCircle className="w-3 h-3 text-amber-600" />}
                        {p.status === 'Menunggu Verifikasi' && <Clock className="w-3 h-3 text-blue-600" />}
                        <span>{p.status}</span>
                      </span>
                      {p.notes && (
                        <p className="text-[10px] text-slate-500 italic mt-0.5 line-clamp-1 max-w-[130px]" title={p.notes}>
                          {p.notes}
                        </p>
                      )}
                    </td>

                    {/* Quick Verification Changer */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-[10px] font-semibold">
                        <button
                          onClick={() => handleStatusChange(p, 'Terverifikasi')}
                          className={`px-2 py-1 rounded transition-colors ${
                            p.status === 'Terverifikasi'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-emerald-700'
                          }`}
                          title="Sahkan & Verifikasi"
                        >
                          Sah
                        </button>
                        <button
                          onClick={() => handleStatusChange(p, 'Menunggu Verifikasi')}
                          className={`px-2 py-1 rounded transition-colors ${
                            p.status === 'Menunggu Verifikasi'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-blue-700'
                          }`}
                          title="Tandai Menunggu"
                        >
                          Antre
                        </button>
                        <button
                          onClick={() => handleStatusChange(p, 'Perlu Perbaikan')}
                          className={`px-2 py-1 rounded transition-colors ${
                            p.status === 'Perlu Perbaikan'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-amber-700'
                          }`}
                          title="Minta Perbaikan Berkas"
                        >
                          Revisi
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onViewIdCard(p)}
                          className="p-1.5 text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                          title="Cetak & Lihat Kartu Digital QR"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>

                        <a
                          href={`https://wa.me/${p.phone.replace(/^0/, '62').replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Kirim Pesan WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => {
                            if (window.confirm(`Yakin ingin menghapus pendaftaran ${p.fullName}?`)) {
                              onDelete(p.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Peserta"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>{previewDoc.title}</span>
              </h4>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-slate-700 text-xs px-2 py-1 bg-slate-100 rounded-lg"
              >
                Tutup
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-slate-100 rounded-xl p-4">
              {previewDoc.isPdf ? (
                <div className="text-center p-8 bg-white rounded-xl shadow-xs border border-slate-200">
                  <FileText className="w-16 h-16 text-red-500 mx-auto mb-3" />
                  <h5 className="font-bold text-slate-800 text-sm">Dokumen Format PDF</h5>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Dokumen SK Resmi telah terenkripsi dan tersimpan dalam sistem verifikasi keabsahan.
                  </p>
                  <a
                    href={previewDoc.url}
                    download="Dokumen_Verifikasi_POR_PGRI.pdf"
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl inline-flex items-center gap-1.5"
                  >
                    <span>Unduh / Buka Dokumen</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <img
                  src={previewDoc.url}
                  alt={previewDoc.title}
                  className="max-h-[60vh] object-contain rounded-lg shadow-sm"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
