import { ReactNode } from "react"

const NavbarItems = ({ children }: { children: ReactNode }) => {
	return <div className="items-center">{children}</div>
}

export default NavbarItems
