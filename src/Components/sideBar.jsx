import React, { useState, useMemo } from "react";
import { IoHome } from "react-icons/io5";
import { PiNotepadFill } from "react-icons/pi";
import { FaMoneyBillWave } from "react-icons/fa6";
import { IoWalletSharp } from "react-icons/io5";
import { FaFileAlt, FaSearch, FaSignOutAlt } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../Context/AuthContext";
import { useData } from "../Context/DataContext";

const SideBar = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { appData } = useData();

  const hasResults = useMemo(() => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.trim().toLowerCase();
    
    const incomesMatch = (appData?.income || []).some(i => 
      String(i.source || "").toLowerCase().includes(term) || 
      String(i.category || "").toLowerCase().includes(term) || 
      String(i.netAmount || "").toLowerCase().includes(term)
    );
    
    const expensesMatch = (appData?.expenses || []).some(e => 
      String(e.merchant || "").toLowerCase().includes(term) || 
      String(e.category || "").toLowerCase().includes(term) || 
      String(e.amount || "").toLowerCase().includes(term)
    );

    return incomesMatch || expensesMatch;
  }, [searchTerm, appData]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() !== "") {
      navigate(`/statement?search=${encodeURIComponent(value)}`);
    } else {
      navigate(`/statement`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={`group flex flex-col bg-accent shadow-2xl shadow-accent/70 hover:shadow-accent transition-all duration-500 ease-in-out h-screen text-accent-content overflow-hidden ${isSearchFocused ? 'w-45' : 'w-10 md:w-16 hover:w-45'}`}>
      <div className="flex flex-col items-start gap-10 py-10 w-full">
        
        <form onSubmit={(e) => e.preventDefault()} className={`relative flex flex-col justify-center w-full px-2 md:px-4 cursor-pointer duration-300 whitespace-nowrap ${isSearchFocused ? 'pl-6' : 'group-hover:pl-6'}`}>
            <div className="flex items-center w-full">
                <FaSearch className="text-2xl md:text-3xl shrink-0" onClick={() => document.getElementById('sidebarSearch').focus()} />
                <input
                    id="sidebarSearch"
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className={`ml-4 bg-transparent border-b border-accent-content/40 text-accent-content placeholder-accent-content/60 outline-none transition-all duration-300 text-sm ${isSearchFocused ? 'opacity-100 w-full' : 'opacity-0 w-0 group-hover:opacity-100 group-hover:w-full'}`}
                />
            </div>
            {!hasResults && isSearchFocused && searchTerm.trim() !== "" && (
                <span className="absolute top-10 left-[52px] text-xs text-error font-semibold tracking-wide">
                    Not found
                </span>
            )}
        </form>

        <Link to='/' className={`flex items-center w-full px-2 md:px-4 cursor-pointer duration-300 whitespace-nowrap ${isSearchFocused ? 'pl-6' : 'group-hover:pl-7'}`}>
            <IoHome className="text-2xl md:text-3xl shrink-0" />
            <h2 className={`text-md text-accent-content transition-opacity duration-300 whitespace-nowrap ml-4 font-semibold pt-[8px] ${isSearchFocused ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>Summary</h2>
        </Link>
        
        <Link to='/statement' className={`flex items-center w-full px-2 md:px-4 cursor-pointer duration-300 whitespace-nowrap ${isSearchFocused ? 'pl-6' : 'group-hover:pl-7'}`}>
            <FaFileAlt className="text-2xl md:text-3xl shrink-0" />
            <h2 className={`text-md text-accent-content transition-opacity duration-300 whitespace-nowrap ml-4 font-semibold ${isSearchFocused ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>Statement</h2>
        </Link>
        
        <Link to='/income' className={`flex items-center w-full px-2 md:px-4 cursor-pointer duration-300 whitespace-nowrap ${isSearchFocused ? 'pl-7' : 'group-hover:pl-7'}`}>
            <FaMoneyBillWave className="text-2xl md:text-3xl shrink-0" />
            <h2 className={`text-md text-accent-content transition-opacity duration-300 whitespace-nowrap ml-4 font-semibold ${isSearchFocused ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>Income</h2>
        </Link>
        
        <Link to='/expenses' className={`flex items-center w-full px-2 md:px-4 cursor-pointer duration-300 whitespace-nowrap ${isSearchFocused ? 'pl-7' : 'group-hover:pl-7'}`}>
            <IoWalletSharp className="text-2xl md:text-3xl shrink-0" />
            <h2 className={`text-md text-accent-content transition-opacity duration-300 whitespace-nowrap ml-4 font-semibold ${isSearchFocused ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>Expenses</h2>
        </Link>

      </div>
      
      <div className="mt-auto mb-8 w-full flex flex-col gap-8">
        
        <Link to='/user' className={`flex items-center w-full px-2 md:px-5 cursor-pointer duration-300 whitespace-nowrap ${isSearchFocused ? 'pl-12' : 'group-hover:pl-11'}`}>
            <FaCircleUser className="text-2xl md:text-3xl shrink-0"/>
            <h2 className={`text-md text-accent-content transition-opacity duration-300 whitespace-nowrap ml-4 font-semibold ${isSearchFocused ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>User</h2>
        </Link>

        <button onClick={handleLogout} className={`flex items-center w-full px-2 md:px-5 cursor-pointer duration-300 whitespace-nowrap border-none bg-transparent ${isSearchFocused ? 'pl-12' : 'group-hover:pl-7'}`}>
            <FaSignOutAlt className="text-2xl md:text-3xl shrink-0"/>
            <h2 className={`text-md text-accent-content transition-opacity duration-300 whitespace-nowrap ml-4 font-semibold ${isSearchFocused ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>Sign Out</h2>
        </button>

      </div>
    </div>
  );
};

export default SideBar;