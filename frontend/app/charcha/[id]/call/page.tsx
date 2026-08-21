'use client';

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const CallRedirectPage = () => {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    useEffect(() => {
        if (id) {
            router.replace(`/charcha/${id}`);
        }
    }, [id, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
            <Loader2 className="animate-spin text-emerald-400" size={32} />
        </div>
    );
};

export default CallRedirectPage;
