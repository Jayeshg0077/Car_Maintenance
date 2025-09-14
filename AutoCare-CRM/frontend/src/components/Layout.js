import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 ml-56">
        <header className="bg-white shadow-sm z-10 h-16 flex items-center px-6">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-lg font-semibold text-gray-800"></h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border-2 border-gray-200">
                    <span className="text-white text-sm font-bold">AU</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;