/**
 * In-memory token blacklist for JWT revocation.
 *
 * NOTE: This is a simple in-memory implementation suitable for development
 * or single-server deployments. For production with multiple servers,
 * use Redis or another distributed cache.
 */

// Store revoked tokens with their expiration time
const blacklist = new Map<string, number>();

/**
 * Add a token to the blacklist
 * @param token - JWT token to blacklist
 * @param expiresAt - Unix timestamp when token expires (in seconds)
 */
export const addToBlacklist = (token: string, expiresAt: number): void => {
  blacklist.set(token, expiresAt);

  // Clean up expired tokens periodically
  cleanupExpiredTokens();
};

/**
 * Check if a token is blacklisted
 * @param token - JWT token to check
 * @returns true if token is blacklisted, false otherwise
 */
export const isBlacklisted = (token: string): boolean => {
  return blacklist.has(token);
};

/**
 * Remove expired tokens from the blacklist
 * This is called automatically when adding tokens, but can also be called manually
 */
export const cleanupExpiredTokens = (): void => {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds

  for (const [token, expiresAt] of blacklist.entries()) {
    if (expiresAt < now) {
      blacklist.delete(token);
    }
  }
};

// Run cleanup every hour
setInterval(cleanupExpiredTokens, 60 * 60 * 1000);
