import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaArrowUp, 
  FaArrowDown, 
  FaExclamationTriangle, 
  FaCalendarCheck, 
  FaClock, 
  FaTools, 
  FaUsers, 
  FaFileInvoiceDollar,
  FaExclamationCircle,
  FaChevronRight
} from 'react-icons/fa';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 156,
    totalCustomersChange: 5.2,
    monthlyRevenue: 45750,
    monthlyRevenueChange: -2.4,
    activeWorkOrders: 18,
    activeWorkOrdersChange: 12.5,
    todayAppointments: 8,
    pendingAppointments: 3
  });
  
  const [todaysAppointments, setTodaysAppointments] = useState([
    { id: 1, customer: 'John Smith', vehicle: 'Honda Civic (ABC-123)', time: '09:30 AM', status: 'confirmed' },
    { id: 2, customer: 'Sarah Johnson', vehicle: 'Toyota Camry (XYZ-789)', time: '10:45 AM', status: 'in-progress' },
    { id: 3, customer: 'Michael Brown', vehicle: 'Ford F-150 (DEF-456)', time: '11:15 AM', status: 'pending' },
    { id: 4, customer: 'Emily Davis', vehicle: 'Chevrolet Malibu (GHI-789)', time: '01:30 PM', status: 'confirmed' },
    { id: 5, customer: 'Robert Wilson', vehicle: 'Nissan Altima (JKL-012)', time: '03:00 PM', status: 'pending' }
  ]);

  const [urgentIssues, setUrgentIssues] = useState([
    { id: 1, title: 'Brake fluid leak on vehicle #JKL-012', priority: 'high', timestamp: '2 hours ago' },
    { id: 2, title: 'Parts shipment delayed for work order #WO-2025-089', priority: 'medium', timestamp: '3 hours ago' },
    { id: 3, title: 'Customer complaint: Invoice #INV-2025-156', priority: 'high', timestamp: '5 hours ago' },
    { id: 4, title: 'Low inventory alert: Oil filters (5 remaining)', priority: 'medium', timestamp: '1 day ago' },
    { id: 5, title: 'Scheduled maintenance for diagnostic machine', priority: 'low', timestamp: '2 days ago' }
  ]);

  const [chartData, setChartData] = useState([
    { name: 'Jan', appointments: 12 },
    { name: 'Feb', appointments: 19 },
    { name: 'Mar', appointments: 15 },
    { name: 'Apr', appointments: 20 },
    { name: 'May', appointments: 25 },
    { name: 'Jun', appointments: 30 },
    { name: 'Jul', appointments: 28 },
    { name: 'Aug', appointments: 32 },
    { name: 'Sep', appointments: 24 },
    { name: 'Oct', appointments: 18 },
    { name: 'Nov', appointments: 22 },
    { name: 'Dec', appointments: 24 }
  ]);

  useEffect(() => {
    // In a real app, you would fetch this from your API
    // Uncomment this when backend is ready
    /*
    const fetchDashboardData = async () => {
      try {
        const statsResponse = await axios.get('http://localhost:9090/api/dashboard/stats');
        const appointmentsResponse = await axios.get('http://localhost:9090/api/appointments/today');
        const chartResponse = await axios.get('http://localhost:9090/api/dashboard/appointments-chart');
        
        setStats(statsResponse.data);
        setTodaysAppointments(appointmentsResponse.data);
        
        // Transform chart data for recharts
        const transformedChartData = chartResponse.data.labels.map((month, index) => ({
          name: month,
          appointments: chartResponse.data.data[index]
        }));
        setChartData(transformedChartData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
    */
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <FaExclamationCircle className="text-red-500" />;
      case 'medium':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'low':
        return <FaExclamationTriangle className="text-blue-500" />;
      default:
        return <FaExclamationTriangle className="text-gray-500" />;
    }
  };

  const getChangeIndicator = (value) => {
    if (value > 0) {
      return <span className="flex items-center text-green-600 text-sm"><FaArrowUp className="mr-1 h-3 w-3" />{value}%</span>;
    } else if (value < 0) {
      return <span className="flex items-center text-red-600 text-sm"><FaArrowDown className="mr-1 h-3 w-3" />{Math.abs(value)}%</span>;
    } else {
      return <span className="text-gray-500 text-sm">0%</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <div className="flex space-x-2">
          <button className="bg-primary hover:bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center text-sm font-medium transition-colors">
            <FaCalendarCheck className="mr-2 h-4 w-4" /> Today's Overview
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 transition-all hover:shadow-lg">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
              <FaUsers className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Customers</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalCustomers}</p>
              <div className="mt-1">
                {getChangeIndicator(stats.totalCustomersChange)}
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 transition-all hover:shadow-lg">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4">
              <FaFileInvoiceDollar className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">${stats.monthlyRevenue.toLocaleString()}</p>
              <div className="mt-1">
                {getChangeIndicator(stats.monthlyRevenueChange)}
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 transition-all hover:shadow-lg">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-4">
              <FaTools className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Work Orders</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.activeWorkOrders}</p>
              <div className="mt-1">
                {getChangeIndicator(stats.activeWorkOrdersChange)}
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs last week</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 transition-all hover:shadow-lg">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mr-4">
              <FaClock className="h-6 w-6 text-amber-600 dark:text-amber-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Today's Appointments</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.todayAppointments}</p>
              <div className="mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                  {stats.pendingAppointments} pending
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Today's Appointments Section */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Today's Appointments</h2>
            <span className="text-sm text-primary dark:text-blue-400 hover:underline cursor-pointer flex items-center">
              View All <FaChevronRight className="ml-1 h-3 w-3" />
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vehicle</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {todaysAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">{appointment.customer}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{appointment.vehicle}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{appointment.time}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Urgent Issues Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Urgent Issues</h2>
            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
              {urgentIssues.filter(issue => issue.priority === 'high').length}
            </span>
          </div>
          <div className="space-y-3">
            {urgentIssues.map((issue) => (
              <div key={issue.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    {getPriorityIcon(issue.priority)}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">{issue.title}</p>
                      <span className={`ml-2 px-2 py-0.5 text-xs rounded font-medium ${getPriorityBadgeClass(issue.priority)}`}>
                        {issue.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{issue.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            View All Issues
          </button>
        </div>
      </div>
      
      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Monthly Appointments</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickLine={{ stroke: '#e5e7eb' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickLine={{ stroke: '#e5e7eb' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="appointments" name="Appointments" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;