
import React, { useState, useEffect } from 'react';
import { ConfigState, CycleState } from './types';
import { generateFixedScript, generateInitScript, calculateCycleState, generateCryptoScript, generateSchumannScript, generateMiniAppButtonScript } from './utils/cycleLogic';
import { CodeGenerator } from './components/CodeGenerator';
import { MiniAppPreview } from './components/MiniAppPreview';

export default function App() {
  const [config, setConfig] = useState<ConfigState>({
    baseDate: "1989-12-25", 
    telegramToken: "", 
    chatId: "-1002139694413", 
    messageId: 0, 
    cryptoMessageId: 0, 
    schumannMessageId: 0,
    miniAppUrl: "https://litosinkseeds.github.io/MiniAppDeLitosInkSeeds/" 
  });

  const [activeTab, setActiveTab] = useState<'SETUP' | 'DAILY' | 'CRYPTO' | 'SCHUMANN' | 'MINIAPP'>('SETUP'); 
  const [cycleState, setCycleState] = useState<CycleState | null>(null);

  useEffect(() => {
    const state = calculateCycleState(config.baseDate);
    setCycleState(state);
  }, [config.baseDate]);

  const handleConfigChange = (key: keyof ConfigState, value: string) => {
    let finalValue: any = value;
    if (value.includes('t.me/c/')) {
        const parts = value.split('/');
        if (key === 'chatId') {
            const rawId = parts[parts.indexOf('c') + 1];
            finalValue = rawId.startsWith('-100') ? rawId : `-100${rawId}`;
        } else {
            const lastPart = parts[parts.length - 1];
            finalValue = parseInt(lastPart.match(/\d+/)?.[0] || "0", 10);
        }
    } else if (key !== 'chatId' && key !== 'telegramToken' && key !== 'baseDate' && key !== 'miniAppUrl') {
        finalValue = parseInt(value, 10) || 0;
    }
    setConfig(prev => ({ ...prev, [key]: finalValue }));
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center bg-slate-950 text-slate-200">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">COSMIC BOT ENGINE</h1>
      </header>

      <div className="w-full max-w-2xl flex gap-1 bg-slate-900 p-1 rounded-xl mb-6 border border-white/5">
        {['SETUP', 'DAILY', 'MINIAPP'].map((t: any) => (
          <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${activeTab === t ? 'bg-white text-black shadow-lg' : 'text-slate-500'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="w-full max-w-2xl space-y-6">
        {activeTab === 'SETUP' && (
          <div className="bg-slate-900 p-6 rounded-2xl border border-white/5">
            <h2 className="text-sm font-black mb-4 uppercase tracking-widest text-blue-400">Configuración Global</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Chat ID (-100...)" value={config.chatId} onChange={e => handleConfigChange('chatId', e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-blue-500" />
              <input type="text" placeholder="URL MiniApp" value={config.miniAppUrl} onChange={e => handleConfigChange('miniAppUrl', e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs outline-none" />
              <CodeGenerator script={generateInitScript(config)} />
            </div>
          </div>
        )}

        {activeTab === 'DAILY' && (
          <div className="space-y-4">
            <input type="number" placeholder="ID Mensaje Calendario" value={config.messageId} onChange={e => handleConfigChange('messageId', e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs" />
            <CodeGenerator script={generateFixedScript(config)} />
          </div>
        )}

        {activeTab === 'MINIAPP' && cycleState && (
          <div className="flex flex-col items-center gap-8">
            <MiniAppPreview state={cycleState} />
            <CodeGenerator script={generateMiniAppButtonScript()} />
          </div>
        )}
      </div>
    </div>
  );
}
