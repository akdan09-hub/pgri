import { Participant, NotificationLog, VerificationStatus, KecamatanInfo } from '../types';
import { INITIAL_PARTICIPANTS, INITIAL_NOTIFICATIONS, MEMPAWAH_KECAMATAN, CABANG_OLAHRAGA } from '../data/initialData';

const PARTICIPANTS_KEY = 'por_pgri_mempawah_participants_v2';
const NOTIFICATIONS_KEY = 'por_pgri_mempawah_notifications_v2';
const KECAMATAN_KEY = 'por_pgri_mempawah_kecamatan_v2';

// BroadcastChannel for real-time multi-tab synchronization
const channel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('por_pgri_mempawah_sync')
  : null;

export const storageService = {
  // --- KECAMATAN MANAGEMENT (CRUD / EDIT) ---
  getKecamatanList(): KecamatanInfo[] {
    try {
      const data = localStorage.getItem(KECAMATAN_KEY);
      if (!data) {
        localStorage.setItem(KECAMATAN_KEY, JSON.stringify(MEMPAWAH_KECAMATAN));
        return MEMPAWAH_KECAMATAN;
      }
      return JSON.parse(data);
    } catch {
      return MEMPAWAH_KECAMATAN;
    }
  },

  saveKecamatanList(list: KecamatanInfo[]): void {
    try {
      localStorage.setItem(KECAMATAN_KEY, JSON.stringify(list));
      if (channel) {
        channel.postMessage({ type: 'KECAMATAN_UPDATED', timestamp: Date.now() });
      }
    } catch (e) {
      console.error('Failed to save kecamatan list', e);
    }
  },

  updateKecamatan(updated: KecamatanInfo): void {
    const list = this.getKecamatanList();
    const index = list.findIndex(k => k.id === updated.id);
    if (index !== -1) {
      list[index] = updated;
    } else {
      list.push(updated);
    }
    this.saveKecamatanList(list);
  },

  // --- PARTICIPANTS MANAGEMENT ---
  getParticipants(): Participant[] {
    try {
      const data = localStorage.getItem(PARTICIPANTS_KEY);
      if (!data) {
        localStorage.setItem(PARTICIPANTS_KEY, JSON.stringify(INITIAL_PARTICIPANTS));
        return INITIAL_PARTICIPANTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PARTICIPANTS;
    }
  },

  saveParticipants(participants: Participant[]): void {
    try {
      localStorage.setItem(PARTICIPANTS_KEY, JSON.stringify(participants));
      if (channel) {
        channel.postMessage({ type: 'PARTICIPANTS_UPDATED', timestamp: Date.now() });
      }
    } catch (e) {
      console.error('Failed to save participants', e);
    }
  },

  // --- NOTIFICATIONS MANAGEMENT ---
  getNotifications(): NotificationLog[] {
    try {
      const data = localStorage.getItem(NOTIFICATIONS_KEY);
      if (!data) {
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
        return INITIAL_NOTIFICATIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },

  saveNotifications(notifications: NotificationLog[]): void {
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
      if (channel) {
        channel.postMessage({ type: 'NOTIFICATIONS_UPDATED', timestamp: Date.now() });
      }
    } catch (e) {
      console.error('Failed to save notifications', e);
    }
  },

  addParticipant(participant: Participant): { participant: Participant; notification: NotificationLog } {
    const list = this.getParticipants();
    const updated = [participant, ...list];
    this.saveParticipants(updated);

    const kecList = this.getKecamatanList();
    const kec = kecList.find(k => k.id === participant.kecamatanId);
    const cabor = CABANG_OLAHRAGA.find(c => c.id === participant.caborId);

    // Create automatic WhatsApp & System Notification
    const notifMessage = `Halo Bapak/Ibu ${participant.fullName}! Pendaftaran Anda untuk POR PGRI Kabupaten Mempawah cabor ${cabor?.name || ''} kontingen ${kec?.name || ''} BERHASIL DITERIMA. No Registrasi: ${participant.id}. Berkas SK & KTA PGRI telah kami terima dalam sistem. Mohon simpan ID Card Digital Anda. Terima kasih! Salam Olahraga PGRI Kab. Mempawah.`;

    const newNotification: NotificationLog = {
      id: `NOTIF-${Date.now()}`,
      timestamp: new Date().toISOString(),
      participantId: participant.id,
      participantName: participant.fullName,
      kecamatanId: participant.kecamatanId,
      channel: 'WhatsApp',
      recipient: participant.phone,
      title: 'Pendaftaran Berhasil Terdaftar',
      message: notifMessage,
      status: 'Terkirim',
    };

    const notifs = [newNotification, ...this.getNotifications()];
    this.saveNotifications(notifs);

    return { participant, notification: newNotification };
  },

  updateParticipant(participant: Participant): Participant {
    const list = this.getParticipants();
    const index = list.findIndex(p => p.id === participant.id);
    if (index !== -1) {
      list[index] = participant;
      this.saveParticipants(list);
    }
    return participant;
  },

  updateParticipantStatus(id: string, newStatus: VerificationStatus, notes?: string): Participant | null {
    const list = this.getParticipants();
    const index = list.findIndex(p => p.id === id);
    if (index === -1) return null;

    const existing = list[index];
    const updated: Participant = {
      ...existing,
      status: newStatus,
      notes: notes !== undefined ? notes : existing.notes,
      verifiedBy: 'Panitia Pelaksana POR PGRI Kab. Mempawah',
      verifiedAt: new Date().toISOString(),
    };

    list[index] = updated;
    this.saveParticipants(list);

    const kecList = this.getKecamatanList();
    const kec = kecList.find(k => k.id === updated.kecamatanId);
    const notifMsg = `Pemberitahuan Status Pendaftaran POR PGRI Mempawah: Berkas Anda (${updated.fullName} - ${kec?.name}) status saat ini: [${newStatus.toUpperCase()}]. ${notes ? `Catatan Panitia: "${notes}".` : 'Kartu peserta Anda telah aktif.'}`;

    const newNotif: NotificationLog = {
      id: `NOTIF-${Date.now()}`,
      timestamp: new Date().toISOString(),
      participantId: updated.id,
      participantName: updated.fullName,
      kecamatanId: updated.kecamatanId,
      channel: 'WhatsApp',
      recipient: updated.phone,
      title: `Status: ${newStatus}`,
      message: notifMsg,
      status: 'Terkirim',
    };

    const notifs = [newNotif, ...this.getNotifications()];
    this.saveNotifications(notifs);

    return updated;
  },

  deleteParticipant(id: string): void {
    const list = this.getParticipants().filter(p => p.id !== id);
    this.saveParticipants(list);
  },

  resetToDefault(): void {
    localStorage.setItem(KECAMATAN_KEY, JSON.stringify(MEMPAWAH_KECAMATAN));
    localStorage.setItem(PARTICIPANTS_KEY, JSON.stringify(INITIAL_PARTICIPANTS));
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
    if (channel) {
      channel.postMessage({ type: 'DATA_RESET', timestamp: Date.now() });
    }
  },

  subscribe(callback: (event: { type: string; timestamp: number }) => void): () => void {
    if (!channel) return () => {};
    const listener = (event: MessageEvent) => {
      callback(event.data);
    };
    channel.addEventListener('message', listener);
    return () => {
      channel.removeEventListener('message', listener);
    };
  },
};
