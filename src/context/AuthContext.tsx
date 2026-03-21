import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { clearSession, getSession, saveSession } from '../storage/authStorage';
import { loginUser, registerUser } from '../services/authService';

type LoginInput = {
  email: string;
  password: string;
};

type AuthContextValue = {
  token: string | null;
  email: string | null;
  isAuthenticated: boolean;
  isBooting: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        const session = await getSession();

        if (!mounted) {
          return;
        }

        setToken(session.token);
        setEmail(session.email);
      } finally {
        if (mounted) {
          setIsBooting(false);
        }
      }
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  const value: AuthContextValue = {
    token,
    email,
    isAuthenticated: Boolean(token),
    isBooting,
    async login(input) {
      const authToken = await loginUser(input);
      await saveSession(authToken, input.email);
      setToken(authToken);
      setEmail(input.email);
    },
    async register(input) {
      await registerUser(input);
    },
    async logout() {
      await clearSession();
      setToken(null);
      setEmail(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return value;
}
