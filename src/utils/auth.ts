export const isVerified = () => {
  return document.cookie.split('; ').some(row => row.startsWith('verified=true'));
};

export const checkVerification = (path: string) => {
  const publicPaths = ['/verify', '/set-verified'];
  
  // Allow access to verification pages without being verified
  if (publicPaths.includes(path)) {
    return true;
  }

  // For all other paths, require verification
  if (!isVerified()) {
    window.location.href = '/verify';
    return false;
  }
  return true;
};

export const clearVerification = () => {
  document.cookie = 'verified=true; max-age=0; path=/; secure; samesite=strict';
};
