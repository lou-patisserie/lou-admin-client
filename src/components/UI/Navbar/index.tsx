"use-client";

import { MenuIcon } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "../Drawer";

const Navbar = () => {
  return (
    <Drawer direction="left">
      <DrawerTrigger>
        <MenuIcon />
      </DrawerTrigger>
      <DrawerContent>test</DrawerContent>
    </Drawer>
  );
};

export default Navbar;
