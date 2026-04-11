"use client";

import { ChatIcon } from "../Common/SVGs";

export { default as Logo } from "./NavbarBrand";
export {
  NavbarLoginButton as Login,
  NavbarUserMenu as User,
} from "./NavbarAuthControls";

export function Chat() {
  return <ChatIcon />;
}
