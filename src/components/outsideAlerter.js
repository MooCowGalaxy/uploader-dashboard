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
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onOutsideClick, ref]);
}

export default function OutsideAlerter({children, onOutsideClick, id, className}) {
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, onOutsideClick);

    return <div key={id} className={className} ref={wrapperRef}>{children}</div>;
}