import {useState} from "react";

export const usePatch = (url) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const executePatch = async (patchData) => {
        setLoading(true);
        setError(null);
        try {
            return await fetch(url, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(patchData),
            });
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { executePatch, loading, error };
};