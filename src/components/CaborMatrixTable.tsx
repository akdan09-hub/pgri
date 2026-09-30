import React from 'react';
import { Participant, KecamatanInfo } from '../types';
import { CABANG_OLAHRAGA } from '../data/initialData';
import { Trophy, Activity, Info } from 'lucide-react';

interface CaborMatrixTableProps {
  participants: Participant[];
  kecamatanList: KecamatanInfo[];
}

export const CaborMatrixTable: React.FC<CaborMatrixTableProps> = ({ participants, kecamatanList }) => {
  // Compute column totals (per cabor)
  const caborTotals = CABANG_OLAHRAGA.map((cabor) => {
    return participants.filter(p => p.caborId === cabor.id).length;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Matriks Distribusi 9 Kecamatan Mempawah vs Cabang Olahraga</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Peta kekuatan kontingen per cabor untuk penetapan bagan pertandingan & jadwal POR PGRI
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
          <Info className="w-3.5 h-3.5 text-emerald-600" />
          <span>Real-time per pembaruan kontingen</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-[11px] font-bold uppercase text-slate-700 border-b border-slate-200">
              <th className="py-3 px-4 text-left min-w-[170px] sticky left-0 bg-slate-100 z-10">
                Kontingen Kecamatan
              </th>
              {CABANG_OLAHRAGA.map((c) => (
                <th key={c.id} className="py-3 px-2 min-w-[95px] max-w-[120px]">
                  <span className="block truncate" title={c.name}>
                    {c.name}
                  </span>
                </th>
              ))}
              <th className="py-3 px-3 bg-emerald-100/70 text-emerald-950 font-black min-w-[90px]">
                Total Kontingen
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {kecamatanList.map((kec) => {
              const kecParticipants = participants.filter(p => p.kecamatanId === kec.id);
              const totalKec = kecParticipants.length;

              return (
                <tr key={kec.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Kecamatan Column */}
                  <td className="py-3 px-4 text-left font-semibold text-slate-800 sticky left-0 bg-white hover:bg-slate-50 border-r border-slate-100 z-10">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: kec.warnaTema }}
                      />
                      <span className="truncate">{kec.name}</span>
                    </div>
                  </td>

                  {/* Sport count columns */}
                  {CABANG_OLAHRAGA.map((cabor) => {
                    const count = kecParticipants.filter(p => p.caborId === cabor.id).length;
                    return (
                      <td key={cabor.id} className="py-3 px-2 font-mono">
                        {count > 0 ? (
                          <span className="inline-block px-2 py-0.5 rounded font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs">
                            {count}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                    );
                  })}

                  {/* Row Total */}
                  <td className="py-3 px-3 font-mono font-bold bg-emerald-50/40 text-emerald-900 border-l border-slate-100">
                    {totalKec}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300 text-xs">
              <td className="py-3 px-4 text-left uppercase tracking-wider sticky left-0 bg-slate-100 z-10">
                Total Per Cabor
              </td>
              {caborTotals.map((tot, idx) => (
                <td key={idx} className="py-3 px-2 font-mono text-emerald-800 font-extrabold">
                  {tot}
                </td>
              ))}
              <td className="py-3 px-3 bg-emerald-600 text-white font-black text-sm font-mono">
                {participants.length}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
