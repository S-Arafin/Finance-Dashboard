import React from "react";
import { Outlet } from "react-router";
import SideBar from "../Components/sideBar";
import ThemeToggle from "../Components/ThemeToggle";
import Logo from "../Components/logo";

const mainLayout = () => {
  return (
    <div className="flex h-screen w-full">
      <div>
        <ThemeToggle></ThemeToggle>
      </div>
      <div className="relative z-30 w-16 shrink-0">
        <div className="absolute top-0 left-0">
            <SideBar></SideBar>
      </div>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="px-1 md:px-30  py-10">
          <div>
            <Logo></Logo>
          </div>
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default mainLayout;
