"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const [mounted, setMounted] = React.useState(false);
    const { resolvedTheme, setTheme } = useTheme();

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-black dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Toggle theme"
            >
                <Sun className="h-5 w-5" />
                <span className="sr-only">Toggle theme</span>
            </button>
        );
    }

    const isDark = resolvedTheme === "dark";

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-black dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle theme"
        >
            {isDark ? (
                <Sun className="h-5 w-5 hover:text-yellow-400 transition-colors" />
            ) : (
                <Moon className="h-5 w-5 hover:text-blue-600 transition-colors" />
            )}
            <span className="sr-only">Toggle theme</span>
        </button>
    );
}
