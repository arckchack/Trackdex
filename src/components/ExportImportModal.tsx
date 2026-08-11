import React, { useState, useRef } from 'react';
import { X, Copy, Check, Upload, Download, FileText, Code2, Trash2, AlertTriangle, Sparkles, FolderUp } from 'lucide-react';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  caughtIds: number[];
  shinyCaughtIds: number[];
  onImport: (normalIds: number[], shinyIds: number[]) => void;
  onClearAll: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  caughtIds,
  shinyCaughtIds,
  onImport,
  onClearAll,
}) => {
  const [activeTab, setActiveTab] = useState<'code' | 'file'>('code');
  const [copiedCode, setCopiedCode] = useState(false);
  const [importCode, setImportCode] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const exportPayload = {
    app: 'TrackDex',
    version: '2.0',
    timestamp: new Date().toISOString(),
    totalNormalCaught: caughtIds.length,
    totalShinyCaught: shinyCaughtIds.length,
    caughtIds: caughtIds,
    shinyCaughtIds: shinyCaughtIds,
  };

  const exportJsonString = JSON.stringify(exportPayload, null, 2);

  // --- METHOD 1: CODE HANDLERS ---
  const handleCopyCode = () => {
    navigator.clipboard.writeText(JSON.stringify(exportPayload));
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleApplyCodeImport = () => {
    setImportError('');
    setImportSuccess('');
    try {
      if (!importCode.trim()) {
        setImportError('Por favor pega el código de respaldo.');
        return;
      }
      const parsed = JSON.parse(importCode);
      let normal: number[] = [];
      let shiny: number[] = [];

      if (Array.isArray(parsed.caughtIds)) {
        normal = parsed.caughtIds;
      } else if (Array.isArray(parsed)) {
        normal = parsed;
      }

      if (Array.isArray(parsed.shinyCaughtIds)) {
        shiny = parsed.shinyCaughtIds;
      }

      onImport(normal, shiny);
      setImportSuccess(`¡Éxito! Se restauraron ${normal.length} Pokémon Normales y ${shiny.length} Variocolor.`);
      setImportCode('');
    } catch {
      setImportError('Código no válido. Asegúrate de pegar el texto completo.');
    }
  };

  // --- METHOD 2: TEXT FILE HANDLERS ---
  const handleDownloadFile = () => {
    const blob = new Blob([exportJsonString], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `trackdex_respaldo_${dateStr}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError('');
    setImportSuccess('');
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        let normal: number[] = [];
        let shiny: number[] = [];

        if (Array.isArray(parsed.caughtIds)) {
          normal = parsed.caughtIds;
        } else if (Array.isArray(parsed)) {
          normal = parsed;
        }

        if (Array.isArray(parsed.shinyCaughtIds)) {
          shiny = parsed.shinyCaughtIds;
        }

        onImport(normal, shiny);
        setImportSuccess(`¡Documento cargado con éxito! (${normal.length} Normales, ${shiny.length} Variocolor)`);
      } catch {
        setImportError('Error al leer el archivo. Debe ser un documento de texto (.txt o .json) válido generado por TrackDex.');
      }
    };
    reader.readAsText(file);
    // Reset file input value
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#141414] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl text-neutral-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-[#1a1a1a]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-[#ff3e3e] to-rose-600 text-white shadow-md">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                SISTEMA DE RESPALDO Y GUARDADO
              </h3>
              <p className="text-xs text-neutral-400">
                Guarda o restaura tu avance con 2 métodos sencillos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white bg-neutral-800/80 hover:bg-neutral-700 transition-all border border-neutral-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Summary Banner */}
        <div className="px-5 py-3 bg-[#0d0d0d] border-b border-neutral-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-[#ff3e3e]" />
              <span>Normales: <strong className="text-white">{caughtIds.length}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Variocolor: <strong className="text-amber-200">{shinyCaughtIds.length}</strong></span>
            </div>
          </div>
          <span className="text-[11px] text-neutral-500 font-mono">v2.0 Gen 1-9</span>
        </div>

        {/* Tab Selection */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-2 bg-[#0a0a0a] p-1.5 rounded-xl border border-neutral-800">
            <button
              onClick={() => {
                setActiveTab('code');
                setImportError('');
                setImportSuccess('');
              }}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'code'
                  ? 'bg-neutral-800 text-white shadow-md border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Code2 className="w-4 h-4 text-[#ff3e3e]" />
              <span>1. Método por Código</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('file');
                setImportError('');
                setImportSuccess('');
              }}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'file'
                  ? 'bg-neutral-800 text-white shadow-md border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>2. Documento de Texto (.txt)</span>
            </button>
          </div>

          {/* Feedback messages */}
          {importError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{importError}</span>
            </div>
          )}

          {importSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{importSuccess}</span>
            </div>
          )}

          {/* TAB 1: POR CÓDIGO */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              {/* Copy Code Box */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
                  Exportar Código de Respaldo:
                </label>
                <div className="relative">
                  <textarea
                    readOnly
                    rows={3}
                    value={JSON.stringify(exportPayload)}
                    className="w-full p-3 bg-[#0a0a0a] border border-neutral-800 rounded-xl text-[11px] font-mono text-emerald-400 focus:outline-none resize-none pr-24"
                  />
                  <button
                    onClick={handleCopyCode}
                    className="absolute top-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-[#ff3e3e] hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? '¡Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Copia este código para guardarlo en tus notas o pegar en otro navegador.
                </p>
              </div>

              <div className="border-t border-neutral-800/80 pt-3 space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
                  Restaurar por Código:
                </label>
                <textarea
                  rows={3}
                  value={importCode}
                  onChange={(e) => setImportCode(e.target.value)}
                  placeholder="Pega tu código de respaldo JSON aquí..."
                  className="w-full p-3 bg-[#0a0a0a] border border-neutral-800 rounded-xl text-[11px] font-mono text-neutral-200 focus:outline-none focus:border-[#ff3e3e] resize-none"
                />
                <button
                  onClick={handleApplyCodeImport}
                  className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs border border-neutral-700 transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Upload className="w-4 h-4 text-[#ff3e3e]" />
                  <span>Cargar y Aplicar Código</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: POR DOCUMENTO DE TEXTO */}
          {activeTab === 'file' && (
            <div className="space-y-4">
              {/* Download File */}
              <div className="p-4 rounded-xl bg-[#0a0a0a] border border-neutral-800 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Guardar como Archivo de Texto (.txt)
                    </h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Descarga tu archivo de respaldo comprimido con todo tu progreso para guardarlo en tu computadora.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDownloadFile}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Documento trackdex_respaldo.txt</span>
                </button>
              </div>

              {/* Upload File */}
              <div className="p-4 rounded-xl bg-[#0a0a0a] border border-neutral-800 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <FolderUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Cargar Archivo de Texto (.txt / .json)
                    </h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Selecciona o arrastra el documento de texto guardado previamente.
                    </p>
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".txt,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs border border-dashed border-neutral-600 hover:border-neutral-400 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Upload className="w-4 h-4 text-blue-400" />
                  <span>Seleccionar Documento de Texto (.txt / .json)</span>
                </button>
              </div>
            </div>
          )}

          {/* Reset All Data Section */}
          <div className="pt-2 border-t border-neutral-800/80">
            {!showConfirmClear ? (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="text-xs text-red-400 hover:text-red-300 font-medium flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Borrar todo el progreso y reiniciar de cero</span>
              </button>
            ) : (
              <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-red-300 font-bold">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>¿Estás seguro de borrar todos los datos guardados?</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onClearAll();
                      setShowConfirmClear(false);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition-all"
                  >
                    Sí, reiniciar
                  </button>
                  <button
                    onClick={() => setShowConfirmClear(false)}
                    className="px-3 py-1.5 bg-neutral-800 text-neutral-300 hover:text-white text-xs rounded-lg transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
