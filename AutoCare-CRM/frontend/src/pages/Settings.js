import React, { useState } from 'react';
import { 
  FaBuilding, 
  FaBell, 
  FaBusinessTime, 
  FaMoneyBillWave, 
  FaServer, 
  FaBolt, 
  FaPaintBrush 
} from 'react-icons/fa';

const SettingsCard = ({ title, icon, description }) => {
  return (
    <div className="card hover:border-primary hover:border cursor-pointer">
      <div className="flex items-center mb-4">
        <div className="p-3 bg-blue-100 rounded-lg mr-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Settings = () => {
  const settingsOptions = [
    {
      title: "Company Info",
      icon: <FaBuilding className="text-primary" size={20} />,
      description: "Manage your company details, address, and contact information"
    },
    {
      title: "Notifications",
      icon: <FaBell className="text-primary" size={20} />,
      description: "Configure email and system notifications for appointments and reminders"
    },
    {
      title: "Business Settings",
      icon: <FaBusinessTime className="text-primary" size={20} />,
      description: "Set business hours, holidays, and service scheduling options"
    },
    {
      title: "Billing & Pricing",
      icon: <FaMoneyBillWave className="text-primary" size={20} />,
      description: "Manage service rates, taxes, discounts, and payment methods"
    },
    {
      title: "System Status",
      icon: <FaServer className="text-primary" size={20} />,
      description: "View system health, database backups, and maintenance options"
    },
    {
      title: "Quick Actions",
      icon: <FaBolt className="text-primary" size={20} />,
      description: "Customize quick actions and shortcuts for common tasks"
    },
    {
      title: "Appearance",
      icon: <FaPaintBrush className="text-primary" size={20} />,
      description: "Customize the look and feel of your AutoCare CRM dashboard"
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsOptions.map((option, index) => (
          <SettingsCard 
            key={index}
            title={option.title}
            icon={option.icon}
            description={option.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Settings;
