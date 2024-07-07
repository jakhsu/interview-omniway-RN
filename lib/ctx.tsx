import React, { useEffect, useState } from 'react';
import { useStorageState } from './useStorageState';
import { getTokenExpiration } from './utils';

type User = {
    id: number;
    username: string;
    email: string;
    displayName: string;
    photoURL: {
        id: number;
        url: string;
    };
};

type AuthContextType = {
    signIn: ({ identifier, password }: { identifier: string, password: string }) => Promise<void>;
    signOut: () => void;
    accessToken?: string | null | undefined;
    user?: User | null;
    isLoading: boolean;
};

const AuthContext = React.createContext<AuthContextType>({
    signIn: async () => Promise.resolve(),
    signOut: () => null,
    accessToken: null,
    user: null,
    isLoading: false,
});

export function useSession() {
    const value = React.useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }

    return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
    const [[isLoading, accessToken], setAccessToken] = useStorageState<string | null>("accessToken");
    const [[, user], setUser] = useStorageState<User | null>("user");
    const [isAuthLoading, setAuthLoading] = useState(false);
    const [logoutTimer, setLogoutTimer] = useState<NodeJS.Timeout | null>(null);

    const clearLogoutTimer = () => {
        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    };

    const setLogoutTimerWithToken = (token: string) => {
        const expirationTime = getTokenExpiration(token);
        if (expirationTime) {
            const timeUntilExpiration = expirationTime - Date.now();
            if (timeUntilExpiration > 0) {
                setLogoutTimer(setTimeout(signOut, timeUntilExpiration));
            }
        }
    };

    const signIn = async ({ identifier, password }: { identifier: string, password: string }) => {
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        setAuthLoading(true);
        try {
            const response = await fetch(`${apiUrl}/api/auth/local`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier, password }),
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Login failed');
            }
            const data = await response.json();
            setAccessToken(data.jwt);
            setUser(data.user);
            setLogoutTimerWithToken(data.jwt);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setAuthLoading(false);
        }
    };

    const signOut = () => {
        clearLogoutTimer();
        setAccessToken(null);
        setUser(null);
    };

    useEffect(() => {
        if (accessToken) {
            setLogoutTimerWithToken(accessToken);
        }
        return clearLogoutTimer;
    }, [accessToken]);


    return (
        <AuthContext.Provider
            value={{
                signIn,
                signOut,
                accessToken: accessToken,
                user,
                isLoading: isAuthLoading || isLoading,
            }}>
            {props.children}
        </AuthContext.Provider>
    );
}