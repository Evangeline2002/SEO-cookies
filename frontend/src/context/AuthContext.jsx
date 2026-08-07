import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

function getStoredUser() {
    try {
        const chUser = localStorage.getItem('ch_user');
        if (chUser) return JSON.parse(chUser);

        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const email = localStorage.getItem('email');
        const isVerified = localStorage.getItem('isVerified') === 'true';
        if (isLoggedIn && email && isVerified) {
            return { email, isVerified, loginMethod: 'email', loggedInAt: Date.now() };
        }
    } catch { }
    return null;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(getStoredUser);

    useEffect(() => {
        if (user) {
            if (user.loginMethod === 'email') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('email', user.email);
                localStorage.setItem('isVerified', 'true');
                localStorage.removeItem('ch_user');
            } else {
                localStorage.setItem('ch_user', JSON.stringify(user));
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('email');
                localStorage.removeItem('isVerified');
            }
        } else {
            localStorage.removeItem('ch_user');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('email');
            localStorage.removeItem('isVerified');
        }
    }, [user]);

    const login = (name, phone) => {
        const userData = { name, phone, loggedInAt: Date.now() };
        setUser(userData);
        return userData;
    };

    const loginWithGoogle = (googleUserData) => {
        const userData = {
            ...googleUserData,
            loggedInAt: Date.now(),
            isGoogleSign: true
        };
        setUser(userData);
        return userData;
    };

    const loginWithEmail = (email) => {
        setUser({ email, isVerified: false, loginMethod: 'email', loggedInAt: Date.now() });
    };

    const verifyEmail = () => {
        setUser(prev => prev ? { ...prev, isVerified: true } : null);
    };

    const logout = () => setUser(null);

    const isLoggedIn = !!user && (user.loginMethod !== 'email' || user.isVerified);

    return (
        <AuthContext.Provider value={{
            user,
            isLoggedIn,
            email: user?.email || null,
            isVerified: user?.isVerified || false,
            login,
            loginWithGoogle,
            loginWithEmail,
            verifyEmail,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
