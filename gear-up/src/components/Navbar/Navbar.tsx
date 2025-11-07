import { NavbarContentProvider } from "@/provider/NavbarContext";
import { Logo, NavUtils } from "./Presentation";
import NavbarContainer from "./NavbarContainer";
import NavbarTabs from "./NavbarTabs";

export default function Navbar() {

    return (
        <NavbarContentProvider>
            <NavbarContainer>
                <Logo />
                <NavbarTabs />
                <NavUtils />
            </NavbarContainer>
        </NavbarContentProvider>
    )

}
