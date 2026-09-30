import React, { useState } from 'react';
import { Participant, Gender, ParticipantRole, JerseySize, NotificationLog, KecamatanInfo } from '../types';
import { CABANG_OLAHRAGA } from '../data/initialData';
import { storageService } from '../services/storageService';
import {
  UserCheck,
  MapPin,
  Trophy,
  Upload,
  Sparkles,
  Phone,
  Mail,
  School,
  IdCard,
  CheckCircle,
  AlertCircle,
  FileText,
  CreditCard,
  Eye,
  Trash2
} from 'lucide-react';

interface RegistrationFormProps {
  participants: Participant[];
  kecamatanList: KecamatanInfo[];
  onSuccess: (participant: Participant, notification: NotificationLog) => void;
}

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
];

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  participants,
  kecamatanList,
  onSuccess,
}) => {
  // Form State
  const defaultKecId = kecamatanList[0]?.id || 'mempawah-hilir';
  const [kecamatanId, setKecamatanId] = useState<string>(defaultKecId);
  const [fullName, setFullName] = useState<string>('');
  const [nik, setNik] = useState<string>('');
  const [nuptk, setNuptk] = useState<string>('');
  const [gender, setGender] = useState<Gender>('L');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [schoolUnit, setSchoolUnit] = useState<string>('');
  const [caborId, setCaborId] = useState<string>('bulutangkis');
  const [caborCategoryId, setCaborCategoryId] = useState<string>('bt_g_pa');
  const [role, setRole] = useState<ParticipantRole>('Atlet');
  const [jerseySize, setJerseySize] = useState<JerseySize>('L');
  const [bloodType, setBloodType] = useState<string>('O');
  const [photoUrl, setPhotoUrl] = useState<string>(SAMPLE_AVATARS[0]);

  // Upload SK & KTA PGRI State
  const [skDocUrl, setSkDocUrl] = useState<string>('');
  const [skDocName, setSkDocName] = useState<string>('');
  const [ktaDocUrl, setKtaDocUrl] = useState<string>('');
  const [ktaDocName, setKtaDocName] = useState<string>('');

  const [notes, setNotes] = useState<string>('');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Selected cabor and kecamatan metadata
  const selectedCabor = CABANG_OLAHRAGA.find(c => c.id === caborId);
  const selectedKecamatan = kecamatanList.find(k => k.id === kecamatanId) || kecamatanList[0];

  // Filter categories by gender
  const availableCategories = selectedCabor?.kategori.filter(
    k => !k.genderLimit || k.genderLimit === 'Semua' || k.genderLimit === gender
  ) || [];

  // Calculate real-time quota
  const currentKecParticipants = participants.filter(p => p.kecamatanId === kecamatanId);
  const currentQuotaUsed = currentKecParticipants.length;
  const maxQuota = selectedKecamatan?.kuotaMaksimal || 45;
  const isQuotaFull = currentQuotaUsed >= maxQuota;

  // Handle sport change
  const handleCaborChange = (newCaborId: string) => {
    setCaborId(newCaborId);
    const newCabor = CABANG_OLAHRAGA.find(c => c.id === newCaborId);
    if (newCabor && newCabor.kategori.length > 0) {
      const match = newCabor.kategori.find(
        k => !k.genderLimit || k.genderLimit === 'Semua' || k.genderLimit === gender
      );
      setCaborCategoryId(match ? match.id : newCabor.kategori[0].id);
    }
  };

  // Handle gender change
  const handleGenderChange = (newGender: Gender) => {
    setGender(newGender);
    if (selectedCabor) {
      const match = selectedCabor.kategori.find(
        k => !k.genderLimit || k.genderLimit === 'Semua' || k.genderLimit === newGender
      );
      if (match) {
        setCaborCategoryId(match.id);
      }
    }
  };

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setErrorMsg('Ukuran pas foto maksimal 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle SK Document Upload
  const handleSkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Ukuran file SK Guru maksimal 5MB.');
      return;
    }

    setSkDocName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setSkDocUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle KTA PGRI Upload
  const handleKtaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Ukuran file Kartu PGRI maksimal 5MB.');
      return;
    }

    setKtaDocName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setKtaDocUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Quick fill sample data for testing
  const handleFillSample = () => {
    const randomKec = kecamatanList[Math.floor(Math.random() * kecamatanList.length)] || kecamatanList[0];
    const isMale = Math.random() > 0.4;
    const g: Gender = isMale ? 'L' : 'P';

    setKecamatanId(randomKec.id);
    setGender(g);
    setFullName(isMale ? 'Drs. H. Ahmad Sudrajat, M.Pd.' : 'Hj. Endang Lestari, S.Pd.SD');
    setNik(`610201${Math.floor(1000000000 + Math.random() * 9000000000)}`);
    setNuptk(`198${Math.floor(1000000000000 + Math.random() * 900000000000)}`);
    setPhone(`0812${Math.floor(10000000 + Math.random() * 90000000)}`);
    setEmail(`guru.${randomKec.id}@mempawah-pgri.org`);
    setSchoolUnit(`SMPN 1 ${randomKec.name.replace('Kecamatan ', '')}`);
    setRole('Atlet');
    setJerseySize(isMale ? 'XL' : 'M');
    setBloodType(['A', 'B', 'AB', 'O'][Math.floor(Math.random() * 4)]);
    setPhotoUrl(SAMPLE_AVATARS[Math.floor(Math.random() * SAMPLE_AVATARS.length)]);
    setSkDocName(`SK_Tugas_Kepsek_${randomKec.code}.pdf`);
    setSkDocUrl('data:application/pdf;base64,JVBERi0xLjQKJeLjz9MK');
    setKtaDocName(`KTA_PGRI_${randomKec.code}_Resmi.jpg`);
    setKtaDocUrl('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80');
    setNotes('KTA PGRI Mempawah aktif dan surat rekomendasi kepala sekolah terlampir lengkap.');
    setAgreeTerms(true);
    setErrorMsg(null);
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Nama lengkap wajib diisi.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Nomor WhatsApp aktif wajib diisi untuk pengiriman notifikasi otomatis.');
      return;
    }
    if (!schoolUnit.trim()) {
      setErrorMsg('Unit kerja / sekolah asal wajib diisi.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Harap centang persetujuan keabsahan data anggota PGRI.');
      return;
    }

    if (isQuotaFull) {
      setErrorMsg(`Mohon maaf, kuota pendaftaran untuk ${selectedKecamatan?.name} sudah terpenuhi (${maxQuota} orang).`);
      return;
    }

    // Generate unique ID with Mempawah code
    const countInKec = participants.filter(p => p.kecamatanId === kecamatanId).length + 1;
    const yearCode = '26';
    const code = selectedKecamatan?.code || 'MPH';
    const numPadded = countInKec.toString().padStart(4, '0');
    const newId = `POR-${yearCode}-${code}-${numPadded}`;

    const newParticipant: Participant = {
      id: newId,
      nik: nik.trim() || '6102000000000000',
      nuptk: nuptk.trim() || '-',
      fullName: fullName.trim(),
      gender,
      phone: phone.trim(),
      email: email.trim() || `${newId.toLowerCase()}@pgri-mempawah.or.id`,
      kecamatanId,
      schoolUnit: schoolUnit.trim(),
      caborId,
      caborCategoryId: caborCategoryId || availableCategories[0]?.id || 'umum',
      role,
      jerseySize,
      bloodType,
      status: 'Terverifikasi',
      photoUrl,
      skDocumentName: skDocName || undefined,
      skDocumentUrl: skDocUrl || undefined,
      ktaDocumentName: ktaDocName || undefined,
      ktaDocumentUrl: ktaDocUrl || undefined,
      registeredAt: new Date().toISOString(),
      notes: notes.trim() || (skDocName && ktaDocName ? 'Berkas SK Guru & KTA PGRI lengkap terunggah' : 'Pendaftaran online mandiri portal POR PGRI Mempawah'),
      verifiedBy: 'Sistem Terpadu POR PGRI Mempawah',
      verifiedAt: new Date().toISOString(),
    };

    const { participant, notification } = storageService.addParticipant(newParticipant);
    onSuccess(participant, notification);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Intro Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            <UserCheck className="w-4 h-4" />
            <span>Formulir Pendaftaran Resmi Kontingen Kab. Mempawah</span>
          </div>
          <button
            type="button"
            onClick={handleFillSample}
            className="text-xs text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 font-medium"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Isi Data Contoh Cepat (Testing)</span>
          </button>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Pendaftaran Atlet & Official POR PGRI Kab. Mempawah 2026
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Daftarkan perwakilan dari 9 kecamatan di Kabupaten Mempawah lengkap dengan pas foto resmi, unggahan SK Tugas / SK Pengangkatan Guru, dan Kartu Tanda Anggota (KTA) PGRI.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Pilihan Wilayah Kecamatan di Mempawah */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="font-bold text-slate-900 text-base">
                Pilih Kontingen Kecamatan (Kabupaten Mempawah)
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              Keterisian Kuota: <strong className="text-slate-800">{currentQuotaUsed}</strong> / {maxQuota} Orang
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {kecamatanList.map((k) => {
              const count = participants.filter(p => p.kecamatanId === k.id).length;
              const isSelected = kecamatanId === k.id;
              const isFull = count >= k.kuotaMaksimal;

              return (
                <div
                  key={k.id}
                  onClick={() => !isFull && setKecamatanId(k.id)}
                  className={`relative p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                      : isFull
                      ? 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                        {k.badgeText}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{k.name}</h4>
                    </div>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: k.warnaTema }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-600 truncate mt-1">
                    Koord: {k.ketuaRanting}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Kuota: {count}/{k.kuotaMaksimal}</span>
                    {isSelected && (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Terpilih
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (count / k.kuotaMaksimal) * 100)}%`,
                        backgroundColor: k.warnaTema,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Data Diri Atlet & Guru */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h3 className="font-bold text-slate-900 text-base">
              Identitas Peserta / Anggota PGRI Mempawah
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Lengkap & Gelar <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Contoh: Drs. H. Ahmad Sudrajat, M.Pd."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            {/* NUPTK / NIP */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                NUPTK atau NIP (Nomor Induk Pegawai)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="16 digit NUPTK atau NIP"
                  value={nuptk}
                  onChange={(e) => setNuptk(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                />
                <IdCard className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            {/* NIK */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                NIK (Nomor Induk Kependudukan)
              </label>
              <input
                type="text"
                placeholder="16 digit NIK KTP (Kalbar 6102...)"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>

            {/* Gender Switcher */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Jenis Kelamin <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleGenderChange('L')}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-center ${
                    gender === 'L'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  👨 Laki-laki (Putra)
                </button>
                <button
                  type="button"
                  onClick={() => handleGenderChange('P')}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-center ${
                    gender === 'P'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  👩 Perempuan (Putri)
                </button>
              </div>
            </div>

            {/* Role Switcher */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Peran Kontingen <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Atlet', 'Official', 'Pelatih'] as ParticipantRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                      role === r
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone WhatsApp */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                <span className="text-[11px] font-normal text-slate-500 ml-1">(Notifikasi Otomatis)</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 081256789900"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Alamat Email Aktif
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Contoh: guru@mempawah.sch.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            {/* School Unit */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Asal Unit Kerja / Sekolah / Ranting PGRI <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Contoh: SMPN 1 Mempawah Hilir / SMAN 1 Sungai Pinyuh / SDN 02 Jongkat"
                  value={schoolUnit}
                  onChange={(e) => setSchoolUnit(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <School className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            {/* Jersey Size */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Ukuran Kaos Jersey Kontingen
              </label>
              <select
                value={jerseySize}
                onChange={(e) => setJerseySize(e.target.value as JerseySize)}
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="S">S (Lebar 48cm)</option>
                <option value="M">M (Lebar 50cm)</option>
                <option value="L">L (Lebar 52cm)</option>
                <option value="XL">XL (Lebar 54cm)</option>
                <option value="XXL">XXL (Lebar 56cm)</option>
                <option value="3XL">3XL (Lebar 58cm)</option>
              </select>
            </div>

            {/* Blood Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Golongan Darah (Medis Pertandingan)
              </label>
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
                <option value="-">Tidak Tahu / Lainnya</option>
              </select>
            </div>
          </div>
        </div>

        {/* Step 3: Cabang Olahraga */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h3 className="font-bold text-slate-900 text-base">
              Cabang Olahraga & Nomor Pertandingan POR PGRI Mempawah
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {CABANG_OLAHRAGA.map((c) => {
              const isSelected = caborId === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => handleCaborChange(c.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{c.name}</span>
                    {isSelected && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {c.deskripsi}
                  </p>
                  <div className="mt-2 text-[10px] text-emerald-800 font-medium">
                    📍 {c.lokasiTanding}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nomor / Kategori Pertandingan ({selectedCabor?.name}):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableCategories.map((kat) => (
                <button
                  key={kat.id}
                  type="button"
                  onClick={() => setCaborCategoryId(kat.id)}
                  className={`py-2 px-3 text-xs font-medium rounded-xl border text-left flex items-center justify-between transition-all ${
                    caborCategoryId === kat.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{kat.name}</span>
                  {caborCategoryId === kat.id && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 4: FITUR BARU - UNGGAH SK GURU & KARTU PGRI (KTA) */}
        <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-xs bg-gradient-to-br from-emerald-50/30 to-teal-50/20">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                4
              </span>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span>Unggah Dokumen Verifikasi (SK Tugas & Kartu Anggota PGRI)</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-700 text-white px-2 py-0.5 rounded-full">
                  Wajib Keabsahan
                </span>
              </h3>
            </div>
            <span className="text-xs text-slate-500">Format PDF, JPG, atau PNG (Maks 5MB)</span>
          </div>

          <p className="text-xs text-slate-600 mb-5">
            Sesuai ketentuan Panitia POR PGRI Kabupaten Mempawah, setiap atlet dan official wajib melampirkan salinan SK Tugas/SK Guru serta Kartu Tanda Anggota (KTA) PGRI fisik atau digital untuk verifikasi absah keanggotaan.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Box 1: SK Pengangkatan / Tugas Guru */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs hover:border-emerald-400 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Surat Keputusan (SK) Guru</h4>
                    <p className="text-[11px] text-slate-500">SK Kepala Sekolah / SK Pengangkatan Guru</p>
                  </div>
                </div>
              </div>

              {skDocName ? (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-semibold text-emerald-950 truncate">{skDocName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSkDocName('');
                      setSkDocUrl('');
                    }}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                    title="Hapus file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="mt-3">
                  <label className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-colors bg-slate-50/50 hover:bg-emerald-50/30">
                    <Upload className="w-6 h-6 text-emerald-600 mb-1.5" />
                    <span className="text-xs font-bold text-slate-700">Pilih Dokumen SK Guru</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">PDF, JPG, PNG (Maks 5MB)</span>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleSkUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Box 2: Kartu Anggota PGRI (KTA) */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs hover:border-emerald-400 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 text-blue-800 rounded-lg">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Kartu Tanda Anggota (KTA) PGRI</h4>
                    <p className="text-[11px] text-slate-500">Foto KTA Fisik / Screenshot Kartu Digital</p>
                  </div>
                </div>
              </div>

              {ktaDocName ? (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-xs font-semibold text-blue-950 truncate">{ktaDocName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setKtaDocName('');
                      setKtaDocUrl('');
                    }}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                    title="Hapus file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="mt-3">
                  <label className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-colors bg-slate-50/50 hover:bg-blue-50/30">
                    <Upload className="w-6 h-6 text-blue-600 mb-1.5" />
                    <span className="text-xs font-bold text-slate-700">Pilih Foto Kartu PGRI</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, PDF (Maks 5MB)</span>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleKtaUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step 5: Pas Foto Profil Atlet */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
              5
            </span>
            <h3 className="font-bold text-slate-900 text-base">
              Pas Foto Resmi untuk ID Card Digital
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="shrink-0 text-center">
              <img
                src={photoUrl}
                alt="Preview Atlet"
                className="w-28 h-36 object-cover rounded-xl border-2 border-emerald-600 shadow-md mx-auto"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Ukuran 3x4 Proporsional</span>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Unggah Foto Dari Perangkat:
                </label>
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors bg-white">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>Pilih File Pas Foto (JPG / PNG)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Atau gunakan foto sampel:
                </label>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_AVATARS.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="Sample"
                      onClick={() => setPhotoUrl(url)}
                      className={`w-10 h-10 rounded-lg object-cover cursor-pointer border-2 transition-transform hover:scale-105 ${
                        photoUrl === url ? 'border-emerald-600 ring-2 ring-emerald-300' : 'border-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Tambahan / Prestasi Terakhir (Opsional):
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Juara 1 Voli PGRI Ranting Sungai Pinyuh tahun 2025..."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Statement Checkbox */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <span className="text-xs text-slate-600 leading-relaxed">
                Saya menyatakan bahwa seluruh data, dokumen SK Guru, dan Kartu PGRI yang diunggah adalah asli serta bersangkutan merupakan tenaga pendidik/kependidikan sah di wilayah <strong>{selectedKecamatan?.name}</strong>, Kabupaten Mempawah.
              </span>
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-500">
            Setelah dikirim, sistem akan menerbitkan <strong>ID Card Digital ber-QR Code</strong> dan mengirim notifikasi WhatsApp otomatis.
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5 text-emerald-200" />
            <span>Kirim Pendaftaran Resmi</span>
          </button>
        </div>
      </form>
    </div>
  );
};
