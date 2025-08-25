"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface FavoriteContextType {
    favoriteIds: string[];
    refreshFavorites: () => Promise<void>;
    setFavoriteIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoriteProvider = ({ children }: { children: ReactNode }) => {
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

    const refreshFavorites = async () => {
        const res = await fetch("/api/users/favorites");
        const data = await res.json();
        if (Array.isArray(data.favorites)) {
            setFavoriteIds(data.favorites);
        }
    };

    useEffect(() => {
        refreshFavorites();
    }, []);

    return (
        <FavoriteContext.Provider value={{ favoriteIds, refreshFavorites, setFavoriteIds }}>
            {children}
        </FavoriteContext.Provider>
    );
};

export const useFavorite = () => {
    const ctx = useContext(FavoriteContext);
    if (!ctx) throw new Error("useFavorite must be used within FavoriteProvider");
    return ctx;
};
