import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaCar,
  FaPhone,
  FaEnvelope,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle
} from 'react-icons/fa';
import axios from 'axios';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [mechanicFilter, setMechanicFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    vehicle: '',
    plateNumber: '',
    date: '',
    time: '',
    serviceType: '',
    mechanicName: '',
    notes: ''
  });

  // Mock data for demonstration
  const mockAppointments = [
    {
      id: 1,
      customerName: 'John Smith',
      customerEmail: 'john@email.com',
      customerPhone: '+1-555-0123',
      vehicle: '2020 Honda Civic',
      plateNumber: 'ABC-123',
      date: '2024-01-15',
      time: '10:00 AM',
      status: 'scheduled',
      mechanicName: 'Mike Johnson',
      serviceType: 'Oil Change',
      notes: 'Regular maintenance'
    },
    {
      id: 2,
      customerName: 'Sarah Wilson',
      customerEmail: 'sarah@email.com',
      customerPhone: '+1-555-0456',
      vehicle: '2019 Toyota Camry',
      plateNumber: 'XYZ-789',
      date: '2024-01-15',
      time: '2:00 PM',
      status: 'in-progress',
      mechanicName: 'David Brown',
      serviceType: 'Brake Inspection',
      notes: 'Customer reported squeaking noise'
    },
    {
      id: 3,
      customerName: 'Robert Davis',
      customerEmail: 'robert@email.com',
      customerPhone: '+1-555-0789',
      vehicle: '2021 Ford F-150',
      plateNumber: 'DEF-456',
      date: '2024-01-16',
      time: '9:00 AM',
      status: 'completed',
      mechanicName: 'Mike Johnson',
      serviceType: 'Engine Diagnostic',
      notes: 'Check engine light on'
    }
  ];

  useEffect(() => {
    // Load appointments (using mock data for now)
    setAppointments(mockAppointments);
    setFilteredAppointments(mockAppointments);
  }, []);

  useEffect(() => {
    // Filter appointments based on all criteria
    let filtered = appointments.filter(appointment => {
      const matchesSearch = 
        appointment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.mechanicName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
      const matchesDate = !dateFilter || appointment.date === dateFilter;
      const matchesMechanic = mechanicFilter === 'all' || appointment.mechanicName === mechanicFilter;
      
      return matchesSearch && matchesStatus && matchesDate && matchesMechanic;
    });
    
    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, statusFilter, dateFilter, mechanicFilter]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { color: 'bg-yellow-100 text-yellow-800', icon: <FaClock />, text: 'Scheduled' },
      'in-progress': { color: 'bg-blue-100 text-blue-800', icon: <FaExclamationCircle />, text: 'In Progress' },
      completed: { color: 'bg-green-100 text-green-800', icon: <FaCheckCircle />, text: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: <FaTimesCircle />, text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || statusConfig.scheduled;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      customerName: appointment.customerName,
      customerEmail: appointment.customerEmail,
      customerPhone: appointment.customerPhone,
      vehicle: appointment.vehicle,
      plateNumber: appointment.plateNumber,
      date: appointment.date,
      time: appointment.time,
      serviceType: appointment.serviceType,
      mechanicName: appointment.mechanicName,
      notes: appointment.notes
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      setAppointments(appointments.filter(apt => apt.id !== id));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: newStatus } : apt
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
    
    if (editingAppointment) {
      // Update existing appointment
      const updatedAppointment = {
        ...editingAppointment,
        ...formData,
        id: editingAppointment.id
      };
      setAppointments(appointments.map(apt => 
        apt.id === editingAppointment.id ? updatedAppointment : apt
      ));
    } else {
      // Create new appointment
      const newAppointment = {
        ...formData,
        id: Date.now(), // Simple ID generation
        status: 'scheduled'
      };
      setAppointments([...appointments, newAppointment]);
    }
    
    // Reset form and close modal
    setFormData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      vehicle: '',
      plateNumber: '',
      date: '',
      time: '',
      serviceType: '',
      mechanicName: '',
      notes: ''
    });
    setEditingAppointment(null);
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAppointment(null);
    setFormData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      vehicle: '',
      plateNumber: '',
      date: '',
      time: '',
      serviceType: '',
      mechanicName: '',
      notes: ''
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('');
    setMechanicFilter('all');
  };

  const getUniqueMechanics = () => {
    const mechanics = [...new Set(appointments.map(apt => apt.mechanicName))];
    return mechanics;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Appointments</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <FaPlus className="mr-2" />
          New Appointment
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
                  placeholder="Search appointments..."
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
                <option value="scheduled">Scheduled</option>
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
                    Filter by Date
                  </label>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
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

      {/* Appointments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mechanic
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
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <FaUser className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {appointment.customerName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <FaEnvelope className="h-3 w-3 mr-1" />
                          {appointment.customerEmail}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <FaPhone className="h-3 w-3 mr-1" />
                          {appointment.customerPhone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaCar className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {appointment.vehicle}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {appointment.plateNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaCalendarAlt className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {appointment.date}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {appointment.time}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{appointment.serviceType}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{appointment.notes}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{appointment.mechanicName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(appointment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(appointment)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                        title="Edit Appointment"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(appointment.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                        title="Delete Appointment"
                      >
                        <FaTrash />
                      </button>
                      <button 
                        onClick={() => handleStatusChange(appointment.id, 
                          appointment.status === 'scheduled' ? 'in-progress' : 
                          appointment.status === 'in-progress' ? 'completed' : 'scheduled'
                        )}
                        className={`p-1 rounded transition-colors ${
                          appointment.status === 'scheduled' ? 'text-yellow-600 hover:text-yellow-900 hover:bg-yellow-100 dark:hover:bg-yellow-900' :
                          appointment.status === 'in-progress' ? 'text-green-600 hover:text-green-900 hover:bg-green-100 dark:hover:bg-green-900' :
                          'text-blue-600 hover:text-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900'
                        }`}
                        title={`${appointment.status === 'scheduled' ? 'Start' : appointment.status === 'in-progress' ? 'Complete' : 'Reschedule'} Appointment`}
                      >
                        {appointment.status === 'scheduled' ? <FaClock /> : 
                         appointment.status === 'in-progress' ? <FaCheckCircle /> : <FaEdit />}
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
      {filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No appointments found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating a new appointment.'
            }
          </p>
        </div>
      )}

      {/* Modal for Add/Edit Appointment */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-6 border border-gray-200 dark:border-gray-700 w-full max-w-2xl shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {editingAppointment ? 'Edit Appointment' : 'New Appointment'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time *</label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Service Type *</label>
                    <select 
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Service</option>
                      <option value="Oil Change">Oil Change</option>
                      <option value="Brake Inspection">Brake Inspection</option>
                      <option value="Engine Diagnostic">Engine Diagnostic</option>
                      <option value="Tire Rotation">Tire Rotation</option>
                      <option value="General Maintenance">General Maintenance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mechanic *</label>
                    <select 
                      name="mechanicName"
                      value={formData.mechanicName}
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
                    {editingAppointment ? 'Update Appointment' : 'Create Appointment'}
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

export default Appointments;
