// PopupContext.tsx
import { createContext, useContext, useState } from "react";
import { string } from "zod";

interface PopupContextType {
    isOpen: boolean;
    openPopup: () => void;
    closePopup: () => void;
    tag: "viewProfile" | "settings";
    setTag: (tag: "viewProfile" | "settings") => void;
}

const PopupContext = createContext<PopupContextType>({
    isOpen: false,
    openPopup: () => { },
    closePopup: () => { },
    tag: "viewProfile",
    setTag: () => { },
});

export const TitleContentProvider = ({ children }: { children: React.ReactNode }) => {
    const [tag, setTag] = useState<"viewProfile" | "settings">("viewProfile");
    const [isOpen, setIsOpen] = useState(false);
    return (
        <PopupContext.Provider
            value={{
                isOpen,
                openPopup: () => setIsOpen(true),
                closePopup: () => setIsOpen(false),
                tag: tag,
                setTag: (tag: "viewProfile" | "settings") => setTag(tag),
            }}
        >
            {children}
        </PopupContext.Provider>
    );
};

export const usePopup = () => useContext(PopupContext);
