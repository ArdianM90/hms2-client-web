import { useEffect } from "react";
import { handleCallback } from "../auth/callback";

export default function CallbackPage() {
    useEffect(() => {
        handleCallback().then(() => {
            window.location.href = "/dashboard";
        });
    }, []);

    return <div>Logging in...</div>;
}