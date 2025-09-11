import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { FaMoon, FaSun } from 'react-icons/fa';

const Layout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar darkMode={darkMode} />
      <div className="flex flex-col flex-1 ml-56">
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10 h-16 flex items-center px-6">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white"></h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
              </button>
              <div className="relative">
                <div className="flex items-center">
                  <img
                    className="h-8 w-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User avatar"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200">Admin User</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;