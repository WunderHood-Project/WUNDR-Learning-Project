'use client';
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import LoginForm from "./LoginForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default function LoginModal() {
    const [forgot, setForgot] = useState(false);
    const router = useRouter();
    const pathname = usePathname() || "/";

    //If the modal is open on /reset-password/.., redirect back to home.
    useEffect(() => {
        if (pathname.startsWith("/reset-password")) router.replace("/");
    }, [pathname, router]);

    return forgot
    ? <ForgotPasswordForm onBack={()=>setForgot(false)} />
    : <LoginForm onForgot={()=>setForgot(true)} />;
}

