export type Gender = 'L' | 'P';
export type ParticipantRole = 'Atlet' | 'Official' | 'Pelatih';
export type VerificationStatus = 'Terverifikasi' | 'Menunggu Verifikasi' | 'Perlu Perbaikan';
export type JerseySize = 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL';

export interface KecamatanInfo {
  id: string;
  code: string;
  name: string;
  ketuaRanting: string;
  kontak: string;
  alamatSekretariat: string;
  kuotaMaksimal: number;
  warnaTema: string; // Tailwind color class or hex
  badgeText: string;
}

export interface CaborCategory {
  id: string;
  name: string;
  genderLimit?: 'L' | 'P' | 'Semua';
}

export interface CabangOlahraga {
  id: string;
  name: string;
  iconName: string;
  deskripsi: string;
  kategori: CaborCategory[];
  lokasiTanding: string;
  kuotaPerKecamatan: number;
}

export interface Participant {
  id: string; // e.g. POR-26-CBN-001
  nik: string;
  nuptk: string; // NUPTK or NIP
  fullName: string;
  gender: Gender;
  phone: string; // WhatsApp
  email: string;
  kecamatanId: string;
  schoolUnit: string;
  caborId: string;
  caborCategoryId: string;
  role: ParticipantRole;
  jerseySize: JerseySize;
  bloodType: string;
  status: VerificationStatus;
  photoUrl: string;
  skDocumentUrl?: string; // Upload SK Pengangkatan / Tugas Guru
  skDocumentName?: string;
  ktaDocumentUrl?: string; // Upload KTA PGRI / Kartu PGRI
  ktaDocumentName?: string;
  registeredAt: string;
  notes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface NotificationLog {
  id: string;
  timestamp: string;
  participantId: string;
  participantName: string;
  kecamatanId: string;
  channel: 'WhatsApp' | 'Email' | 'Sistem';
  recipient: string;
  title: string;
  message: string;
  status: 'Terkirim' | 'Gagal' | 'Pending';
}
