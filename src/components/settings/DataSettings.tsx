import { useRef, useState } from 'react';
import { Download, Upload, Trash2 } from 'lucide-react';
import { exportAllData, importData, resetAllData } from '../../utils/dataExport';
import { ConfirmDialog } from '../ui/ConfirmDialog';

export function DataSettings({ accentColor }: { accentColor: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (importData(text)) {
        setImportSuccess(true);
        setImportError('');
        setTimeout(() => { setImportSuccess(false); window.location.reload(); }, 1500);
      } else {
        setImportError('Invalid data file. Please try again.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Data Management</h3>

      <div className="bg-white/5 rounded-2xl p-4 space-y-3">
        <button
          onClick={exportAllData}
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors text-sm font-medium"
        >
          <Download size={16} style={{ color: accentColor }} />
          Export data as JSON
        </button>

        <button
          onClick={() => fileRef.current?.click()}
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors text-sm font-medium"
        >
          <Upload size={16} style={{ color: accentColor }} />
          Import data from JSON
        </button>

        {importError && <p className="text-xs text-red-400 px-3">{importError}</p>}
        {importSuccess && <p className="text-xs text-green-400 px-3">Data imported! Reloading...</p>}

        <button
          onClick={() => setResetOpen(true)}
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors text-sm font-medium"
        >
          <Trash2 size={16} />
          Reset all data
        </button>
      </div>

      <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={() => { resetAllData(); window.location.reload(); }}
        title="Reset All Data"
        message="This will permanently delete all tasks, sessions, and settings. This cannot be undone."
        confirmLabel="Reset Everything"
        danger
      />
    </div>
  );
}
