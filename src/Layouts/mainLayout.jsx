import React from "react";
import { Outlet, Navigate } from "react-router";
import { useAuth } from "../Context/AuthContext";
import SideBar from "../Components/sideBar";
import ThemeToggle from "../Components/ThemeToggle";
import Logo from "../Components/logo";

const MainLayout = () => {
  const { auth } = useAuth();
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
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
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-base-300 text-neutral rounded-full">
              Role: {auth.role}
            </span>
          </div>
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
