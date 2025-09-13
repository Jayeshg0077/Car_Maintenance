import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaHome,
  FaUsers,
  FaCalendarAlt,
  FaClipboardList,
  FaTools,
  FaBoxes,
  FaFileInvoiceDollar,
  FaUserTie,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa';

const Sidebar = ({ darkMode }) => {
  const menuItems = [
    { title: 'Dashboard', icon: <FaHome />, path: '/' },
    { title: 'Customers', icon: <FaUsers />, path: '/customers' },
    { title: 'Appointments', icon: <FaCalendarAlt />, path: '/appointments' },
    { title: 'Work Orders', icon: <FaClipboardList />, path: '/work-orders' },
    { title: 'Services', icon: <FaTools />, path: '/services' },
    { title: 'Inventory', icon: <FaBoxes />, path: '/inventory' },
    { title: 'Billing', icon: <FaFileInvoiceDollar />, path: '/billing' },
    { title: 'Staff', icon: <FaUserTie />, path: '/staff' },
    { title: 'Settings', icon: <FaCog />, path: '/settings' },
  ];

  return (
    <div className={`w-56 h-screen fixed overflow-y-auto transition-all duration-300 ease-in-out ${darkMode ? 'bg-gray-800' : 'bg-gray-900'}`}>
      <div className="flex items-center justify-center py-6 border-b border-gray-700">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-full hover:scale-105 transition-transform duration-300 border-2 border-white/20">
          <img
            src={process.env.PUBLIC_URL + '/logo.png'}
            alt="AutoCare CRM"
            className="h-16 w-16 object-contain"
            onError={(e) => {
              console.log('Logo failed to load:', e.target.src);
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
            onLoad={() => {
              console.log('Logo loaded successfully');
            }}
          />
          <div className="h-16 w-16 flex items-center justify-center text-white font-bold text-xl" style={{display: 'none'}}>
            AC
          </div>
        </div>
      </div>
      <nav className="mt-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.title}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <span className="w-5 h-5 mr-3 flex items-center justify-center">{item.icon}</span>
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
          <li className="mt-6 px-3 py-2">
            <div className="border-t border-gray-700 pt-4">
              <button className="flex w-full items-center px-3 py-2.5 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors">
                <span className="w-5 h-5 mr-3 flex items-center justify-center"><FaSignOutAlt /></span>
                <span>Logout</span>
              </button>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;