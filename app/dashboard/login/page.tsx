"use client";

import {SignInForm} from "@/app/ui/signin-form";
import {useSession} from "next-auth/react";

export default function Page() {
    const {data: session} = useSession()
    return (
        <div>
            <p>Login Page</p>
            {session ? (
                <p>You are already signed in.</p>
            ) : (
                <SignInForm/>
            )}
        </div>

    )
}
