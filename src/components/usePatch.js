import {useState} from "react";

export const usePatch = (url) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const executePatch = async (patchData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patchData),
            });

            if (!response.ok) throw new Error('Có lỗi xảy ra!');
            return await response.json();
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { executePatch, loading, error };
};