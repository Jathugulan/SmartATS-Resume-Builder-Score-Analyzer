import { useCallback, useState } from 'react';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { validateFile } from '../../utils/validation';
import { formatFileSize } from '../../utils/score';

export default function ResumeUploader({ file, setFile }) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = useCallback(
    (f) => {
      setError(null);
      const err = validateFile(f);
      if (err) {
        setError(err);
        setFile(null);
        return;
      }
      setFile(f);
    },
    [setFile]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleInputChange = (e) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
  };

  if (file) {
    return (
      <div className="border-2 border-emerald-200 bg-emerald-50 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle className="text-emerald-600" size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-800 truncate">{file.name}</p>
            <p className="text-sm text-slate-500">
              {file.type || 'Document'} &middot; {formatFileSize(file.size)}
            </p>
          </div>
          <button
            onClick={removeFile}
            className="p-2 rounded-lg hover:bg-emerald-100 text-slate-400 hover:text-red-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-slate-300 hover:border-blue-300 hover:bg-slate-50'
        }`}
        onClick={() => document.getElementById('resume-input').click()}
      >
        <input
          id="resume-input"
          type="file"
          accept=".pdf,.docx"
          onChange={handleInputChange}
          className="hidden"
        />
        <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
          {dragOver ? (
            <FileText className="text-blue-500" size={28} />
          ) : (
            <Upload className="text-blue-500" size={28} />
          )}
        </div>
        <p className="text-slate-700 font-medium mb-1">
          {dragOver ? 'Drop your resume here' : 'Drag and drop your resume'}
        </p>
        <p className="text-sm text-slate-500 mb-3">
          or click to browse
        </p>
        <p className="text-xs text-slate-400">
          Supports PDF and DOCX &middot; Max 10 MB
        </p>
      </div>
      {error && (
        <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}
    </div>
  );
}
