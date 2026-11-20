import * as React from "react";
import { useMotionPreference } from "./use-motion-preference";
export function useSpin<T extends Element>(enabled = true, duration = 1000) {
    const ref = React.useRef<T>(null);
    const reduced = useMotionPreference().reduced;
    React.useEffect(() => {
        if (!enabled)
            return;
        const el = ref.current;
        if (!el)
            return;
        if (reduced)
            return;
        const animation = el.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }], {
            duration,
            iterations: Infinity,
            easing: "linear",
        });
        return () => animation.cancel();
    }, [enabled, duration, reduced]);
    return ref;
}
