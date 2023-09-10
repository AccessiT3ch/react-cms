import React from "react";
import { FC, ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import "./header.scss";

/**
 * Header Component
 * @param {string} title - Page Title
 * @param {ToggleSidebar} toggleSidebar - Toggle Sidebar Function
 * @returns Header Component
 */

export interface HeaderProps {
  title: string;
}

export const Header: FC<HeaderProps> = ({
  title,
}): ReactElement => {
  const navigate = useNavigate();
  return (
    <header className="header">
      <a
        href="/"
        className="header__a_logo"
        onClick={(e) => {
          e.preventDefault();
          navigate("/");
        }}
      >
        <img
          src={process.env.PUBLIC_URL + `/black_logo192.png`}
          alt="Logo"
          className="header__img"
        />
      </a>
      <h1>{title}</h1>
    </header>
  );
};
