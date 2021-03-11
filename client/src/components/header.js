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

  const handleSearch = (e) => {
    e.preventDefault();
    if (e.target.searchbar.value.length !== 0) {
      window.location.href = "/search/" + e.target.searchbar.value;
    }
  };

  const { loggedIn, user } = useContext(AuthContext);

  return (
    <div>
      <Navbar color="light" light expand="md" className="mb-3">
        <NavbarBrand href="/">
          <h3>Odinbook</h3>
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mx-auto" navbar>
            {loggedIn === true && (
              <>
                <NavItem>
                  <NavLink href={`/users/${user}/friendrequests/`}>
                    <i className="fas fa-users" style={{fontSize: "30px", margin:"10px"}}></i>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <form onSubmit={handleSearch} style={{ margin:"10px"}}>
                    <label htmlFor="search-bar">
                      <i className="fab fa-searchengin" style={{fontSize: "20px", marginRight:"15px"}}></i>
                    </label>
                    <input
                      className="uses-font"
                      type="text"
                      id="search-bar"
                      name="searchbar"
                      placeholder="Aniket Rathi"
                    />
                  </form>
                </NavItem>
              </>
            )}
          </Nav>
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
                  <NavLink href={`/users/${user}`}>
                    <i className="fas fa-user-circle" style={{fontSize: "30px", margin:"10px"}}></i>
                  </NavLink>
                </NavItem>
                <NavItem style={{ margin:"10px"}}>
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
