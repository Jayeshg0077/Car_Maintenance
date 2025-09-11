import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaFileInvoiceDollar,
  FaDollarSign,
  FaCreditCard,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCalendarAlt,
  FaUser,
  FaCar,
  FaPhone,
  FaEnvelope,
  FaPrint,
  FaDownload,
  FaChartLine,
  FaChartPie,
  FaArrowUp,
  FaArrowDown,
  FaReceipt,
  FaWallet,
  FaHandHoldingUsd
} from 'react-icons/fa';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import axios from 'axios';

const Billing = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('invoices');
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    vehicle: '',
    services: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    paymentMethod: '',
    status: 'pending',
    dueDate: '',
    notes: ''
  });

  // Mock data for demonstration
  const mockInvoices = [
    {
      id: 1,
      invoiceNumber: 'INV-2024-001',
      customerName: 'John Smith',
      customerEmail: 'john@email.com',
      customerPhone: '+1-555-0123',
      vehicle: '2020 Honda Civic',
      services: [
        { name: 'Oil Change', price: 45.00, quantity: 1 },
        { name: 'Brake Inspection', price: 25.00, quantity: 1 }
      ],
      subtotal: 70.00,
      tax: 5.60,
      total: 75.60,
      paymentMethod: 'credit-card',
      status: 'paid',
      dueDate: '2024-01-20',
      paidDate: '2024-01-18',
      createdAt: '2024-01-15',
      notes: 'Regular maintenance service'
    },
    {
      id: 2,
      invoiceNumber: 'INV-2024-002',
      customerName: 'Sarah Wilson',
      customerEmail: 'sarah@email.com',
      customerPhone: '+1-555-0456',
      vehicle: '2019 Toyota Camry',
      services: [
        { name: 'Engine Diagnostic', price: 85.00, quantity: 1 },
        { name: 'Spark Plugs Replacement', price: 120.00, quantity: 1 }
      ],
      subtotal: 205.00,
      tax: 16.40,
      total: 221.40,
      paymentMethod: 'cash',
      status: 'overdue',
      dueDate: '2024-01-10',
      createdAt: '2024-01-05',
      notes: 'Engine check light was on'
    },
    {
      id: 3,
      invoiceNumber: 'INV-2024-003',
      customerName: 'Robert Davis',
      customerEmail: 'robert@email.com',
      customerPhone: '+1-555-0789',
      vehicle: '2021 Ford F-150',
      services: [
        { name: 'Transmission Service', price: 150.00, quantity: 1 },
        { name: 'Air Filter Replacement', price: 35.00, quantity: 1 }
      ],
      subtotal: 185.00,
      tax: 14.80,
      total: 199.80,
      paymentMethod: 'bank-transfer',
      status: 'pending',
      dueDate: '2024-01-25',
      createdAt: '2024-01-20',
      notes: 'Transmission fluid change'
    }
  ];

  const paymentMethods = [
    { value: 'credit-card', label: 'Credit Card', icon: <FaCreditCard /> },
    { value: 'cash', label: 'Cash', icon: <FaMoneyBillWave /> },
    { value: 'bank-transfer', label: 'Bank Transfer', icon: <FaWallet /> },
    { value: 'check', label: 'Check', icon: <FaReceipt /> }
  ];

  useEffect(() => {
    // Load invoices (using mock data for now)
    setInvoices(mockInvoices);
    setFilteredInvoices(mockInvoices);
  }, []);

  useEffect(() => {
    // Filter invoices based on all criteria
    let filtered = invoices.filter(invoice => {
      const matchesSearch = 
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.vehicle.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      const matchesPaymentMethod = paymentMethodFilter === 'all' || invoice.paymentMethod === paymentMethodFilter;
      
      return matchesSearch && matchesStatus && matchesPaymentMethod;
    });
    
    setFilteredInvoices(filtered);
  }, [invoices, searchTerm, statusFilter, paymentMethodFilter]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { color: 'bg-green-100 text-green-800', icon: <FaCheckCircle />, text: 'Paid' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <FaClock />, text: 'Pending' },
      overdue: { color: 'bg-red-100 text-red-800', icon: <FaExclamationTriangle />, text: 'Overdue' },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: <FaTimesCircle />, text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  const getPaymentMethodIcon = (method) => {
    const methodConfig = paymentMethods.find(m => m.value === method);
    return methodConfig ? methodConfig.icon : <FaDollarSign />;
  };

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      invoiceNumber: invoice.invoiceNumber,
      customerName: invoice.customerName,
      customerEmail: invoice.customerEmail,
      customerPhone: invoice.customerPhone,
      vehicle: invoice.vehicle,
      services: invoice.services,
      subtotal: invoice.subtotal,
      tax: invoice.tax,
      total: invoice.total,
      paymentMethod: invoice.paymentMethod,
      status: invoice.status,
      dueDate: invoice.dueDate,
      notes: invoice.notes
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(invoices.filter(invoice => invoice.id !== id));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === id ? { 
        ...invoice, 
        status: newStatus,
        paidDate: newStatus === 'paid' ? new Date().toISOString().split('T')[0] : null
      } : invoice
    ));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const count = invoices.length + 1;
    return `INV-${year}-${count.toString().padStart(3, '0')}`;
  };

  const calculateTotals = (services) => {
    const subtotal = services.reduce((sum, service) => sum + (service.price * service.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingInvoice) {
      // Update existing invoice
      const updatedInvoice = {
        ...editingInvoice,
        ...formData,
        id: editingInvoice.id,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setInvoices(invoices.map(invoice => 
        invoice.id === editingInvoice.id ? updatedInvoice : invoice
      ));
    } else {
      // Create new invoice
      const newInvoice = {
        ...formData,
        id: Date.now(),
        invoiceNumber: formData.invoiceNumber || generateInvoiceNumber(),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setInvoices([...invoices, newInvoice]);
    }
    
    // Reset form and close modal
    setFormData({
      invoiceNumber: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      vehicle: '',
      services: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      paymentMethod: '',
      status: 'pending',
      dueDate: '',
      notes: ''
    });
    setEditingInvoice(null);
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingInvoice(null);
    setFormData({
      invoiceNumber: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      vehicle: '',
      services: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      paymentMethod: '',
      status: 'pending',
      dueDate: '',
      notes: ''
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPaymentMethodFilter('all');
  };

  // Analytics data
  const getTotalRevenue = () => {
    return invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  };

  const getPendingAmount = () => {
    return invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.total, 0);
  };

  const getOverdueAmount = () => {
    return invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0);
  };

  const getPaidInvoices = () => {
    return invoices.filter(inv => inv.status === 'paid').length;
  };

  const getRevenueChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      revenue: Math.floor(Math.random() * 5000) + 2000
    }));
  };

  const getPaymentMethodData = () => {
    const methods = {};
    invoices.forEach(invoice => {
      if (invoice.status === 'paid') {
        methods[invoice.paymentMethod] = (methods[invoice.paymentMethod] || 0) + 1;
      }
    });
    
    return Object.entries(methods).map(([method, count]) => ({
      name: paymentMethods.find(m => m.value === method)?.label || method,
      value: count
    }));
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Billing & Invoicing</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <FaPlus className="mr-2" />
          New Invoice
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('invoices')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'invoices'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <FaFileInvoiceDollar className="inline mr-2" />
              Invoices
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <FaChartLine className="inline mr-2" />
              Analytics
            </button>
          </nav>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <FaDollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${getTotalRevenue().toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <FaClock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Amount</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${getPendingAmount().toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
              <FaExclamationTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue Amount</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${getOverdueAmount().toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <FaCheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Paid Invoices</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{getPaidInvoices()}</p>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'invoices' && (
        <>
          {/* Filters and Search */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search invoices..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <select
                    value={paymentMethodFilter}
                    onChange={(e) => setPaymentMethodFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Payment Methods</option>
                    <option value="credit-card">Credit Card</option>
                    <option value="cash">Cash</option>
                    <option value="bank-transfer">Bank Transfer</option>
                    <option value="check">Check</option>
                  </select>
                  <button 
                    onClick={clearFilters}
                    className="px-4 py-2 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-700 dark:text-red-300 rounded-lg flex items-center transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {invoice.invoiceNumber}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {invoice.createdAt}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <FaUser className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {invoice.customerName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <FaEnvelope className="h-3 w-3 mr-1" />
                              {invoice.customerEmail}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <FaPhone className="h-3 w-3 mr-1" />
                              {invoice.customerPhone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaCar className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900 dark:text-white">
                            {invoice.vehicle}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                          <FaDollarSign className="h-3 w-3 mr-1" />
                          {invoice.total.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Tax: ${invoice.tax.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getPaymentMethodIcon(invoice.paymentMethod)}
                          <span className="ml-2 text-sm text-gray-900 dark:text-white">
                            {paymentMethods.find(m => m.value === invoice.paymentMethod)?.label || invoice.paymentMethod}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaCalendarAlt className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900 dark:text-white">
                            {invoice.dueDate}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(invoice.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(invoice)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                            title="Edit Invoice"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(invoice.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                            title="Delete Invoice"
                          >
                            <FaTrash />
                          </button>
                          <button
                            onClick={() => window.print()}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-100 dark:hover:bg-green-900 transition-colors"
                            title="Print Invoice"
                          >
                            <FaPrint />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getRevenueChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Payment Methods Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment Methods</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getPaymentMethodData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getPaymentMethodData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredInvoices.length === 0 && activeTab === 'invoices' && (
        <div className="text-center py-12">
          <FaFileInvoiceDollar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No invoices found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || statusFilter !== 'all' || paymentMethodFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating a new invoice.'
            }
          </p>
        </div>
      )}

      {/* Modal for Add/Edit Invoice */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-6 border border-gray-200 dark:border-gray-700 w-full max-w-4xl shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Invoice Number</label>
                    <input
                      type="text"
                      name="invoiceNumber"
                      value={formData.invoiceNumber}
                      onChange={handleInputChange}
                      placeholder="Auto-generated if empty"
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date *</label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Name *</label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Email</label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Phone</label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vehicle</label>
                    <input
                      type="text"
                      name="vehicle"
                      value={formData.vehicle}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method *</label>
                    <select 
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Payment Method</option>
                      {paymentMethods.map(method => (
                        <option key={method.value} value={method.value}>{method.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                    <select 
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  >
                    {editingInvoice ? 'Update Invoice' : 'Create Invoice'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;