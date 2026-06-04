import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { isAuthenticated, login } from "../auth/auth";

export default function ProtectedRoute() {
    const [checked, setChecked] = useState(false);
    const [authed, setAuthed] = useState(false);

    useEffect(() => {
        isAuthenticated().then(auth => {
            if (!auth) {
                login();
            } else {
                setAuthed(true);
            }
            setChecked(true);
        });
    }, []);

    if (!checked) return <div>Ładowanie...</div>;
    if (!authed) return null;
    return <Outlet />;
}