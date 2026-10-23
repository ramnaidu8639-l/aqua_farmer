import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { name: string; mobile: string; email: string; password: string; location: string; farm_type: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User> & { new_password?: string }) => Promise<boolean>;
  switchDemoPersona: (persona: 'farmer_ramesh' | 'farmer_priya' | 'admin_rao') => void;
  favoriteSpeciesIds: number[];
  toggleFavorite: (speciesId: number) => Promise<void>;
  authError: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [favoriteSpeciesIds, setFavoriteSpeciesIds] = useState<number[]>([1, 2]);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize with Demo Farmer Ramesh Naidu so the application is immediately rich and interactive
  useEffect(() => {
    const savedToken = localStorage.getItem('aqua_auth_token');
    if (savedToken) {
      setToken(savedToken);
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.user) {
            setUser(data.user);
          } else {
            setDemoFarmer();
          }
        })
        .catch(() => setDemoFarmer())
        .finally(() => setIsLoading(false));
    } else {
      setDemoFarmer();
      setIsLoading(false);
    }
  }, []);

  const setDemoFarmer = () => {
    const demoUser: User = {
      id: 1,
      name: 'Ramesh Naidu',
      mobile: '+91 98480 12345',
      email: 'ramesh.farmer@aquafarmers.in',
      location: 'Bhimavaram, Andhra Pradesh',
      farm_type: 'Shrimp Farming (Vannamei)',
      role: 'farmer',
      created_at: '2026-09-15 10:30:00',
    };
    setUser(demoUser);
    setToken('uid-1');
    localStorage.setItem('aqua_auth_token', 'uid-1');
    setFavoriteSpeciesIds([1, 2]);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Login failed');
        return false;
      }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('aqua_auth_token', data.token);
      return true;
    } catch {
      setAuthError('Connection error during login');
      return false;
    }
  };

  const register = async (formData: { name: string; mobile: string; email: string; password: string; location: string; farm_type: string }): Promise<boolean> => {
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Registration failed');
        return false;
      }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('aqua_auth_token', data.token);
      return true;
    } catch {
      setAuthError('Connection error during registration');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('aqua_auth_token');
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
  };

  const updateProfile = async (data: Partial<User> & { new_password?: string }): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (res.ok && resData.user) {
        setUser(resData.user);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const switchDemoPersona = (persona: 'farmer_ramesh' | 'farmer_priya' | 'admin_rao') => {
    if (persona === 'farmer_ramesh') {
      const u: User = {
        id: 1,
        name: 'Ramesh Naidu',
        mobile: '+91 98480 12345',
        email: 'ramesh.farmer@aquafarmers.in',
        location: 'Bhimavaram, Andhra Pradesh',
        farm_type: 'Shrimp Farming (Vannamei)',
        role: 'farmer',
        created_at: '2026-09-15 10:30:00',
      };
      setUser(u);
      setToken('uid-1');
      localStorage.setItem('aqua_auth_token', 'uid-1');
      setFavoriteSpeciesIds([1, 2]);
    } else if (persona === 'farmer_priya') {
      const u: User = {
        id: 2,
        name: 'Priya Patel',
        mobile: '+91 97230 45678',
        email: 'priya.patel@aquafarmers.in',
        location: 'Surat, Gujarat',
        farm_type: 'Brackish Water Aquaculture',
        role: 'farmer',
        created_at: '2026-10-01 14:20:00',
      };
      setUser(u);
      setToken('uid-2');
      localStorage.setItem('aqua_auth_token', 'uid-2');
      setFavoriteSpeciesIds([1, 5]);
    } else if (persona === 'admin_rao') {
      const u: User = {
        id: 3,
        name: 'Dr. K.V. Rao',
        mobile: '+91 94401 99887',
        email: 'admin@aquafarmers.in',
        location: 'Kakinada, Andhra Pradesh',
        farm_type: 'Aquaculture Extension & Research',
        role: 'admin',
        created_at: '2026-08-01 09:00:00',
      };
      setUser(u);
      setToken('uid-3');
      localStorage.setItem('aqua_auth_token', 'uid-3');
    }
  };

  const toggleFavorite = async (speciesId: number) => {
    try {
      const res = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ species_id: speciesId }),
      });
      const data = await res.json();
      if (res.ok && data.favorite_species_ids) {
        setFavoriteSpeciesIds(data.favorite_species_ids);
      } else {
        // Fallback local toggle
        setFavoriteSpeciesIds((prev) =>
          prev.includes(speciesId) ? prev.filter((id) => id !== speciesId) : [...prev, speciesId]
        );
      }
    } catch {
      setFavoriteSpeciesIds((prev) =>
        prev.includes(speciesId) ? prev.filter((id) => id !== speciesId) : [...prev, speciesId]
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        updateProfile,
        switchDemoPersona,
        favoriteSpeciesIds,
        toggleFavorite,
        authError,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
