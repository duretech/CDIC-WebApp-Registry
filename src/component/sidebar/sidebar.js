import React from "react";
import MenuItem from "./menuitem";

const SideBar = (props) => {
  const aMenuLinks = props.menus.map((prop, key) => {
    if (!prop.redirect) {
      return <MenuItem key={key} routes={prop} />;
    }
    return null;
  });

  return (
    <div className={`sidebar ${props.className}`}>
      <nav className="sidebar-nav">
        <ul className="nav">{aMenuLinks}</ul>
      </nav>
    </div>
  );
};

export default SideBar;
