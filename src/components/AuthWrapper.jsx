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
                const changeEmail = localStorage.getItem('changeEmail');
                if (changeEmail !== null) {
                    const data = await getInfoUser({ email: changeEmail });
                    if (data) localStorage.setItem(LOCAL_STORAGE_KEYS.USER_INFO, JSON.stringify(data));
                    return;
                }

                const userInfo = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_INFO);
                if (userInfo) {
                    const user = JSON.parse(userInfo);
                    if (user?.email) {
                        const data = await getInfoUser({ email: user.email });
                        if (data) localStorage.setItem(LOCAL_STORAGE_KEYS.USER_INFO, JSON.stringify(data));
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