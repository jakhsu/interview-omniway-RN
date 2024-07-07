import * as SecureStore from "expo-secure-store";
import * as React from "react";
import { Platform } from "react-native";

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null]
): UseStateHook<T> {
  return React.useReducer(
    (
      state: [boolean, T | null],
      action: T | null = null
    ): [boolean, T | null] => [false, action],
    initialValue
  ) as UseStateHook<T>;
}

async function setStorageItemAsync(key: string, value: string | null) {
  if (Platform.OS === "web") {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.error("Local storage is unavailable:", e);
    }
  } else {
    if (value == null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }
}

function useStorageState<T>(key: string): UseStateHook<T> {
  // Validate key
  if (!key || !/^[a-zA-Z0-9]+$/.test(key)) {
    throw new Error(
      "Invalid key provided to SecureStore. Keys must not be empty and must contain only alphanumeric characters."
    );
  }

  const [state, setState] = useAsyncState<T>();

  React.useEffect(() => {
    const fetchValue = async () => {
      if (Platform.OS === "web") {
        try {
          if (typeof localStorage !== "undefined") {
            const value = localStorage.getItem(key);
            setState(value ? JSON.parse(value) : null);
          }
        } catch (e) {
          console.error("Local storage is unavailable:", e);
        }
      } else {
        const value = await SecureStore.getItemAsync(key);
        setState(value ? JSON.parse(value) : null);
      }
    };
    fetchValue();
  }, [key]);

  const setValue = React.useCallback(
    (value: T | null) => {
      setState(value);
      setStorageItemAsync(key, value ? JSON.stringify(value) : null);
    },
    [key]
  );

  return [state, setValue];
}

export { setStorageItemAsync, useStorageState };
