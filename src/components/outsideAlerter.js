import {useEffect, useRef} from "react";

function useOutsideAlerter(ref, onOutsideClick) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                onOutsideClick();
            }
        }
        // Bind the event listener
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, [onOutsideClick, ref]);
}

export default function OutsideAlerter({children, onOutsideClick, className}) {
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, onOutsideClick);

    return <div className={className} ref={wrapperRef}>{children}</div>;
}