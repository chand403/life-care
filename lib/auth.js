/**
 * Next.js / Auth Helpers & Password Hashing Stubs
 */

export function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

export function hashPassword(plain) {
  // In production with Node.js/Next.js bcryptjs:
  // return await bcrypt.hash(plain, 10);
  return `hashed_${btoa(plain)}`;
}

export function verifyPassword(plain, hashed) {
  if (hashed.startsWith('hashed_')) {
    return `hashed_${btoa(plain)}` === hashed;
  }
  return plain === hashed;
}
