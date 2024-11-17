import { useState, useEffect } from "react"

export const useOrigin = () => {
    const [mounted, setMounted] = useState(false);

    //check if window is available, then checking if windown's location isavailable else passing an empty string
    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : '';


    useEffect(() => {
        setMounted(true); 
    }, []
    )

    if(!mounted) {
        return '';
    }

    return origin;
}