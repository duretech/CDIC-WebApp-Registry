import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Trans } from "react-i18next";

const MenuItem = ({ routes }) => {
  const [open, setOpen] = useState(false);
  const getRouteConf = () => {
    let { childs } = routes,
      aChildRoutes = [];
    childs.forEach(({ name, label, path, visible, isactive }) => {
      if (visible && isactive) {
        aChildRoutes.push({
          path: path.split(" ").join("").toLowerCase(),
          displayName: label,
          name: name,
        });
      }
    });
    return aChildRoutes;
  };

  const sPath = routes.path,
    sIcon = routes.icon,
    sDisplayName = routes.displayName,
    bIsMultilevel = routes.multilevel,
    aConf = bIsMultilevel ? getRouteConf() : [];

  const toggleOpen = (e) => {
    e.preventDefault();
    setOpen((prev) => !prev);
  };

  return (
    <>
      {!bIsMultilevel ? (
        <li className="nav-item">
          <NavLink className="nav-link" to={sPath}>
            <i className={`nav-icon ${sIcon}`}></i>
            <Trans>{sDisplayName}</Trans>
          </NavLink>
        </li>
      ) : (
        <li className={`nav-dropdown ${open ? "open" : ""}`}>
          <span className="nav-dropdown-toggle nav-link" onClick={toggleOpen}>
            <i className={`nav-icon ${sIcon}`}></i>
            <Trans>{sDisplayName}</Trans>
          </span>
          <ul className="nav-dropdown-items">
            <li className="nav-item">
              {aConf.map(({ name, path, displayName }, key) => {
                return (
                  <NavLink
                    key={key}
                    className="nav-link"
                    style={styles.navlink}
                    to={path}
                  >
                    {" "}
                    <Trans>{displayName}</Trans>
                  </NavLink>
                );
              })}
            </li>
          </ul>
        </li>
      )}
    </>
  );
};

const styles = {
  navlink: {
    paddingLeft: "50px",
  },
};

export default MenuItem;
