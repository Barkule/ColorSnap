import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  textToCopy: string;
  className?: string;
  label?: string;
  showIconOnly?: boolean;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  className = '',
  label = 'Copy',
  showIconOnly = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [manualCopyText, setManualCopyText] = useState<string | null>(null);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for non-secure context or restricted clipboard permission
        setManualCopyText(textToCopy);
      }
    } catch (error) {
      console.warn('Clipboard write failed, showing manual copy dialog:', error);
      setManualCopyText(textToCopy);
    }
  };

  return (
    <>
      <button
        onClick={handleCopy}
        type="button"
        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ${
          copied
            ? 'bg-emerald-500 text-white shadow-emerald-500/25'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white dark:bg-indigo-500 dark:hover:bg-indigo-400'
        } ${className}`}
        title={`Copy ${textToCopy}`}
        aria-label={label}
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 animate-bounce" />
            {!showIconOnly && <span>Copied!</span>}
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            {!showIconOnly && <span>{label}</span>}
          </>
        )}
      </button>

      {manualCopyText && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Manual Copy</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Unable to copy automatically. Please copy the value manually below:
            </p>
            <input
              type="text"
              readOnly
              value={manualCopyText}
              className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-sm select-all"
              autoFocus
              onFocus={(e) => e.target.select()}
            />
            <div className="flex justify-end">
              <button
                onClick={() => setManualCopyText(null)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-500"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
