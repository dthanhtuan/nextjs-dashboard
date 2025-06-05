import NextAuth from "next-auth"
import {JWT} from "next-auth/jwt"
import type {Session} from "next-auth";
import Credentials from "next-auth/providers/credentials"
import {saltAndHashPassword} from "@/utils/password"
import {getUserFromDb} from "@/utils/db";
import {signInSchema} from "@/app/lib/zod";
import {ZodError} from "zod";
import {User} from "@/types/user";

export const {handlers, signIn, signOut, auth} = NextAuth({
    // https://authjs.dev/reference/core#authconfig
    providers: [
        Credentials({
                // You can specify which fields should be submitted, by adding keys to the `credentials` object.
                // e.g. domain, username, password, 2FA token, etc.
                credentials: {
                    email: {label: "Email", type: "text"},
                    password: {label: "Password", type: "password"},
                },
                async authorize(credentials, request): Promise<User | null> {
                    try {
                        let user = null

                        const {email, password} = await signInSchema.parseAsync(credentials)

                        // logic to salt and hash password
                        const pwHash = saltAndHashPassword(password)

                        // logic to verify if the user exists
                        user = await getUserFromDb(email, pwHash)

                        if (!user) {
                            // No user found, so this is their first attempt to login
                            // Optionally, this is also the place you could do a user registration
                            throw new Error("Invalid credentials.")
                        }

                        // return user object with their profile data
                        return user
                    } catch (error) {
                        if (error instanceof ZodError) {
                            // Handle validation errors
                            throw new Error(error.errors.map(e => e.message).join(", "))
                        } else if (error instanceof Error) {
                            // Handle other errors
                            throw new Error(error.message)
                        } else {
                            // Handle unexpected errors
                            throw new Error("An unexpected error occurred.")
                        }
                    }
                }
            }
        ),
    ],
    session: {
        // https://authjs.dev/reference/core#session-2
        strategy: "jwt",
    },
    callbacks: {
        // Called after sign in - store user data in JWT token
        // https://authjs.dev/reference/core#callbacks
        jwt: async ({token, user}) => {
            if (user) {
                token.user = user; // store user info in token
            }
            return token;
        },
        // Called whenever session is checked - add user info from token to session
        session: async ({session, token,}: { session: Session; token: JWT & { user?: User }; }) => {
            console.log("Session callback called", {session, token});
            if (token.user) {
                session.user = token.user;
            }
            return session;
        },
    },
})
