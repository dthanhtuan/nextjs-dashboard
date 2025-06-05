import bcrypt from "bcryptjs";

// Hashes the plaintext password with a salt
export const saltAndHashPassword = (password: string): string => {
    const saltRounds = 10; // Adjust as needed for security/performance tradeoff
    const salt = bcrypt.genSaltSync(saltRounds)
    return bcrypt.hashSync(password, salt)
}
// To compare during login, use bcrypt.compareSync(plainPassword, hash)
