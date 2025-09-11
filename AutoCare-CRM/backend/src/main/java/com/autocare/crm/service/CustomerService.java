package com.autocare.crm.service;

import com.autocare.crm.model.Customer;
import java.util.List;
import java.util.Optional;

public interface CustomerService {
    List<Customer> getAllCustomers();
    Optional<Customer> getCustomerById(Long id);
    Customer createCustomer(Customer customer);
    Optional<Customer> updateCustomer(Long id, Customer customerDetails);
    boolean deleteCustomer(Long id);
    List<Customer> searchCustomers(String query);
}
