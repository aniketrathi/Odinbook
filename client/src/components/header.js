import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavLink,
  NavItem,
} from "reactstrap";
import React, { useContext, useState } from "react";
import AuthContext from "../context/auth-context";
import Logout from "./auth/logout";

const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const { loggedIn } = useContext(AuthContext);

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="">
          <h3>Odinbook</h3>
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            {loggedIn === false && (
              <>
                <NavItem>
                  <NavLink href="/auth">Signup</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/auth/login">Login</NavLink>
                </NavItem>
              </>
            )}
            {loggedIn === true && (
              <>
                <NavItem>
                  <Logout />
                </NavItem>
              </>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
