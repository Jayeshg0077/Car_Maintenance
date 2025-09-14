import React, { useState, useEffect, useCallback } from 'react';
import {
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaUserTie,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaToolbox,
  FaClock,
  FaStar,
  FaTimes
} from 'react-icons/fa';

const Staff = () => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock staff data
  const mockStaff = [
    {
      id: 1,
      name: 'John Smith',
      role: 'Mechanic',
      specialization: 'Engine Specialist',
      email: 'john.smith@autocare.com',
      phone: '(555) 123-4567',
      joinDate: '2023-01-15',
      status: 'active',
      rating: 4.8,
      completedJobs: 234,
      availability: 'Full-time',
      certifications: ['ASE Master Technician', 'BMW Certified'],
      skills: ['Engine Repair', 'Diagnostics', 'Transmission']
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      role: 'Service Advisor',
      specialization: 'Customer Relations',
      email: 'sarah.j@autocare.com',
      phone: '(555) 987-6543',
      joinDate: '2023-03-20',
      status: 'active',
      rating: 4.9,
      completedJobs: 345,
      availability: 'Full-time',
      certifications: ['Customer Service Excellence'],
      skills: ['Customer Service', 'Sales', 'Scheduling']
    }
  ];

  const loadStaffData = useCallback(async () => {
    try {
      setLoading(true);
      // Load staff members from localStorage or use mock data
      const savedStaff = localStorage.getItem('staffMembers');
      if (savedStaff) {
        setStaffMembers(JSON.parse(savedStaff));
      } else {
        setStaffMembers(mockStaff);
        localStorage.setItem('staffMembers', JSON.stringify(mockStaff));
      }
    } catch (err) {
      setError('Failed to load staff data');
      console.error('Error loading staff data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  // Load initial data
  useEffect(() => {
    loadStaffData();
  }, [loadStaffData]);

  const initialFormData = {
    name: '',
    role: '',
    specialization: '',
    email: '',
    phone: '',
    availability: 'Full-time',
    certifications: '',
    skills: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (selectedStaff) {
      setFormData({
        ...selectedStaff,
        certifications: selectedStaff.certifications.join(', '),
        skills: selectedStaff.skills.join(', ')
      });
    } else {
      setFormData(initialFormData);
    }
  }, [selectedStaff]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedStaff(null);
    setShowModal(false);
  };

  const validateForm = useCallback(() => {
    try {
      const required = ['name', 'role', 'email', 'phone'];
      const missing = required.filter(field => !formData[field]?.trim());

      if (missing.length > 0) {
        setError(`Please fill in all required fields: ${missing.map(field =>
          field.charAt(0).toUpperCase() + field.slice(1)).join(', ')}`);
        return false;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email?.trim())) {
        setError('Please enter a valid email address');
        return false;
      }

      // Phone validation with flexible format
      const phoneDigits = formData.phone?.replace(/\D/g, '');
      if (!phoneDigits || phoneDigits.length !== 10) {
        setError('Please enter a valid 10-digit phone number');
        return false;
      }

      // Specialization is required
      if (!formData.specialization?.trim()) {
        setError('Please enter a specialization');
        return false;
      }

      // At least one skill is required
      if (!formData.skills?.trim()) {
        setError('Please enter at least one skill');
        return false;
      }

      setError(null);
      return true;
    } catch (err) {
      setError('Form validation failed. Please check all fields.');
      return false;
    }
  }, [formData]);

  const handleSubmit = async () => {
    try {
      setError(null);
      setLoading(true);

      if (!validateForm()) {
        setLoading(false);
        return;
      }

      // Format the data
      const staffData = {
        ...formData,
        id: selectedStaff ? selectedStaff.id : Date.now(), // Unique ID based on timestamp
        status: 'active',
        joinDate: selectedStaff ? selectedStaff.joinDate : new Date().toISOString().split('T')[0],
        rating: selectedStaff ? selectedStaff.rating : 0,
        completedJobs: selectedStaff ? selectedStaff.completedJobs : 0,
        certifications: formData.certifications
          .split(',')
          .map(cert => cert.trim())
          .filter(Boolean),
        skills: formData.skills
          .split(',')
          .map(skill => skill.trim())
          .filter(Boolean),
        phone: formData.phone.replace(/\s/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3'),
        email: formData.email.trim().toLowerCase()
      };

      if (selectedStaff) {
        // Update existing staff member
        setStaffMembers(prev =>
          prev.map(staff => staff.id === selectedStaff.id ? staffData : staff)
        );
      } else {
        // Add new staff member
        setStaffMembers(prev => [...prev, staffData]);
      }

      // Save to localStorage for persistence
      const updatedStaff = selectedStaff
        ? staffMembers.map(staff => staff.id === selectedStaff.id ? staffData : staff)
        : [...staffMembers, staffData];

      localStorage.setItem('staffMembers', JSON.stringify(updatedStaff));

      resetForm();
      setLoading(false);
    } catch (err) {
      setError('Failed to save staff member. Please try again.');
      setLoading(false);
    }
  };

  const handleDeleteStaff = (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      setStaffMembers(prev => prev.filter(staff => staff.id !== id));
    }
  };

  // Enhanced search and filter functionality
  const getFilteredStaff = useCallback(() => {
    return staffMembers.filter(staff => {
      // Search functionality
      if (searchQuery.trim()) {
        const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/);
        const staffData = [
          staff.name,
          staff.email,
          staff.role,
          staff.specialization,
          staff.phone,
          ...(staff.skills || []),
          ...(staff.certifications || [])
        ].map(item => (item || '').toLowerCase());

        const matchesSearch = searchTerms.every(term =>
          staffData.some(data => data.includes(term))
        );

        if (!matchesSearch) return false;
      }

      // Role filter
      if (filterRole !== 'all') {
        if (staff.role.toLowerCase() !== filterRole.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [staffMembers, searchQuery, filterRole]);

  const filteredStaff = getFilteredStaff();

  // Get unique roles for filter dropdown
  const roles = ['all', ...new Set(staffMembers.map(staff => staff.role))].sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Staff Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaUserPlus className="mr-2" />
          Add Staff Member
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, role, skills..."
              className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>
        <div className="w-full md:w-48 relative">
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              {roles.filter(role => role !== 'all').map(role => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Search Results Count */}
      {searchQuery && (
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Found {filteredStaff.length} staff member{filteredStaff.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map(staff => (
          <div key={staff.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <FaUserTie className="text-blue-600 dark:text-blue-400 text-xl" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{staff.name}</h3>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{staff.role}</p>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${staff.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                      {staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedStaff(staff);
                    setShowModal(true);
                  }}
                  className="text-gray-400 hover:text-blue-600"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteStaff(staff.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <FaEnvelope className="text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">{staff.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <FaPhone className="text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">{staff.phone}</span>
              </div>
              <div className="flex items-center text-sm">
                <FaCalendarAlt className="text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">Joined: {staff.joinDate}</span>
              </div>
              <div className="flex items-center text-sm">
                <FaToolbox className="text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">{staff.specialization}</span>
              </div>
              <div className="flex items-center text-sm">
                <FaClock className="text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">{staff.availability}</span>
              </div>
              <div className="flex items-center text-sm">
                <FaStar className="text-yellow-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">
                  {staff.rating} ({staff.completedJobs} jobs)
                </span>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Certifications</h4>
              <div className="flex flex-wrap gap-2">
                {staff.certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {staff.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {selectedStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Role *
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(555) 123-4567"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Specialization *
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Availability
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Certifications (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleInputChange}
                    placeholder="ASE Master, BMW Certified, etc."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Skills (comma-separated) *
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="Engine Repair, Diagnostics, Transmission, etc."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
              </div>
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg border border-gray-300"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>{selectedStaff ? 'Update' : 'Add'} Staff Member</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
