import {useState} from "react";

export const useDelete = (url) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const executeDelete = async (deleteData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(deleteData),
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

    return { executeDelete, loading, error };
};