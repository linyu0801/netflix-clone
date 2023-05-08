import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';

import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth } from '../firebase';
import { loadingState } from '../atoms/loadingAtom';
import { useRecoilState } from 'recoil';

interface IAuth {
  user: User | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<IAuth>({
  user: null,
  signUp: async () => {},
  signIn: async () => {},
  logout: async () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useRecoilState(loadingState);
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  // presist user狀態
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Logged in...
        setUser(user);
        setLoading(false);
      } else {
        // Not logged in...
        setUser(null);
        setLoading(true);
        router.push('/login');
      }

      setInitialLoading(false);
    });
  }, [auth]);

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentail) => {
        setUser(userCredentail.user);
        setLoading(false);
        router.push('/');
      })
      .catch((e) => alert(e))
      .finally(() => setLoading(false));
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredentail) => {
        setUser(userCredentail.user);
        setLoading(false);
        router.push('/');
      })
      .catch((e) => alert(e))
      .finally(() => setLoading(false));
  };

  const logout = async () => {
    setLoading(true);
    signOut(auth)
      .then(() => setUser(null))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  };

  const memoedValue = useMemo(
    () => ({
      user,
      signUp,
      signIn,
      logout,
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {!initialLoading && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
