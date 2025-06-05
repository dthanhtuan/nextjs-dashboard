"use client";
import {useSession} from "next-auth/react";

export default function Page() {
    const { data: session } = useSession()

    return (
        <div>
            <p>Dashboard Page</p>
            {session ? (
                <div>
                    <p>Email: {session.user?.email}</p>
                </div>
            ) : (
                <p>You are not signed in.</p>
            )}
        </div>
    )
}
