import React, { useState } from 'react';
import { NotificationLog, Participant, KecamatanInfo } from '../types';
import {
  Bell,
  MessageCircle,
  Mail,
  Send,
  CheckCheck,
  Search,
  ExternalLink,
  Sparkles,
  Smartphone,
  ShieldAlert
} from 'lucide-react';

interface NotificationCenterProps {
  notifications: NotificationLog[];
  participants: Participant[];
  kecamatanList: KecamatanInfo[];
  onSendManualNotif: (notif: NotificationLog) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  participants,
  kecamatanList,
  onSendManualNotif,
}) => {
  const [filterKec, setFilterKec] = useState('all');
  const [search, setSearch] = useState('');
  const [targetKec, setTargetKec] = useState('all');
  const [customMsg, setCustomMsg] = useState('');
  const [customTitle, setCustomTitle] = useState('Pemberitahuan Panitia POR PGRI Mempawah');
  const [isSending, setIsSending] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState<string | null>(null);

  const filteredNotifs = notifications.filter((n) => {
    const matchKec = filterKec === 'all' || n.kecamatanId === filterKec;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      n.participantName.toLowerCase().includes(q) ||
      n.message.toLowerCase().includes(q) ||
      n.recipient.includes(q);
    return matchKec && matchSearch;
  });

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;

    setIsSending(true);

    const targetParticipants = targetKec === 'all'
      ? participants
      : participants.filter(p => p.kecamatanId === targetKec);

    const count = targetParticipants.length;

    targetParticipants.forEach((p, idx) => {
      const log: NotificationLog = {
        id: `NOTIF-BC-${Date.now()}-${idx}`,
        timestamp: new Date().toISOString(),
        participantId: p.id,
        participantName: p.fullName,
        kecamatanId: p.kecamatanId,
        channel: 'WhatsApp',
        recipient: p.phone,
        title: customTitle,
        message: `Halo ${p.fullName}, pengumuman resmi Panitia POR PGRI Kab. Mempawah: ${customMsg}`,
        status: 'Terkirim',
      };
      onSendManualNotif(log);
    });

    setIsSending(false);
    setCustomMsg('');
    setBroadcastSuccess(`Berhasil menyiarkan pesan ke ${count} peserta via WhatsApp Gateway Simulator.`);
    setTimeout(() => setBroadcastSuccess(null), 5000);
  };

  const handleQuickTemplate = (tpl: string) => {
    if (tpl === 'tm') {
      setCustomTitle('Undangan Technical Meeting POR PGRI Mempawah 2026');
      setCustomMsg('Technical Meeting & Pengundian Bagan Pertandingan akan dilaksanakan pada Sabtu pukul 09.00 WIB di Gedung PGRI Kabupaten Mempawah. Harap perwakilan official hadir tepat waktu.');
    } else if (tpl === 'jersey') {
      setCustomTitle('Distribusi Jersey & ID Card Kontingen');
      setCustomMsg('Jersey resmi dan ID Card bertali fisik dapat diambil oleh koordinator masing-masing kecamatan di Gedung PGRI Mempawah Hilir.');
    } else if (tpl === 'berkas') {
      setCustomTitle('Verifikasi Berkas SK Guru & KTA PGRI');
      setCustomMsg('Harap membawa salinan fisik SK Guru / Tugas dan KTA PGRI saat registrasi ulang di venue GOR Opu Daeng Manambon.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Total Notifikasi Terkirim</div>
            <div className="text-2xl font-black text-slate-900">{notifications.length}</div>
            <div className="text-[11px] text-emerald-700 font-medium">WhatsApp Gateway & Email</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
            <CheckCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Tingkat Keberhasilan Pengiriman</div>
            <div className="text-2xl font-black text-slate-900">100%</div>
            <div className="text-[11px] text-blue-700 font-medium">Otomatis saat pendaftaran</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Kontak Terdaftar 9 Kecamatan</div>
            <div className="text-2xl font-black text-slate-900">{participants.length} Kontak</div>
            <div className="text-[11px] text-amber-700 font-medium">Kabupaten Mempawah</div>
          </div>
        </div>
      </div>

      {/* Broadcast Message Simulator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-600" />
              <span>Broadcast Pengumuman Otomatis ke Peserta Mempawah</span>
            </h3>
            <p className="text-xs text-slate-500">
              Kirimkan pengumuman serentak via WhatsApp ke peserta berdasarkan kecamatan terpilih
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500">Template Cepat:</span>
            <button
              onClick={() => handleQuickTemplate('tm')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-medium transition-colors"
            >
              Undangan TM
            </button>
            <button
              onClick={() => handleQuickTemplate('jersey')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-medium transition-colors"
            >
              Ambil Jersey
            </button>
            <button
              onClick={() => handleQuickTemplate('berkas')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-medium transition-colors"
            >
              Berkas SK & KTA
            </button>
          </div>
        </div>

        {broadcastSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{broadcastSuccess}</span>
          </div>
        )}

        <form onSubmit={handleBroadcast} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Kecamatan Penerima:
              </label>
              <select
                value={targetKec}
                onChange={(e) => setTargetKec(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="all">Semua 9 Kecamatan ({participants.length} Peserta)</option>
                {kecamatanList.map((k) => {
                  const c = participants.filter(p => p.kecamatanId === k.id).length;
                  return (
                    <option key={k.id} value={k.id}>
                      {k.name} ({c} Peserta)
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Judul Notifikasi:
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Judul pengumuman..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Isi Pesan WhatsApp:
            </label>
            <textarea
              rows={3}
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="Tuliskan pesan yang akan dikirim secara otomatis ke nomor WhatsApp peserta..."
              className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSending || !customMsg.trim()}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Siarkan Notifikasi Sekarang</span>
            </button>
          </div>
        </form>
      </div>

      {/* Real-time Notification Logs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-600" />
              <span>Log Notifikasi Otomatis Terkirim</span>
            </h3>
            <p className="text-xs text-slate-500">
              Riwayat pesan verifikasi dan konfirmasi pendaftaran yang diterbitkan sistem
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterKec}
              onChange={(e) => setFilterKec(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 font-medium"
            >
              <option value="all">Semua Wilayah</option>
              {kecamatanList.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name}
                </option>
              ))}
            </select>

            <div className="relative">
              <input
                type="text"
                placeholder="Cari penerima / isi pesan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
          {filteredNotifs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Belum ada riwayat notifikasi pada filter ini.
            </div>
          ) : (
            filteredNotifs.map((item) => {
              const kec = kecamatanList.find(k => k.id === item.kecamatanId);
              const cleanPhone = item.recipient.replace(/^0/, '62').replace(/[^0-9]/g, '');

              return (
                <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 shrink-0 mt-0.5">
                    {item.channel === 'WhatsApp' ? (
                      <MessageCircle className="w-4 h-4" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{item.title}</span>
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          {item.channel}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {kec?.name || item.kecamatanId}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(item.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                      {item.message}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Penerima: <strong className="text-slate-700">{item.participantName}</strong> ({item.recipient})</span>
                      {item.channel === 'WhatsApp' && (
                        <a
                          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(item.message)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 hover:text-emerald-900 font-semibold inline-flex items-center gap-1"
                        >
                          Buka di WA <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
