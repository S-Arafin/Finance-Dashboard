import React from 'react';
import { useData } from '../Context/DataContext';
import { useAuth } from '../Context/AuthContext';
import { FaEnvelope, FaBriefcase, FaExchangeAlt, FaShieldAlt, FaPercent, FaMoneyBillWave } from 'react-icons/fa';

const User = () => {
  const { appData } = useData();
  const { auth, login } = useAuth();
  
  const user = appData.user;

  const handleRoleToggle = () => {
    const newRole = auth.role === 'admin' ? 'user' : 'admin';
    login(newRole, newRole);
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-5xl mx-auto space-y-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-neutral">User Profile</h1>
          <p className="text-neutral opacity-70">Manage your account and permissions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-base-200 rounded-3xl shadow-xl border border-base-300 overflow-hidden">
            <div className="h-32 bg-primary/20 w-full relative">
              <div className="absolute -bottom-12 left-8 border-4 border-base-200 rounded-full overflow-hidden w-28 h-28 bg-base-300 shadow-lg">
                {user.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-neutral opacity-50">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-16 pb-8 px-8">
              <h2 className="text-2xl font-bold text-neutral">{user.name}</h2>
              <div className="flex flex-wrap gap-4 mt-4 text-neutral opacity-80">
                <div className="flex items-center gap-2">
                  <FaBriefcase className="text-primary" />
                  <span>{user.role}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-primary" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-base-200 p-8 rounded-3xl shadow-xl border border-base-300">
            <h3 className="text-xl font-bold text-neutral mb-6">Application Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 bg-base-100 p-4 rounded-xl border border-base-300">
                <div className="bg-secondary/20 p-3 rounded-lg text-secondary">
                  <FaMoneyBillWave className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-neutral opacity-60">Base Currency</p>
                  <p className="text-lg font-bold text-neutral">{user.settings.currency}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-base-100 p-4 rounded-xl border border-base-300">
                <div className="bg-accent/20 p-3 rounded-lg text-accent">
                  <FaPercent className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-neutral opacity-60">Estimated Tax Rate</p>
                  <p className="text-lg font-bold text-neutral">{user.settings.taxRatePercentage}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-base-200 p-8 rounded-3xl shadow-xl border border-base-300 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <FaShieldAlt className="text-2xl text-warning" />
              <h3 className="text-xl font-bold text-neutral">Access Control</h3>
            </div>
            
            <p className="text-neutral opacity-70 mb-8 text-sm leading-relaxed">
              You are currently viewing the application as <strong className="text-neutral opacity-100 uppercase">{auth.role}</strong>. This dictates your ability to add, edit, or delete financial records.
            </p>

            <div className="mt-auto bg-base-100 p-6 rounded-2xl border border-base-300 text-center space-y-4">
              <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold border ${auth.role === 'admin' ? 'bg-error/10 text-error border-error/30' : 'bg-info/10 text-info border-info/30'}`}>
                Current Role: {auth.role.toUpperCase()}
              </div>
              
              <button 
                onClick={handleRoleToggle}
                className="btn w-full bg-base-300 hover:bg-base-300/80 text-neutral border-none shadow-sm flex items-center justify-center gap-2"
              >
                <FaExchangeAlt />
                Switch to {auth.role === 'admin' ? 'User' : 'Admin'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default User;