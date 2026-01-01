
import React, { useState, useEffect } from 'react';
import { ConfigState, CycleState } from './types';
import { generateFixedScript, generateInitScript, calculateCycleState, generateCryptoScript, generateSchumannScript, generateMiniAppButtonScript } from './utils/cycleLogic';
import { CodeGenerator } from './components/CodeGenerator';
import { Visualizer } from './components/Visualizer';
import { MiniAppPreview } from './components/MiniAppPreview';

type Tab = 'SETUP' | 'DAILY' | 'CRYPTO' | 'SCHUMANN' | 'MINIAPP';

export default function App() {
  const [config, setConfig] = useState<ConfigState>({
    baseDate: "1989-12-25", 
    telegramToken: "TU_BOT_TOKEN_AQUÍ", 
    chatId: "-1002139694413", 
    messageId: 0, 
    cryptoMessageId: 0, 
    schumannMessageId: 0,
    miniAppUrl: "https://litosinkseeds.github.io/MiniAppDeLitosInkSeeds/" 
  });

  const [activeTab, setActiveTab] = useState<Tab>('SETUP'); 
  const [cycleState, setCycleState] = useState<CycleState | null>(null);

  useEffect(() => {
    const state = calculateCycleState(config.baseDate);
    setCycleState(state);
  }, [config.baseDate]);

  const handleConfigChange = (key: keyof ConfigState, value: string) => {
    let finalValue: string | number = value;

    if (value.includes('t.me/c/') || value.includes('telegram.me/c/')) {
        const parts = value.split('/');
        if (key === 'chatId') {
            const rawId = parts[parts.indexOf('c') + 1];
            finalValue = rawId.startsWith('-100') ? rawId : `-100${rawId}`;
        } else {
            const lastPart = parts[parts.length - 1];
            const idMatch = lastPart.match(/\d+/);
            if (idMatch) finalValue = parseInt(idMatch[0], 10);
        }
    } else if (key !== 'chatId' && key !== 'telegramToken' && key !== 'baseDate' && key !== 'miniAppUrl') {
        const numeric = parseInt(value, 10);
        if (!isNaN(numeric)) finalValue = numeric;
    }

    setConfig(prev => ({ ...prev, [key]: finalValue }));
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center bg-slate-950 text-slate-200">
      <header className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          Cosmic Manager
        </h1>
        <p className="text-slate-500 text-sm font-medium tracking-tight">
          Sincronización de Ciclos y Automatización GitHub
        </p>
      </header>

      <main className="w-full max-w-3xl space-y-6">
        
        {/* NAVEGACIÓN DE TABS */}
        <div className="flex flex-wrap gap-1 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 sticky top-4 z-50 shadow-2xl">
            {[
              { id: 'SETUP', icon: '🚀', label: 'Config' },
              { id: 'DAILY', icon: '🔄', label: 'Daily' },
              { id: 'CRYPTO', icon: '💎', label: 'Crypto' },
              { id: 'SCHUMANN', icon: '⚡', label: 'Schumann' },
              { id: 'MINIAPP', icon: '📱', label: 'Preview' }
            ].map((t) => (
                <button 
                    key={t.id} 
                    onClick={() => setActiveTab(t.id as Tab)} 
                    className={`flex-1 px-2 py-3 text-[10px] font-black transition-all rounded-xl uppercase tracking-widest flex flex-col sm:flex-row items-center justify-center gap-2 ${activeTab === t.id ? 'bg-white text-black shadow-lg scale-105' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <span className="text-lg">{t.icon}</span>
                    <span className="hidden xs:inline">{t.label}</span>
                </button>
            ))}
        </div>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'SETUP' && (
                <div className="space-y-6">
                    <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 bg-indigo-600/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest border-b border-l border-indigo-500/20 rounded-bl-xl">
                            Configuración Base
                        </div>
                        <h2 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
                            Conexión con Telegram
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">ID del Canal (Chat ID)</label>
                                <input 
                                    type="text" 
                                    value={config.chatId} 
                                    placeholder="Ej: -100..."
                                    onChange={(e) => handleConfigChange('chatId', e.target.value)} 
                                    className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-slate-200 font-mono text-sm focus:border-indigo-500 outline-none transition-all" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Bot Token (GitHub Secret)</label>
                                <input 
                                    type="password" 
                                    value={config.telegramToken} 
                                    placeholder="8568856499:AA..."
                                    onChange={(e) => handleConfigChange('telegramToken', e.target.value)} 
                                    className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-slate-200 font-mono text-sm focus:border-indigo-500 outline-none transition-all" 
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2 bg-indigo-500/5 p-4 rounded-2xl border border-indigo-500/10">
                                <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest">URL de la MiniApp (GitHub Pages)</label>
                                <input 
                                    type="text" 
                                    value={config.miniAppUrl} 
                                    placeholder="https://tu-usuario.github.io/tu-repo/"
                                    onChange={(e) => handleConfigChange('miniAppUrl', e.target.value)} 
                                    className="w-full bg-black border border-indigo-900/50 rounded-xl px-4 py-3 text-indigo-200 font-mono text-xs focus:border-indigo-500 outline-none" 
                                />
                                <p className="text-[10px] text-slate-500 italic mt-2">
                                    💡 Pega aquí la URL de 'Settings > Pages' de GitHub.
                                </p>
                            </div>
                        </div>
                    </div>
                    <CodeGenerator script={generateInitScript(config)} />
                </div>
            )}

            {activeTab === 'DAILY' && (
                <div className="space-y-4">
                    <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">ID Mensaje Calendario</label>
                        <input 
                            type="text" 
                            value={config.messageId}
                            placeholder="Pega el enlace del mensaje aquí"
                            onChange={(e) => handleConfigChange('messageId', e.target.value)}
                            className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-slate-200 font-mono text-sm focus:border-indigo-500 outline-none"
                        />
                    </div>
                    <CodeGenerator script={generateFixedScript(config)} />
                </div>
            )}

            {activeTab === 'CRYPTO' && (
                <div className="space-y-4">
                    <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">ID Mensaje Crypto</label>
                        <input 
                            type="text" 
                            value={config.cryptoMessageId}
                            placeholder="Pega el enlace del mensaje aquí"
                            onChange={(e) => handleConfigChange('cryptoMessageId', e.target.value)}
                            className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-slate-200 font-mono text-sm focus:border-indigo-500 outline-none"
                        />
                    </div>
                    <CodeGenerator script={generateCryptoScript(config)} />
                </div>
            )}

            {activeTab === 'SCHUMANN' && (
                <div className="space-y-4">
                    <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">ID Mensaje Schumann</label>
                        <input 
                            type="text" 
                            value={config.schumannMessageId}
                            placeholder="Pega el enlace del mensaje aquí"
                            onChange={(e) => handleConfigChange('schumannMessageId', e.target.value)}
                            className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-slate-200 font-mono text-sm focus:border-indigo-500 outline-none"
                        />
                    </div>
                    <CodeGenerator script={generateSchumannScript(config)} />
                </div>
            )}

            {activeTab === 'MINIAPP' && cycleState && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="sticky top-24">
                        <MiniAppPreview state={cycleState} />
                    </div>
                    <div className="space-y-4">
                        <div className="bg-indigo-500/10 border-l-4 border-indigo-500 p-5 rounded-r-xl">
                            <h4 className="text-indigo-200 font-bold text-sm mb-2 uppercase tracking-tight">Modo WebApp</h4>
                            <p className="text-xs text-indigo-100/70 leading-relaxed">
                                Este botón 🥚 abrirá la vista móvil que ves a la izquierda directamente en Telegram.
                            </p>
                        </div>
                        <CodeGenerator script={generateMiniAppButtonScript()} />
                    </div>
                </div>
            )}
        </section>
      </main>

      <footer className="mt-12 pb-8 text-center opacity-20">
          <p className="text-[10px] font-mono tracking-widest">LITOS INK SEEDS • BOT ENGINE v2.5</p>
      </footer>
    </div>
  );
}
