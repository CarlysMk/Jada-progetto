import { useEffect, useState } from "react";

/*
delay utile per evirare che ogni singolo tasto premuto generi una chiamata API
 */
export function useDebounce<T>(value: T, delayMs = 400): T {
    const [debounced, setDebounced] = useState(value);
    
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delayMs);
        return () => clearTimeout(timer);
    }, [value, delayMs]);

    return debounced;
}