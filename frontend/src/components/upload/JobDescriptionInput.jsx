import { useState } from 'react';
import { X, Type } from 'lucide-react';

export default function JobDescriptionInput({ jobDescription, setJobDescription }) {
  const [focused, setFocused] = useState(false);
  const charCount = jobDescription?.length || 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Type size={16} />
          Job Description
          <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        {charCount > 0 && (
          <span className="text-xs text-slate-400">{charCount.toLocaleString()} chars</span>
        )}
      </div>
      <div
        className={`relative border rounded-xl overflow-hidden transition-all ${
          focused ? 'border-blue-400 ring-2 ring-blue-100' : 'border-slate-300'
        }`}
      >
        <textarea
          value={jobDescription || ''}
          onChange={(e) => setJobDescription(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Paste the job description here to get matched skills analysis..."
          rows={6}
          className="w-full px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none resize-none"
        />
        {jobDescription && (
          <button
            onClick={() => setJobDescription('')}
            className="absolute top-3 right-3 p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <p className="text-xs text-slate-400">
        Adding a job description enables skill matching, keyword analysis, and targeted ATS scoring.
      </p>
    </div>
  );
}
