import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaTools,
  FaDollarSign,
  FaClock,
  FaTag,
  FaCog,
  FaWrench,
  FaCar,
  FaOilCan,
  FaBolt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaCircle
} from 'react-icons/fa';
import axios from 'axios';

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    basePrice: '',
    estimatedDuration: '',
    status: 'active',
    isPopular: false,
    requirements: '',
    notes: ''
  });

  // Mock data for demonstration
  const mockServices = [
    {
      id: 1,
      name: 'Oil Change',
      description: 'Complete oil change service with filter replacement',
      category: 'Maintenance',
      basePrice: 45.00,
      estimatedDuration: 30,
      status: 'active',
      isPopular: true,
      requirements: 'Vehicle must be cool, bring oil if preferred',
      notes: 'Includes 5W-30 synthetic oil',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Brake Pad Replacement',
      description: 'Replace front and rear brake pads with inspection',
      category: 'Brakes',
      basePrice: 120.00,
      estimatedDuration: 90,
      status: 'active',
      isPopular: true,
      requirements: 'Vehicle must be on level ground',
      notes: 'Includes brake fluid check',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: 3,
      name: 'Engine Diagnostic',
      description: 'Complete engine diagnostic with computer scan',
      category: 'Diagnostics',
      basePrice: 85.00,
      estimatedDuration: 60,
      status: 'active',
      isPopular: false,
      requirements: 'Vehicle must be running',
      notes: 'Includes detailed report',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: 4,
      name: 'Tire Rotation',
      description: 'Rotate all four tires and check tire pressure',
      category: 'Tires',
      basePrice: 25.00,
      estimatedDuration: 20,
      status: 'active',
      isPopular: false,
      requirements: 'Tires must be properly inflated',
      notes: 'Includes tire pressure check',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: 5,
      name: 'AC System Service',
      description: 'AC system inspection and refrigerant recharge',
      category: 'HVAC',
      basePrice: 95.00,
      estimatedDuration: 45,
      status: 'active',
      isPopular: false,
      requirements: 'Vehicle must be running',
      notes: 'Includes leak test',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: 6,
      name: 'Transmission Service',
      description: 'Transmission fluid change and filter replacement',
      category: 'Transmission',
      basePrice: 150.00,
      estimatedDuration: 120,
      status: 'inactive',
      isPopular: false,
      requirements: 'Vehicle must be cool',
      notes: 'High-end service',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    }
  ];

  const serviceCategories = [
    'Maintenance',
    'Brakes',
    'Diagnostics',
    'Tires',
    'HVAC',
    'Transmission',
    'Engine',
    'Electrical',
    'Suspension',
    'Exhaust'
  ];

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Maintenance': <FaOilCan className="h-5 w-5" />,
      'Brakes': <FaExclamationTriangle className="h-5 w-5" />,
      'Diagnostics': <FaBolt className="h-5 w-5" />,
      'Tires': <FaCircle className="h-5 w-5" />,
      'HVAC': <FaCog className="h-5 w-5" />,
      'Transmission': <FaWrench className="h-5 w-5" />,
      'Engine': <FaCar className="h-5 w-5" />,
      'Electrical': <FaBolt className="h-5 w-5" />,
      'Suspension': <FaTools className="h-5 w-5" />,
      'Exhaust': <FaWrench className="h-5 w-5" />
    };
    return iconMap[category] || <FaTools className="h-5 w-5" />;
  };

  useEffect(() => {
    // Load services (using mock data for now)
    setServices(mockServices);
    setFilteredServices(mockServices);
  }, []);

  useEffect(() => {
    // Filter services based on all criteria
    let filtered = services.filter(service => {
      const matchesSearch = 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.requirements.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
    
    setFilteredServices(filtered);
  }, [services, searchTerm, categoryFilter, statusFilter]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: <FaCheckCircle />, text: 'Active' },
      inactive: { color: 'bg-red-100 text-red-800', icon: <FaTimesCircle />, text: 'Inactive' }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      basePrice: service.basePrice,
      estimatedDuration: service.estimatedDuration,
      status: service.status,
      isPopular: service.isPopular,
      requirements: service.requirements,
      notes: service.notes
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(service => service.id !== id));
    }
  };

  const handleStatusToggle = (id) => {
    setServices(services.map(service => 
      service.id === id ? { 
        ...service, 
        status: service.status === 'active' ? 'inactive' : 'active',
        updatedAt: new Date().toISOString().split('T')[0]
      } : service
    ));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingService) {
      // Update existing service
      const updatedService = {
        ...editingService,
        ...formData,
        id: editingService.id,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setServices(services.map(service => 
        service.id === editingService.id ? updatedService : service
      ));
    } else {
      // Create new service
      const newService = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setServices([...services, newService]);
    }
    
    // Reset form and close modal
    setFormData({
      name: '',
      description: '',
      category: '',
      basePrice: '',
      estimatedDuration: '',
      status: 'active',
      isPopular: false,
      requirements: '',
      notes: ''
    });
    setEditingService(null);
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      basePrice: '',
      estimatedDuration: '',
      status: 'active',
      isPopular: false,
      requirements: '',
      notes: ''
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setStatusFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Services</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <FaPlus className="mr-2" />
          New Service
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <FaTools className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Services</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{services.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <FaCheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Services</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {services.filter(s => s.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <FaTag className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Popular Services</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {services.filter(s => s.isPopular).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <FaDollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Price</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${(services.reduce((sum, s) => sum + s.basePrice, 0) / services.length || 0).toFixed(0)}
              </p>
            </div>
          </div>
        </div>
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
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                {serviceCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-3">
                  {getCategoryIcon(service.category)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{service.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{service.category}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {service.isPopular && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    <FaTag className="h-3 w-3 mr-1" />
                    Popular
                  </span>
                )}
                {getStatusBadge(service.status)}
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4 overflow-hidden" style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>{service.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Price:</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FaDollarSign className="h-4 w-4 mr-1" />
                  {service.basePrice}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Duration:</span>
                <span className="text-sm text-gray-900 dark:text-white flex items-center">
                  <FaClock className="h-4 w-4 mr-1" />
                  {service.estimatedDuration} min
                </span>
              </div>
            </div>
            
            {service.requirements && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Requirements:</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{service.requirements}</p>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                  title="Edit Service"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                  title="Delete Service"
                >
                  <FaTrash />
                </button>
                <button
                  onClick={() => handleStatusToggle(service.id)}
                  className={`p-2 rounded transition-colors ${
                    service.status === 'active' 
                      ? 'text-red-600 hover:text-red-900 hover:bg-red-100 dark:hover:bg-red-900' 
                      : 'text-green-600 hover:text-green-900 hover:bg-green-100 dark:hover:bg-green-900'
                  }`}
                  title={`${service.status === 'active' ? 'Deactivate' : 'Activate'} Service`}
                >
                  {service.status === 'active' ? <FaTimesCircle /> : <FaCheckCircle />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <FaTools className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No services found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating a new service.'
            }
          </p>
        </div>
      )}

      {/* Modal for Add/Edit Service */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-6 border border-gray-200 dark:border-gray-700 w-full max-w-2xl shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {editingService ? 'Edit Service' : 'New Service'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Service Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category *</label>
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Category</option>
                      {serviceCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Base Price *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaDollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="basePrice"
                        value={formData.basePrice}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="mt-1 block w-full pl-10 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estimated Duration (minutes) *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaClock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="estimatedDuration"
                        value={formData.estimatedDuration}
                        onChange={handleInputChange}
                        required
                        min="1"
                        className="mt-1 block w-full pl-10 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                    <select 
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isPopular"
                      checked={formData.isPopular}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Mark as Popular Service
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Requirements</label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Any special requirements for this service..."
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Additional notes about this service..."
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
                    {editingService ? 'Update Service' : 'Create Service'}
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

export default Services;