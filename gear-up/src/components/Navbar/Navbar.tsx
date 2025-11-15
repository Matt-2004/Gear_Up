import { Logo, NavUtils } from "./NavUtils";
import NavbarContainer from "./NavbarContainer";
import NavbarTabs from "./NavbarTabs";

export default function Navbar() {
    return (
        <NavbarContainer>
            <Logo />
            <NavbarTabs />
            <NavUtils />
        </NavbarContainer>
    )

}
