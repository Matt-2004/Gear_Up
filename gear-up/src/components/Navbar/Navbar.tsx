import { Logo } from "./NavUtils";
import NavbarContainer from "./NavbarContainer";
import NavbarTabs from "./NavbarTabs";
import NavbarUtility from "@/components/Navbar/NavbarUtility";

export default function Navbar() {
  return (
    <NavbarContainer>
      <Logo />
      <NavbarTabs />
      <NavbarUtility />
    </NavbarContainer>
  );
}
