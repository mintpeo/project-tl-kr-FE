import React, { useEffect, useState } from 'react';
import { API_URL, LOCAL_STORAGE_KEYS } from "./API_URL.jsx";
import Skeleton from "./loading/Skeleton.jsx";
import {usePost} from "./use/usePost.js";
import {Outlet} from "react-router-dom";

const AuthWrapper = () => {
    const [loading, setLoading] = useState(true);
    const { executePost: getInfoUser } = usePost(`${API_URL}/user/me`);

    useEffect(() => {
        const initUserData = async () => {
            try {
                const user_info = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_INFO);
                if (user_info) {
                    const user = JSON.parse(user_info);

                    if (user?.email) {
                        const data = await getInfoUser({ email: user.email });
                        if (data) {
                            localStorage.setItem(LOCAL_STORAGE_KEYS.USER_INFO, JSON.stringify(data));
                        }
                    }
                }
            } catch (e) {
                console.error("Lỗi khi đồng bộ dữ liệu người dùng:", e);
            } finally {
                setLoading(false);
            }
        };

        initUserData();
    }, []);

    if (loading) return <Skeleton />;
    return <Outlet />;
};

export default AuthWrapper;