import { useState } from "react";
import { PanicModePayload } from "../types/panicMode.types";

export const usePanicMode = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL + "/user";

  const activatePanicMode = async (payload: PanicModePayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/panic-mode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deactivatePanicMode = async (payload: PanicModePayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/panic-mode/reverse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getPanicStatus = async (userId: string | undefined) => {
    setIsLoading(true);
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
  
      if (typeof userId !== 'string' || userId.length !== 24) {
        throw new Error('Invalid user ID format');
      }
  
      const response = await fetch(`${API_URL}/panic-status/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch panic status');
      }
  
      const data = await response.json();
      return data.panicMode;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    activatePanicMode,
    deactivatePanicMode,
    getPanicStatus,
    isLoading,
    error,
  };
};
