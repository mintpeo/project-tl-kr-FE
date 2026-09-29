import {useState} from "react";

export const usePutUploadFile = (url) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const executePutUploadFile = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(url, {
                method: 'PUT',
                credentials: 'include',
                body: formData,
            });

            if (!response.ok) {
                const errorMsg = await response.text();
                throw new Error(errorMsg || 'Có lỗi xảy ra khi upload file!');
            }

            return await response.text();
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { executePutUploadFile, loading, error };
};