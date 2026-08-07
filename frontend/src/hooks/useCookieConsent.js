import { useState, useEffect } from 'react';

const STORAGE_KEY = 'cookiesnack_consent';

export function useCookieConsent() {
    const [consent, setConsent] = useState(null);
    const [showBanner, setShowBanner] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [preferences, setPreferences] = useState({
        necessary: true,
        analytics: false,
        marketing: false,
        functional: false,
    });

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            setConsent(parsed);
            setPreferences(prev => ({ ...prev, ...parsed }));
        } else {
            setTimeout(() => setShowBanner(true), 800);
        }
    }, []);

    const acceptAll = () => {
        const all = { necessary: true, analytics: true, marketing: true, functional: true };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        setConsent(all);
        setPreferences(all);
        setShowBanner(false);
        setShowSettings(false);
    };

    const rejectAll = () => {
        const none = { necessary: true, analytics: false, marketing: false, functional: false };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(none));
        setConsent(none);
        setPreferences(none);
        setShowBanner(false);
        setShowSettings(false);
    };

    const savePreferences = (prefs) => {
        const final = { ...prefs, necessary: true };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(final));
        setConsent(final);
        setPreferences(final);
        setShowBanner(false);
        setShowSettings(false);
    };

    const resetConsent = () => {
        localStorage.removeItem(STORAGE_KEY);
        setConsent(null);
        setShowBanner(true);
    };

    return {
        consent, showBanner, setShowBanner,
        showSettings, setShowSettings,
        preferences, setPreferences,
        acceptAll, rejectAll, savePreferences, resetConsent,
    };
}
