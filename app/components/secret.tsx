import React, { useEffect } from "react";

const Secret: React.FC = () => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            console.log("You pressed a key!");
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return null;
};

export default Secret;
