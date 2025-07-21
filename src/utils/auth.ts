export const isVerified = () => {
  return document.cookie.split('; ').some(row => row.startsWith('verified=true'));
};

export const checkVerification = () => {
  if (!isVerified()) {
    window.location.href = '/verify';
    return false;
  }
  return true;
};
