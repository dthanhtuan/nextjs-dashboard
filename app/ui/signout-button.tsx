"use client";

import {signOut, useSession} from "next-auth/react";
import React from "react";

export function SignOutButton() {
    const { data: session } = useSession()

    if (!session) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await signOut({redirectTo: "/dashboard"});
    };

    return (
        <form onSubmit={handleSubmit}>
            <button type="submit">Sign Out</button>
        </form>
    );
}
