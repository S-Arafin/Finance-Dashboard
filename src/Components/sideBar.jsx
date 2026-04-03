import React from "react";
import { IoHome } from "react-icons/io5";
import { PiNotepadFill } from "react-icons/pi";
import { FaMoneyBillWave } from "react-icons/fa6";
import { IoWalletSharp } from "react-icons/io5";
import { FaFileAlt } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { Link } from "react-router";

const sideBar = () => {
  return (
    <div className="group flex flex-col bg-accent shadow-2xl shadow-accent/70 hover:shadow-accent w-10 md:w-16 hover:w-45 transition-all duration-500 ease-in-out h-screen text-accent-content overflow-hidden">
      <div className="flex flex-col items-start gap-10 py-10 w-full">
        
        <Link to='/' className="flex items-center w-full px-2 md:px-4 cursor-pointer group-hover:pl-6 duration-300 whitespace-nowrap">
            <IoHome className="text-2xl md:text-3xl shrink-0" />
            <h2 className="text-md text-accent-content opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ml-4 font-semibold pt-[8px]">Summary</h2>
        </Link>
        <Link to='/statement' className="flex items-center w-full px-2 md:px-4 cursor-pointer group-hover:pl-6 duration-300 whitespace-nowrap">
            <FaFileAlt className="text-2xl md:text-3xl shrink-0" />
            <h2 className="text-md text-accent-content opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ml-4 font-semibold ">Statement</h2>
        </Link>
        <Link to='/income' className="flex items-center w-full px-2 md:px-4 cursor-pointer group-hover:pl-7 duration-300 whitespace-nowrap">
            <FaMoneyBillWave className="text-2xl md:text-3xl shrink-0" />
            <h2 className="text-md text-accent-content opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ml-4 font-semibold ">Income</h2>
        </Link>
        <Link to='/expenses' className="mt-auto mb-10 flex items-center w-full px-2 md:px-4 cursor-pointer group-hover:pl-7 duration-300 whitespace-nowrap">
            <IoWalletSharp className="text-2xl md:text-3xl shrink-0" />
            <h2 className="text-md text-accent-content opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ml-4 font-semibold ">Expenses</h2>
        </Link>
        
        

      </div>
      <div className="mt-auto mb-8 w-full">
        <Link to='/user' className="flex items-center w-full px-2 md:px-5 cursor-pointer group-hover:pl-12 duration-300 whitespace-nowrap">
            <FaCircleUser className="text-2xl md:text-3xl shrink-0"/>
            <h2 className="text-md text-accent-content opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ml-4 font-semibold">User</h2>
        </Link>
      </div>
    </div>
  );
};

export default sideBar;
