import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Link2, Code2, Globe, Edit2, Check, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../common/Modal';
import Button from '../common/Button';

export default function CandidateCard({ candidate, onUpdate }) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const displayName = candidate?.fullName || user?.name || 'Unknown Candidate';
  const nameDetected = !!(candidate?.fullName);

  const [form, setForm] = useState({
    fullName: candidate?.fullName || user?.name || '',
    professionalTitle: candidate?.professionalTitle || '',
    email: candidate?.email || '',
    phone: candidate?.phone || '',
    location: candidate?.location || '',
    linkedIn: candidate?.linkedIn || '',
    gitHub: candidate?.gitHub || '',
    portfolio: candidate?.portfolio || '',
    summary: candidate?.summary || '',
  });

  if (!candidate) return null;

  const fields = [
    { icon: Mail, value: candidate.email, label: 'Email' },
    { icon: Phone, value: candidate.phone, label: 'Phone' },
    { icon: MapPin, value: candidate.location, label: 'Location' },
    { icon: Link2, value: candidate.linkedIn, label: 'LinkedIn' },
    { icon: Code2, value: candidate.gitHub, label: 'GitHub' },
    { icon: Globe, value: candidate.portfolio, label: 'Portfolio' },
  ].filter((f) => f.value);

  const handleOpenEdit = () => {
    setForm({
      fullName: candidate.fullName || user?.name || '',
      professionalTitle: candidate.professionalTitle || '',
      email: candidate.email || '',
      phone: candidate.phone || '',
      location: candidate.location || '',
      linkedIn: candidate.linkedIn || '',
      gitHub: candidate.gitHub || '',
      portfolio: candidate.portfolio || '',
      summary: candidate.summary || '',
    });
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (onUpdate) {
        await onUpdate(form);
      }
      setIsEditing(false);
    } catch (err) {
      alert('Failed to update candidate details');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm relative group"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <User className="text-blue-600" size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-xl font-bold text-slate-800 truncate">{displayName}</h3>
                {!nameDetected && user?.name && (
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium border border-blue-200">
                    Account Profile
                  </span>
                )}
                {!nameDetected && !user?.name && (
                  <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium border border-amber-200">
                    ⚠ Name not detected
                  </span>
                )}
                {!nameDetected && (
                  <span className="text-xs text-slate-400">
                    — Click <strong>Edit Details</strong> to set your name
                  </span>
                )}
              </div>
              {candidate.professionalTitle && (
                <p className="text-sm text-blue-600 font-medium mt-0.5">{candidate.professionalTitle}</p>
              )}
              {candidate.summary && (
                <p className="text-sm text-slate-500 mt-2 line-clamp-2">{candidate.summary}</p>
              )}
            </div>
          </div>

          {onUpdate && (
            <button
              onClick={handleOpenEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg transition-colors shrink-0"
              title="Edit Candidate Details"
            >
              <Edit2 size={13} />
              <span>Edit Details</span>
            </button>
          )}
        </div>

        {fields.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {fields.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-slate-600">
                <Icon size={14} className="text-slate-400 shrink-0" />
                <span className="truncate">{value}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Edit Candidate Modal */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Candidate Details">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Raveendran Jathugulan"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Professional Title</label>
            <input
              type="text"
              value={form.professionalTitle}
              onChange={(e) => setForm({ ...form, professionalTitle: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Full Stack Developer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="City, Country"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">LinkedIn</label>
              <input
                type="text"
                value={form.linkedIn}
                onChange={(e) => setForm({ ...form, linkedIn: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">GitHub</label>
              <input
                type="text"
                value={form.gitHub}
                onChange={(e) => setForm({ ...form, gitHub: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Portfolio</label>
              <input
                type="text"
                value={form.portfolio}
                onChange={(e) => setForm({ ...form, portfolio: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Summary</label>
            <textarea
              rows={3}
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief candidate summary..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setIsEditing(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
