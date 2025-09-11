import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaTools,
  FaUser,
  FaCar,
  FaPhone,
  FaEnvelope,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
  FaClock,
  FaDollarSign,
  FaCalendarAlt,
  FaWrench,
  FaClipboardList
} from 'react-icons/fa';
import axios from 'axios';

const WorkOrders = () => {
  const [workOrders, setWorkOrders] = useState([]);
  const [filteredWorkOrders, setFilteredWorkOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [mechanicFilter, setMechanicFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingWorkOrder, setEditingWorkOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [formData, setFormData] = useState({
    workOrderNumber: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    vehicle: '',
    plateNumber: '',
    issueDescription: '',
    priority: 'medium',
    assignedMechanic: '',
    estimatedHours: '',
    estimatedCost: '',
    status: 'pending',
    notes: ''
  });

  // Mock data for demonstration
  const mockWorkOrders = [
    {
      id: 1,
      workOrderNumber: 'WO-2024-001',
      customerName: 'John Smith',
      customerEmail: 'john@email.com',
      customerPhone: '+1-555-0123',
      vehicle: '2020 Honda Civic',
      plateNumber: 'ABC-123',
      issueDescription: 'Engine knocking noise, needs diagnostic',
      priority: 'high',
      assignedMechanic: 'Mike Johnson',
      estimatedHours: 4,
      estimatedCost: 350,
      status: 'in-progress',
      notes: 'Customer reported noise getting worse',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: 2,
      workOrderNumber: 'WO-2024-002',
      customerName: 'Sarah Wilson',
      customerEmail: 'sarah@email.com',
      customerPhone: '+1-555-0456',
      vehicle: '2019 Toyota Camry',
      plateNumber: 'XYZ-789',
      issueDescription: 'Brake pads replacement',
      priority: 'medium',
      assignedMechanic: 'David Brown',
      estimatedHours: 2,
      estimatedCost: 180,
      status: 'completed',
      notes: 'Front brake pads worn out',
      createdAt: '2024-01-14',
      updatedAt: '2024-01-15'
    },
    {
      id: 3,
      workOrderNumber: 'WO-2024-003',
      customerName: 'Robert Davis',
      customerEmail: 'robert@email.com',
      customerPhone: '+1-555-0789',
      vehicle: '2021 Ford F-150',
      plateNumber: 'DEF-456',
      issueDescription: 'Oil change and tire rotation',
      priority: 'low',
      assignedMechanic: 'Mike Johnson',
      estimatedHours: 1,
      estimatedCost: 85,
      status: 'pending',
      notes: 'Regular maintenance service',
      createdAt: '2024-01-16',
      updatedAt: '2024-01-16'
    }
  ];

  useEffect(() => {
    // Load work orders (using mock data for now)
    setWorkOrders(mockWorkOrders);
    setFilteredWorkOrders(mockWorkOrders);
  }, []);

  useEffect(() => {
    // Filter work orders based on all criteria
    let filtered = workOrders.filter(workOrder => {
      const matchesSearch = 
        workOrder.workOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workOrder.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workOrder.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workOrder.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workOrder.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workOrder.issueDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workOrder.assignedMechanic.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || workOrder.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || workOrder.priority === priorityFilter;
      const matchesMechanic = mechanicFilter === 'all' || workOrder.assignedMechanic === mechanicFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesMechanic;
    });
    
    setFilteredWorkOrders(filtered);
  }, [workOrders, searchTerm, statusFilter, priorityFilter, mechanicFilter]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <FaClock />, text: 'Pending' },
      'in-progress': { color: 'bg-blue-100 text-blue-800', icon: <FaTools />, text: 'In Progress' },
      completed: { color: 'bg-green-100 text-green-800', icon: <FaCheckCircle />, text: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: <FaTimesCircle />, text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { color: 'bg-green-100 text-green-800', text: 'Low' },
      medium: { color: 'bg-yellow-100 text-yellow-800', text: 'Medium' },
      high: { color: 'bg-red-100 text-red-800', text: 'High' }
    };
    
    const config = priorityConfig[priority] || priorityConfig.medium;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const handleEdit = (workOrder) => {
    setEditingWorkOrder(workOrder);
    setFormData({
      workOrderNumber: workOrder.workOrderNumber,
      customerName: workOrder.customerName,
      customerEmail: workOrder.customerEmail,
      customerPhone: workOrder.customerPhone,
      vehicle: workOrder.vehicle,
      plateNumber: workOrder.plateNumber,
      issueDescription: workOrder.issueDescription,
      priority: workOrder.priority,
      assignedMechanic: workOrder.assignedMechanic,
      estimatedHours: workOrder.estimatedHours,
      estimatedCost: workOrder.estimatedCost,
      status: workOrder.status,
      notes: workOrder.notes
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this work order?')) {
      setWorkOrders(workOrders.filter(wo => wo.id !== id));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setWorkOrders(workOrders.map(wo => 
      wo.id === id ? { ...wo, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] } : wo
    ));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateWorkOrderNumber = () => {
    const year = new Date().getFullYear();
    const count = workOrders.length + 1;
    return `WO-${year}-${count.toString().padStart(3, '0')}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingWorkOrder) {
      // Update existing work order
      const updatedWorkOrder = {
        ...editingWorkOrder,
        ...formData,
        id: editingWorkOrder.id,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setWorkOrders(workOrders.map(wo => 
        wo.id === editingWorkOrder.id ? updatedWorkOrder : wo
      ));
    } else {
      // Create new work order
      const newWorkOrder = {
        ...formData,
        id: Date.now(),
        workOrderNumber: formData.workOrderNumber || generateWorkOrderNumber(),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setWorkOrders([...workOrders, newWorkOrder]);
    }
    
    // Reset form and close modal
    setFormData({
      workOrderNumber: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      vehicle: '',
      plateNumber: '',
      issueDescription: '',
      priority: 'medium',
      assignedMechanic: '',
      estimatedHours: '',
      estimatedCost: '',
      status: 'pending',
      notes: ''
    });
    setEditingWorkOrder(null);
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingWorkOrder(null);
    setFormData({
      workOrderNumber: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      vehicle: '',
      plateNumber: '',
      issueDescription: '',
      priority: 'medium',
      assignedMechanic: '',
      estimatedHours: '',
      estimatedCost: '',
      status: 'pending',
      notes: ''
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setMechanicFilter('all');
  };

  const getUniqueMechanics = () => {
    const mechanics = [...new Set(workOrders.map(wo => wo.assignedMechanic))];
    return mechanics;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Work Orders</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <FaPlus className="mr-2" />
          New Work Order
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search work orders..."
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
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg flex items-center transition-colors"
              >
                <FaFilter className="mr-2" />
                More Filters
              </button>
              <button 
                onClick={clearFilters}
                className="px-4 py-2 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-700 dark:text-red-300 rounded-lg flex items-center transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
          
          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Filter by Priority
                  </label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Filter by Mechanic
                  </label>
                  <select
                    value={mechanicFilter}
                    onChange={(e) => setMechanicFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Mechanics</option>
                    {getUniqueMechanics().map(mechanic => (
                      <option key={mechanic} value={mechanic}>{mechanic}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Work Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Work Order #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mechanic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
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
              {filteredWorkOrders.map((workOrder) => (
                <tr key={workOrder.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {workOrder.workOrderNumber}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {workOrder.createdAt}
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
                          {workOrder.customerName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <FaEnvelope className="h-3 w-3 mr-1" />
                          {workOrder.customerEmail}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <FaPhone className="h-3 w-3 mr-1" />
                          {workOrder.customerPhone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaCar className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {workOrder.vehicle}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {workOrder.plateNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                      {workOrder.issueDescription}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Est. {workOrder.estimatedHours}h
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPriorityBadge(workOrder.priority)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{workOrder.assignedMechanic}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                      <FaDollarSign className="h-3 w-3 mr-1" />
                      {workOrder.estimatedCost}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(workOrder.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(workOrder)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                        title="Edit Work Order"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(workOrder.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                        title="Delete Work Order"
                      >
                        <FaTrash />
                      </button>
                      <button 
                        onClick={() => handleStatusChange(workOrder.id, 
                          workOrder.status === 'pending' ? 'in-progress' : 
                          workOrder.status === 'in-progress' ? 'completed' : 'pending'
                        )}
                        className={`p-1 rounded transition-colors ${
                          workOrder.status === 'pending' ? 'text-yellow-600 hover:text-yellow-900 hover:bg-yellow-100 dark:hover:bg-yellow-900' :
                          workOrder.status === 'in-progress' ? 'text-green-600 hover:text-green-900 hover:bg-green-100 dark:hover:bg-green-900' :
                          'text-blue-600 hover:text-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900'
                        }`}
                        title={`${workOrder.status === 'pending' ? 'Start' : workOrder.status === 'in-progress' ? 'Complete' : 'Reset'} Work Order`}
                      >
                        {workOrder.status === 'pending' ? <FaTools /> : 
                         workOrder.status === 'in-progress' ? <FaCheckCircle /> : <FaClock />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredWorkOrders.length === 0 && (
        <div className="text-center py-12">
          <FaClipboardList className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No work orders found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || mechanicFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating a new work order.'
            }
          </p>
        </div>
      )}

      {/* Modal for Add/Edit Work Order */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-6 border border-gray-200 dark:border-gray-700 w-full max-w-4xl shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {editingWorkOrder ? 'Edit Work Order' : 'New Work Order'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Work Order Number</label>
                    <input
                      type="text"
                      name="workOrderNumber"
                      value={formData.workOrderNumber}
                      onChange={handleInputChange}
                      placeholder="Auto-generated if empty"
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority *</label>
                    <select 
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vehicle *</label>
                    <input
                      type="text"
                      name="vehicle"
                      value={formData.vehicle}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Plate Number</label>
                    <input
                      type="text"
                      name="plateNumber"
                      value={formData.plateNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Issue Description *</label>
                  <textarea
                    name="issueDescription"
                    value={formData.issueDescription}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assigned Mechanic *</label>
                    <select 
                      name="assignedMechanic"
                      value={formData.assignedMechanic}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Mechanic</option>
                      <option value="Mike Johnson">Mike Johnson</option>
                      <option value="David Brown">David Brown</option>
                      <option value="Sarah Wilson">Sarah Wilson</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estimated Hours</label>
                    <input
                      type="number"
                      name="estimatedHours"
                      value={formData.estimatedHours}
                      onChange={handleInputChange}
                      min="0"
                      step="0.5"
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estimated Cost</label>
                    <input
                      type="number"
                      name="estimatedCost"
                      value={formData.estimatedCost}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
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
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
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
                    {editingWorkOrder ? 'Update Work Order' : 'Create Work Order'}
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

export default WorkOrders;