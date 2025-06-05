export const getUserFromDb = async (email: string, passwordHash: string) => {
    // Replace this with your actual database logic
    const mockUser = {
        id: "1",
        email: "test@example.com",
    }

    // Simulate a database check
    if (email === mockUser.email) {
        return {id: mockUser.id, email: mockUser.email}
    }

    return null
}

/*
export async function getUserFromDb(email, plainPassword) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  // Compare the provided password with the stored hash
  const passwordMatches = bcrypt.compareSync(plainPassword, user.passwordHash);
  if (!passwordMatches) return null;

  // Return user object (omit sensitive fields as needed)
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    // ...other public profile fields
  };
}
 */
