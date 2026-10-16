export function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

export function hashPassword(plain) {
  return `hashed_${btoa(plain)}`;
}

export function verifyPassword(plain, hashed) {
  if (hashed.startsWith('hashed_')) {
    return `hashed_${btoa(plain)}` === hashed;
  }
  return plain === hashed;
}
