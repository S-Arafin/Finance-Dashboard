import React from 'react';
import { Link } from 'react-router';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="bg-base-200 p-8 md:p-12 rounded-3xl shadow-xl border border-base-300 max-w-lg w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-error/10 p-6 rounded-full text-error">
            <FaExclamationTriangle className="text-6xl" />
          </div>
        </div>
        
        <div>
          <h1 className="text-6xl font-black text-neutral mb-4 tracking-tighter">404</h1>
          <h2 className="text-2xl font-bold text-neutral mb-2">Page Not Found</h2>
          <p className="text-neutral opacity-70 leading-relaxed">
            The page you are looking for doesn't exist, has been removed, or you might not have the correct permissions to view it.
          </p>
        </div>

        <div className="pt-4 flex justify-center">
          <Link 
            to="/" 
            className="btn bg-primary hover:bg-primary/90 border-none text-white shadow-lg shadow-primary/30 px-8 rounded-xl flex items-center gap-2"
          >
            <FaHome className="text-lg" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;