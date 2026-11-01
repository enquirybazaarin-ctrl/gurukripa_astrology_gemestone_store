import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPixelEvent } from "../utils/metaPixel";

const ScrollToTop = () => {
    const { pathname, search, hash } = useLocation();
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (hash) {
            const targetId = hash.replace('#', '');
            const scrollToElement = () => {
                const el = document.getElementById(targetId);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                }
            };
            // Run immediate and with short delays to ensure DOM is ready
            scrollToElement();
            const t1 = setTimeout(scrollToElement, 150);
            const t2 = setTimeout(scrollToElement, 400);
            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
            };
        } else {
            window.scrollTo(0, 0);
        }

        // Avoid duplicating the initial PageView from index.html on first load
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        trackPixelEvent('PageView');
    }, [pathname, search, hash]);

    return null;
};

export default ScrollToTop;

