"use client";
import { AccessToken } from "@components/constants/common";
import { TProfile } from "@components/types/auth";
import cookie from "@components/utils/cookie";
import { createContext, useLayoutEffect, useState } from "react";

type GlobalContextType = {
  userInfo: TProfile | null;
  setUserInfo: React.Dispatch<React.SetStateAction<TProfile | null>>;
  isAuthenticated: boolean | null;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>;
  reset: () => void;
};

const initialGlobalContext: GlobalContextType = {
  userInfo: null,
  setUserInfo: () => null,
  isAuthenticated: null,
  setIsAuthenticated: () => null,
  reset: () => null,
};

export const GlobalContext =
  createContext<GlobalContextType>(initialGlobalContext);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
    initialGlobalContext.isAuthenticated
  );

  const [userInfo, setUserInfo] = useState<TProfile | null>(
    initialGlobalContext.userInfo
  );

  const reset = () => {
    setIsAuthenticated(false);
    setUserInfo(null);
    localStorage.removeItem("userInfo");
  };

  useLayoutEffect(() => {
    const token = cookie.get(AccessToken);

    if (token) {
      setIsAuthenticated(true);
      const storedUserInfo = localStorage.getItem("userInfo");
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    } else setIsAuthenticated(false);
  }, []);

  useLayoutEffect(() => {
    if (userInfo) {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    } else {
      localStorage.removeItem("userInfo");
    }
  }, [userInfo]);

  return (
    <GlobalContext.Provider
      value={{
        userInfo,
        setUserInfo,
        isAuthenticated,
        setIsAuthenticated,
        reset,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
