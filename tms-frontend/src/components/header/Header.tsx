import { useClickOutside } from "@components/hooks/useClickOutside";
import React, { useEffect, useRef, useState } from "react";

interface HeaderProps {
    userName: string;
    onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userName, onLogout }) => {
    const headerRef = useRef<HTMLElement>(null)
    const { visible, handleCloseVisible, handleToggleVisible } = useClickOutside()

    const logoName: string = userName ? userName[0].toLocaleUpperCase() : '';

    const handleClickOutside = (event: MouseEvent) => {
        if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
            handleCloseVisible()
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        handleCloseVisible()
        onLogout();
    };

    return (
        <header className="block w-full h-16 bg-colors-background border-solid border-b-2 border-stone-200 shadow-xl flex justify-between items-center px-6" ref={headerRef}>
            <div className="block text-sm font-semibold">Time Management System</div>
            <div className="relative" >
                <div className="flex justify-center items-center gap-1 cursor-pointer" onClick={handleToggleVisible}>
                    <div className="w-10 h-10 rounded-full border-solid border-black border-2 flex items-center justify-center text-xl bg-stone-100">{logoName}</div>
                    <div className="block text-sm font-semibold">{userName}</div>
                </div>
                {visible && (
                    <div className="absolute right-0 mt-2 w-24 bg-white border border-stone-200 rounded-lg shadow-lg">
                        <button
                            className="block w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-100"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};
