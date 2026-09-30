import * as XLSX from 'xlsx';
import { Participant, KecamatanInfo } from '../types';
import { CABANG_OLAHRAGA } from '../data/initialData';

export function exportParticipantsToExcel(
  participants: Participant[],
  kecamatanList: KecamatanInfo[],
  titleSuffix = 'Kabupaten_Mempawah'
): void {
  // 1. Sheet 1: Master Peserta Lengkap
  const masterData = participants.map((p, index) => {
    const kec = kecamatanList.find(k => k.id === p.kecamatanId);
    const cabor = CABANG_OLAHRAGA.find(c => c.id === p.caborId);
    const kategori = cabor?.kategori.find(k => k.id === p.caborCategoryId);

    return {
      'No': index + 1,
      'No. Registrasi': p.id,
      'Nama Lengkap': p.fullName,
      'NUPTK / NIP': p.nuptk,
      'NIK': p.nik,
      'L/P': p.gender === 'L' ? 'Laki-laki' : 'Perempuan',
      'No. WhatsApp': p.phone,
      'Email': p.email,
      'Kecamatan (Mempawah)': kec?.name || p.kecamatanId,
      'Unit Kerja / Sekolah': p.schoolUnit,
      'Cabang Olahraga': cabor?.name || p.caborId,
      'Kategori Tanding': kategori?.name || p.caborCategoryId,
      'Peran': p.role,
      'Ukuran Jersey': p.jerseySize,
      'Gol. Darah': p.bloodType,
      'Lampiran SK Guru': p.skDocumentName ? 'Ada (Terunggah)' : 'Belum Ada',
      'Lampiran Kartu PGRI': p.ktaDocumentName ? 'Ada (Terunggah)' : 'Belum Ada',
      'Status Verifikasi': p.status,
      'Waktu Registrasi': new Date(p.registeredAt).toLocaleString('id-ID'),
      'Catatan Panitia': p.notes || '-',
      'Diverifikasi Oleh': p.verifiedBy || '-',
    };
  });

  // 2. Sheet 2: Rekapitulasi 9 Kecamatan Mempawah
  const rekapKecamatan = kecamatanList.map((kec, index) => {
    const kecParticipants = participants.filter(p => p.kecamatanId === kec.id);
    const terverifikasi = kecParticipants.filter(p => p.status === 'Terverifikasi').length;
    const pending = kecParticipants.filter(p => p.status === 'Menunggu Verifikasi').length;
    const revisi = kecParticipants.filter(p => p.status === 'Perlu Perbaikan').length;
    const atletCount = kecParticipants.filter(p => p.role === 'Atlet').length;
    const officialCount = kecParticipants.filter(p => p.role === 'Official' || p.role === 'Pelatih').length;
    const persentase = ((kecParticipants.length / kec.kuotaMaksimal) * 100).toFixed(1) + '%';

    return {
      'No': index + 1,
      'Kecamatan': kec.name,
      'Kode Wilayah': kec.code,
      'Label Wilayah': kec.badgeText,
      'Ketua Cabang PGRI': kec.ketuaRanting,
      'Kontak WhatsApp': kec.kontak,
      'Alamat Sekretariat': kec.alamatSekretariat,
      'Kuota Maksimal': kec.kuotaMaksimal,
      'Total Terdaftar': kecParticipants.length,
      'Atlet': atletCount,
      'Official / Pelatih': officialCount,
      'Terverifikasi': terverifikasi,
      'Menunggu Verifikasi': pending,
      'Perlu Perbaikan': revisi,
      'Keterisian Kuota': persentase,
    };
  });

  // 3. Sheet 3: Rekapitulasi Cabang Olahraga
  const rekapCabor = CABANG_OLAHRAGA.map((cabor, index) => {
    const caborParticipants = participants.filter(p => p.caborId === cabor.id);
    const lakiLaki = caborParticipants.filter(p => p.gender === 'L').length;
    const perempuan = caborParticipants.filter(p => p.gender === 'P').length;

    return {
      'No': index + 1,
      'Cabang Olahraga': cabor.name,
      'Lokasi Pertandingan (Venue)': cabor.lokasiTanding,
      'Total Peserta': caborParticipants.length,
      'Peserta Putra': lakiLaki,
      'Peserta Putri': perempuan,
    };
  });

  // Create Workbook
  const workbook = XLSX.utils.book_new();

  // Create Worksheets
  const wsMaster = XLSX.utils.json_to_sheet(masterData);
  const wsKecamatan = XLSX.utils.json_to_sheet(rekapKecamatan);
  const wsCabor = XLSX.utils.json_to_sheet(rekapCabor);

  // Set column widths for readability
  wsMaster['!cols'] = [
    { wch: 5 },
    { wch: 18 },
    { wch: 25 },
    { wch: 20 },
    { wch: 20 },
    { wch: 12 },
    { wch: 16 },
    { wch: 24 },
    { wch: 24 },
    { wch: 28 },
    { wch: 20 },
    { wch: 22 },
    { wch: 12 },
    { wch: 12 },
    { wch: 10 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 20 },
    { wch: 30 },
    { wch: 22 },
  ];

  wsKecamatan['!cols'] = [
    { wch: 5 },
    { wch: 25 },
    { wch: 12 },
    { wch: 22 },
    { wch: 26 },
    { wch: 16 },
    { wch: 35 },
    { wch: 14 },
    { wch: 14 },
    { wch: 10 },
    { wch: 16 },
    { wch: 14 },
    { wch: 18 },
    { wch: 16 },
    { wch: 16 },
  ];

  wsCabor['!cols'] = [
    { wch: 5 },
    { wch: 26 },
    { wch: 35 },
    { wch: 14 },
    { wch: 16 },
    { wch: 16 },
  ];

  // Append sheets
  XLSX.utils.book_append_sheet(workbook, wsMaster, 'Data Peserta & Dokumen');
  XLSX.utils.book_append_sheet(workbook, wsKecamatan, 'Rekap 9 Kec Mempawah');
  XLSX.utils.book_append_sheet(workbook, wsCabor, 'Rekap Cabang Olahraga');

  // Generate filename with date
  const now = new Date();
  const dateStr = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
  const filename = `Laporan_POR_PGRI_Mempawah_${titleSuffix}_${dateStr}.xlsx`;

  // Write and trigger download
  XLSX.writeFile(workbook, filename);
}
