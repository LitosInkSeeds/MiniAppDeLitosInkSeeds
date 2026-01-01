
import React, { useState } from 'react';

export const CodeGenerator: React.FC<{script: string}> = ({ script }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!script) return null;

  return (
    <div className="bg-black rounded-xl border border-white/5 overflow-hidden">
      <div className="p-3 flex justify-between items-center bg-white/5 border-b border-white/5">
        <span className="text-[10px] font-black uppercase text-slate-500">GitHub Workflow</span>
        <button onClick={handleCopy} className="bg-blue-600 px-3 py-1 rounded text-[9px] font-black uppercase">{copied ? '¡Copiado!' : 'Copiar'}</button>
      </div>
      <pre className="p-4 text-[9px] font-mono text-blue-300 overflow-x-auto whitespace-pre-wrap">{script}</pre>
    </div>
  );
};
