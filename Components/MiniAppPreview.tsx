
import React, { useState, useEffect } from 'react';
import { CycleState } from '../types';
import { Wind, PersonStanding, Dumbbell, Hammer, Brain, Moon, Leaf, ChevronLeft, Sun, Wifi, Battery } from 'lucide-react';
import { BREATH_DB, STRETCH_DB, GYM_DB, QUOTES_SPIRIT_DB } from '../utils/dailyDatabase';

export const MiniAppPreview: React.FC<{state: CycleState}> = ({ state }) => {
  const [view, setView] = useState<'HOME' | 'DETAIL'>('HOME');
  const [time, setTime] = useState(new Date());
  
  const idx = (state.dayOfCycle - 1) % 28;

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-[320px] h-[640px] bg-black rounded-[40px] border-[8px] border-slate-900 shadow-2xl relative overflow-hidden flex flex-col ring-4 ring-slate-900/50">
      
      {/* Barra de estado ficticia */}
      <div className="absolute top-0 w-full px-6 py-2 flex justify-between items-center z-50 bg-black/50 backdrop-blur-sm">
        <span className="text-[10px] font-bold">{time.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
        <div className="flex gap-1 items-center opacity-60">
          <Sun size={10} /> <Wifi size={10} /> <Battery size={10} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-10 px-4 space-y-4 scrollbar-hide">
        {view === 'HOME' ? (
          <>
            <div className="text-center py-6">
               <div className="text-5xl mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">{state.moonEmoji}</div>
               <h1 className="text-xl font-black uppercase tracking-tighter">{state.elementEmoji} {state.elementName}</h1>
               <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em]">{state.chakraName}</p>
            </div>

            <div className="bg-white rounded-2xl p-4 text-black space-y-3 shadow-xl">
               <div className="flex justify-between border-b border-black/5 pb-2">
                 <h2 className="font-black text-xs uppercase">Cuerpo</h2>
                 <Dumbbell size={14}/>
               </div>
               <div className="flex items-center gap-3"><Wind size={16} className="text-blue-500"/><span className="text-[11px] font-bold">{BREATH_DB[idx].name}</span></div>
               <div className="flex items-center gap-3"><PersonStanding size={16} className="text-purple-500"/><span className="text-[11px] font-bold">{STRETCH_DB[idx].name}</span></div>
               <div className="flex items-center gap-3"><Dumbbell size={16} /><span className="text-[11px] font-bold">{GYM_DB[idx].name}</span></div>
            </div>

            <div className="bg-[#cc0000] rounded-2xl p-6 text-center shadow-xl">
               <Hammer size={24} className="mx-auto mb-2 opacity-50"/>
               <h2 className="font-black text-lg">TRABAJO DURO</h2>
            </div>

            <div className="bg-yellow-400 rounded-2xl p-5 text-black shadow-xl">
               <div className="flex justify-between mb-2">
                 <h2 className="font-black text-xs uppercase">Espíritu</h2>
                 <Brain size={16}/>
               </div>
               <p className="text-[11px] italic font-serif font-bold leading-tight">"{QUOTES_SPIRIT_DB[idx][0]}"</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <div className="bg-blue-600 rounded-2xl p-4 flex flex-col justify-between h-24">
                 <Moon size={18}/>
                 <span className="text-[10px] font-black uppercase">Sueño</span>
               </div>
               <div className="bg-green-600 rounded-2xl p-4 flex flex-col justify-between h-24">
                 <Leaf size={18}/>
                 <span className="text-[10px] font-black uppercase">Dieta</span>
               </div>
            </div>
          </>
        ) : (
          <div className="animate-in slide-in-from-right duration-300">
            <button onClick={() => setView('HOME')} className="mb-4 flex items-center gap-2 text-xs font-bold"><ChevronLeft size={16}/> Volver</button>
            {/* Detalles de rutina irían aquí */}
          </div>
        )}
      </div>
    </div>
  );
};
