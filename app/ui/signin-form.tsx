"use client";

import { signIn } from "next-auth/react";
import React, { useState } from "react";

export function SignInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
            redirectTo: "/dashboard",
        });

        if (result?.error) {
            alert("Login failed: " + result.error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Email
                <input
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </label>
            <label>
                Password
                <input
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </label>
            <button type="submit">Sign In</button>
        </form>
    );
}
