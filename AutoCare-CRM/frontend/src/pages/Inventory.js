import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaBox,
  FaBoxes,
  FaDollarSign,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaTag,
  FaCog,
  FaWrench,
  FaCar,
  FaOilCan,
  FaBolt,
  FaCircle,
  FaMinus,
  FaArrowUp,
  FaArrowDown,
  FaWarehouse,
  FaShoppingCart,
  FaClipboardList,
  FaChartLine
} from 'react-icons/fa';
import axios from 'axios';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    partNumber: '',
    sku: '',
    quantity: '',
    minQuantity: '',
    maxQuantity: '',
    unitPrice: '',
    supplier: '',
    location: '',
    status: 'in-stock',
    notes: ''
  });

  // Mock data for demonstration
  const mockInventory = [
    {
      id: 1,
      name: 'Engine Oil Filter',
      description: 'High-quality oil filter for most vehicles',
      category: 'Filters',
      partNumber: 'OF-001',
      sku: 'SKU-OF001',
      quantity: 45,
      minQuantity: 10,
      maxQuantity: 100,
      unitPrice: 12.50,
      supplier: 'AutoParts Pro',
      location: 'A-1-15',
      status: 'in-stock',
      notes: 'Compatible with most Honda and Toyota models',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Brake Pads Set',
      description: 'Front brake pads for mid-size sedans',
      category: 'Brakes',
      partNumber: 'BP-002',
      sku: 'SKU-BP002',
      quantity: 8,
      minQuantity: 5,
      maxQuantity: 50,
      unitPrice: 45.00,
      supplier: 'Brake Masters',
      location: 'B-2-08',
      status: 'low-stock',
      notes: 'Ceramic brake pads with low dust',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: 3,
      name: 'Air Filter',
      description: 'Engine air filter for improved performance',
      category: 'Filters',
      partNumber: 'AF-003',
      sku: 'SKU-AF003',
      quantity: 0,
      minQuantity: 5,
      maxQuantity: 30,
      unitPrice: 18.75,
      supplier: 'Filter Solutions',
      location: 'A-1-20',
      status: 'out-of-stock',
      notes: 'High-flow air filter',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: 4,
      name: 'Spark Plugs Set',
      description: 'Iridium spark plugs for better ignition',
      category: 'Engine',
      partNumber: 'SP-004',
      sku: 'SKU-SP004',
      quantity: 25,
      minQuantity: 10,
      maxQuantity: 60,
      unitPrice: 35.00,
      supplier: 'Ignition Pro',
      location: 'C-3-12',
      status: 'in-stock',
      notes: 'Set of 4 spark plugs',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: 5,
      name: 'Windshield Wipers',
      description: 'All-weather windshield wiper blades',
      category: 'Exterior',
      partNumber: 'WW-005',
      sku: 'SKU-WW005',
      quantity: 15,
      minQuantity: 8,
      maxQuantity: 40,
      unitPrice: 22.50,
      supplier: 'Wiper World',
      location: 'D-4-05',
      status: 'in-stock',
      notes: 'Universal fit for most vehicles',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: 6,
      name: 'Transmission Fluid',
      description: 'Synthetic transmission fluid',
      category: 'Fluids',
      partNumber: 'TF-006',
      sku: 'SKU-TF006',
      quantity: 3,
      minQuantity: 5,
      maxQuantity: 25,
      unitPrice: 28.00,
      supplier: 'Fluid Dynamics',
      location: 'E-5-18',
      status: 'low-stock',
      notes: '1-gallon container',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    }
  ];

  const inventoryCategories = [
    'Filters',
    'Brakes',
    'Engine',
    'Exterior',
    'Fluids',
    'Electrical',
    'Suspension',
    'Transmission',
    'HVAC',
    'Tools'
  ];

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Filters': <FaOilCan className="h-5 w-5" />,
      'Brakes': <FaExclamationTriangle className="h-5 w-5" />,
      'Engine': <FaCar className="h-5 w-5" />,
      'Exterior': <FaCircle className="h-5 w-5" />,
      'Fluids': <FaOilCan className="h-5 w-5" />,
      'Electrical': <FaBolt className="h-5 w-5" />,
      'Suspension': <FaWrench className="h-5 w-5" />,
      'Transmission': <FaCog className="h-5 w-5" />,
      'HVAC': <FaCog className="h-5 w-5" />,
      'Tools': <FaWrench className="h-5 w-5" />
    };
    return iconMap[category] || <FaBox className="h-5 w-5" />;
  };

  useEffect(() => {
    // Load inventory (using mock data for now)
    setInventory(mockInventory);
    setFilteredInventory(mockInventory);
  }, []);

  useEffect(() => {
    // Filter inventory based on all criteria
    let filtered = inventory.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
    
    setFilteredInventory(filtered);
  }, [inventory, searchTerm, categoryFilter, statusFilter]);

  const getStatusBadge = (status, quantity, minQuantity) => {
    let actualStatus = status;
    if (quantity <= 0) {
      actualStatus = 'out-of-stock';
    } else if (quantity <= minQuantity) {
      actualStatus = 'low-stock';
    }

    const statusConfig = {
      'in-stock': { color: 'bg-green-100 text-green-800', icon: <FaCheckCircle />, text: 'In Stock' },
      'low-stock': { color: 'bg-yellow-100 text-yellow-800', icon: <FaExclamationTriangle />, text: 'Low Stock' },
      'out-of-stock': { color: 'bg-red-100 text-red-800', icon: <FaTimesCircle />, text: 'Out of Stock' }
    };
    
    const config = statusConfig[actualStatus] || statusConfig['in-stock'];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      category: item.category,
      partNumber: item.partNumber,
      sku: item.sku,
      quantity: item.quantity,
      minQuantity: item.minQuantity,
      maxQuantity: item.maxQuantity,
      unitPrice: item.unitPrice,
      supplier: item.supplier,
      location: item.location,
      status: item.status,
      notes: item.notes
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      setInventory(inventory.filter(item => item.id !== id));
    }
  };

  const handleQuantityUpdate = (id, newQuantity) => {
    setInventory(inventory.map(item => 
      item.id === id ? { 
        ...item, 
        quantity: Math.max(0, newQuantity),
        updatedAt: new Date().toISOString().split('T')[0]
      } : item
    ));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingItem) {
      // Update existing item
      const updatedItem = {
        ...editingItem,
        ...formData,
        id: editingItem.id,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setInventory(inventory.map(item => 
        item.id === editingItem.id ? updatedItem : item
      ));
    } else {
      // Create new item
      const newItem = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setInventory([...inventory, newItem]);
    }
    
    // Reset form and close modal
    setFormData({
      name: '',
      description: '',
      category: '',
      partNumber: '',
      sku: '',
      quantity: '',
      minQuantity: '',
      maxQuantity: '',
      unitPrice: '',
      supplier: '',
      location: '',
      status: 'in-stock',
      notes: ''
    });
    setEditingItem(null);
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      partNumber: '',
      sku: '',
      quantity: '',
      minQuantity: '',
      maxQuantity: '',
      unitPrice: '',
      supplier: '',
      location: '',
      status: 'in-stock',
      notes: ''
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setStatusFilter('all');
  };

  const getTotalValue = () => {
    return inventory.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  const getLowStockItems = () => {
    return inventory.filter(item => item.quantity <= item.minQuantity).length;
  };

  const getOutOfStockItems = () => {
    return inventory.filter(item => item.quantity === 0).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Inventory</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <FaPlus className="mr-2" />
          Add Item
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <FaBoxes className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Items</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{inventory.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <FaDollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${getTotalValue().toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <FaExclamationTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{getLowStockItems()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
              <FaTimesCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{getOutOfStockItems()}</p>
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
                  placeholder="Search inventory..."
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
                {inventoryCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
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

      {/* Inventory Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Part Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
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
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          {getCategoryIcon(item.category)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {item.sku}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {item.supplier}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{item.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{item.partNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        disabled={item.quantity <= 0}
                      >
                        <FaMinus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <FaPlus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Min: {item.minQuantity} | Max: {item.maxQuantity}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                      <FaDollarSign className="h-3 w-3 mr-1" />
                      {item.unitPrice}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Total: ${(item.quantity * item.unitPrice).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{item.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(item.status, item.quantity, item.minQuantity)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                        title="Edit Item"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                        title="Delete Item"
                      >
                        <FaTrash />
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
      {filteredInventory.length === 0 && (
        <div className="text-center py-12">
          <FaBoxes className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No inventory items found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding a new inventory item.'
            }
          </p>
        </div>
      )}

      {/* Modal for Add/Edit Item */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-6 border border-gray-200 dark:border-gray-700 w-full max-w-4xl shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {editingItem ? 'Edit Inventory Item' : 'Add New Item'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Item Name *</label>
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
                      {inventoryCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={2}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Part Number *</label>
                    <input
                      type="text"
                      name="partNumber"
                      value={formData.partNumber}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">SKU *</label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., A-1-15"
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity *</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Min Quantity *</label>
                    <input
                      type="number"
                      name="minQuantity"
                      value={formData.minQuantity}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Quantity *</label>
                    <input
                      type="number"
                      name="maxQuantity"
                      value={formData.maxQuantity}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit Price *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaDollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="unitPrice"
                        value={formData.unitPrice}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="mt-1 block w-full pl-10 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Supplier</label>
                    <input
                      type="text"
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
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
                    {editingItem ? 'Update Item' : 'Add Item'}
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

export default Inventory;