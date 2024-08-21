import React, { useState } from "react";
import classcat from "classcat";

interface TabsProps {
    tabs: { id: number; label: string; content?: React.ReactNode }[];
    className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, className }) => {
    const [activeTab, setActiveTab] = useState<number>(tabs[0].id);

    return (
        <div className={classcat(["grid gap-4", className])}>
            <div className="flex border-b border-gray-200 w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={classcat([
                            "px-4 py-2 text-sm font-medium",
                            activeTab === tab.id
                                ? "border-b-2 border-colors-main text-title"
                                : "text-gray-500 hover:text-gray-700",
                        ])}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="mt-2">
                {tabs.find((tab) => tab.id === activeTab)?.content}
            </div>
        </div>
    );
};