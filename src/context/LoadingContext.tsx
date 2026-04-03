"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";

interface LoadingContextType {
  isLoading: boolean;
  showLoading: (message?: string) => void;
  hideLoading: (force?: boolean) => void;
  loadingMessage?: string;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>(undefined);
  const loadingStartTime = useRef<number | null>(null);
  const minLoadingTime = 600; // 600ms minimum to ensure animation is visible

  const showLoading = useCallback((message?: string) => {
    setLoadingMessage(message);
    setIsLoading(true);
    loadingStartTime.current = Date.now();
  }, []);

  const hideLoading = useCallback((force?: boolean) => {
    if (force || !loadingStartTime.current) {
      setIsLoading(false);
      setLoadingMessage(undefined);
      loadingStartTime.current = null;
      return;
    }

    const currentTime = Date.now();
    const elapsedTime = currentTime - (loadingStartTime.current || currentTime);
    const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

    if (remainingTime > 0) {
      setTimeout(() => {
        setIsLoading(false);
        setLoadingMessage(undefined);
        loadingStartTime.current = null;
      }, remainingTime);
    } else {
      setIsLoading(false);
      setLoadingMessage(undefined);
      loadingStartTime.current = null;
    }
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading, loadingMessage }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
