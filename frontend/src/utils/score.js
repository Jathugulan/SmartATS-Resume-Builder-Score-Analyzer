export function formatScore(score) {
  if (score === null || score === undefined) return 'N/A';
  return Math.round(score);
}

export function getScoreLabel(score) {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Needs Improvement';
  return 'Poor';
}

export function getScoreColor(score) {
  if (score >= 85) return '#059669';
  if (score >= 70) return '#2563EB';
  if (score >= 50) return '#D97706';
  return '#DC2626';
}

export function getScoreBgColor(score) {
  if (score >= 85) return 'tone-success';
  if (score >= 70) return 'tone-info';
  if (score >= 50) return 'tone-warning';
  return 'tone-danger';
}

export function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function getSeverityColor(severity) {
  if (severity === 'high') return 'tone-danger';
  if (severity === 'medium') return 'tone-warning';
  return 'tone-slate';
}

export function getPriorityColor(priority) {
  if (priority === 'high') return 'tone-danger';
  if (priority === 'medium') return 'tone-warning';
  return 'tone-info';
}
