export function validateEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

export function validatePassword(password) {
  const errors = [];
  if (password.length < 8) errors.push('At least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('One number');
  return errors;
}

export function validateFile(file) {
  if (!file) return 'No file selected';
  const allowed = ['.pdf', '.docx'];
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  if (!allowed.includes(ext)) return 'Only PDF and DOCX files are supported';
  if (file.size > 10 * 1024 * 1024) return 'File size must be under 10 MB';
  return null;
}
