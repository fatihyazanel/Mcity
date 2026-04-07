"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface AuthUser {
  name: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "mcity-users";
const SESSION_KEY = "mcity-session";

function getUsers(): Record<string, { name: string; passwordHash: string }> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

function saveUsers(users: Record<string, { name: string; passwordHash: string }>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

// Simple hash - not for production, just client-side demo
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "mcity_salt_2026");
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    const users = getUsers();
    const record = users[email.toLowerCase()];
    if (!record) return { ok: false, error: "Email not found. Please register first." };

    const hash = await hashPassword(password);
    if (hash !== record.passwordHash) return { ok: false, error: "Incorrect password." };

    const authUser: AuthUser = { name: record.name, email: email.toLowerCase() };
    setUser(authUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
    return { ok: true };
  };

  const register = async (name: string, email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    if (!name.trim()) return { ok: false, error: "Name is required." };
    if (!email.includes("@")) return { ok: false, error: "Invalid email address." };
    if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };

    const users = getUsers();
    const key = email.toLowerCase();
    if (users[key]) return { ok: false, error: "An account with this email already exists." };

    const passwordHash = await hashPassword(password);
    users[key] = { name: name.trim(), passwordHash };
    saveUsers(users);

    const authUser: AuthUser = { name: name.trim(), email: key };
    setUser(authUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
