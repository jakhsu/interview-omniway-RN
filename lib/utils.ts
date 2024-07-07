import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function jwtDecode(token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }

  const decoded = jwtDecode(accessToken);

  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

export const setSession = async (accessToken: string, logout: () => void) => {
  if (accessToken) {
    await AsyncStorage.setItem("accessToken", accessToken);
  } else {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("user");
  }
};

export const getRefreshToken = async () => {
  const accessToken = await AsyncStorage.getItem("accessToken");
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/api/token/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }
    return response.json();
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

type DecodedToken = {
  exp: number; // Expiration time in seconds since the epoch
};

export const getTokenExpiration = (token: string): number | null => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.exp ? decoded.exp * 1000 : null; // Convert to milliseconds
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
