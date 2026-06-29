import bcrypt from "bcrypt";
// helper function to hash a password
const SALT_ROUNDS = 10; // controls how expensive the hashing algorithm is.
// Higher value → slower but more secure.

// Hash a plain text password
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

// Compare plain text password with hashed password
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
