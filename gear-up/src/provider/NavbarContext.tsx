// PopupContext.tsx
import { createContext, useContext, useState } from "react";

type Tag = "viewProfile" | "settings" | "updateProfile";

interface PopupContextType {
    isOpen: boolean;
    openPopup: () => void;
    closePopup: () => void;
    tag: Tag;
    setTag: (tag: Tag) => void;
}

const PopupContext = createContext<PopupContextType>({
    isOpen: false,
    openPopup: () => { },
    closePopup: () => { },
    tag: "viewProfile",
    setTag: () => { },
});

export const NavbarContentProvider = ({ children }: { children: React.ReactNode }) => {
    const [tag, setTag] = useState<Tag>("viewProfile");
    const [isOpen, setIsOpen] = useState(false);
    return (
        <PopupContext.Provider
            value={{
                isOpen,
                openPopup: () => setIsOpen(true),
                closePopup: () => setIsOpen(false),
                tag: tag,
                setTag: (tag: Tag) => setTag(tag),
            }}
        >
            {children}
        </PopupContext.Provider>
    );
};

export const usePopup = () => useContext(PopupContext);
