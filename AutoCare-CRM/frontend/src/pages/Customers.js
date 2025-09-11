import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEllipsisV, FaCar } from 'react-icons/fa';
import axios from 'axios';

const CustomerCard = ({ customer }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="card relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">{customer.name}</h3>
          <span className={`badge ${customer.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
            {customer.status}
          </span>
        </div>
        <div className="relative">
          <button 
            onClick={toggleMenu}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaEllipsisV />
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <ul className="py-1">
                <li>
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    Edit
                  </button>
                </li>
                <li>
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    View Details
                  </button>
                </li>
                <li>
                  <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                    Delete
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <p className="text-gray-600">{customer.email}</p>
        <p className="text-gray-600">{customer.phone}</p>
      </div>
      
      <div className="mb-4">
        <h4 className="font-medium mb-2 flex items-center">
          <FaCar className="mr-2" /> Vehicles
        </h4>
        <ul className="space-y-1">
          {customer.vehicles.map((vehicle, index) => (
            <li key={index} className="text-sm text-gray-600">
              {vehicle.model} - {vehicle.plateNo}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="border-t pt-4 flex justify-between">
        <div>
          <p className="text-sm text-gray-500">Last Service</p>
          <p className="font-medium">{customer.lastServiceDate || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Balance</p>
          <p className="font-medium">${customer.balance.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demonstration
    // In a real app, you would fetch this from your API
    const mockCustomers = [
      {
        id: 1,
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "(555) 123-4567",
        status: "active",
        vehicles: [
          { model: "Toyota Camry 2020", plateNo: "ABC123" },
          { model: "Honda Civic 2018", plateNo: "XYZ789" }
        ],
        lastServiceDate: "2023-10-15",
        balance: 450
      },
      {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        phone: "(555) 987-6543",
        status: "active",
        vehicles: [
          { model: "Ford F-150 2021", plateNo: "DEF456" }
        ],
        lastServiceDate: "2023-11-02",
        balance: 780
      },
      {
        id: 3,
        name: "Michael Brown",
        email: "m.brown@example.com",
        phone: "(555) 456-7890",
        status: "inactive",
        vehicles: [
          { model: "Chevrolet Malibu 2019", plateNo: "GHI789" },
          { model: "Nissan Altima 2017", plateNo: "JKL012" }
        ],
        lastServiceDate: "2023-08-20",
        balance: 120
      },
      {
        id: 4,
        name: "Emily Davis",
        email: "emily.d@example.com",
        phone: "(555) 234-5678",
        status: "active",
        vehicles: [
          { model: "BMW X5 2022", plateNo: "MNO345" }
        ],
        lastServiceDate: "2023-11-10",
        balance: 1250
      },
      {
        id: 5,
        name: "David Wilson",
        email: "d.wilson@example.com",
        phone: "(555) 876-5432",
        status: "active",
        vehicles: [
          { model: "Audi A4 2020", plateNo: "PQR678" }
        ],
        lastServiceDate: "2023-09-05",
        balance: 680
      },
      {
        id: 6,
        name: "Jennifer Lee",
        email: "jennifer.l@example.com",
        phone: "(555) 345-6789",
        status: "inactive",
        vehicles: [
          { model: "Hyundai Sonata 2021", plateNo: "STU901" },
          { model: "Kia Sportage 2019", plateNo: "VWX234" }
        ],
        lastServiceDate: "2023-07-12",
        balance: 0
      }
    ];

    setCustomers(mockCustomers);
    setLoading(false);

    // Uncomment this when backend is ready
    /*
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/customers');
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
    */
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    
    // Check if customer name, email, or phone contains the search term
    if (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.phone.includes(searchTerm)
    ) {
      return true;
    }
    
    // Check if any vehicle model or plate number contains the search term
    return customer.vehicles.some(
      vehicle => 
        vehicle.model.toLowerCase().includes(searchLower) ||
        vehicle.plateNo.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Customers</h1>
        
        <button className="btn btn-primary flex items-center">
          <FaPlus className="mr-2" /> Add Customer
        </button>
      </div>
      
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search customers by name, email, phone or vehicle..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FaSearch className="absolute right-4 top-3 text-gray-400" />
      </div>
      
      {loading ? (
        <div className="text-center py-10">
          <p>Loading customers...</p>
        </div>
      ) : filteredCustomers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map(customer => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p>No customers found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Customers;
