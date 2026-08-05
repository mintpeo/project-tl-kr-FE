import {useState} from "react";

export const usePost = (url) => {
    // const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const executePost = async (postData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData),
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

    return { executePost, loading, error };
};