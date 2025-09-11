package com.autocare.crm.service.impl;

import com.autocare.crm.model.Vehicle;
import com.autocare.crm.repository.CustomerRepository;
import com.autocare.crm.repository.VehicleRepository;
import com.autocare.crm.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VehicleServiceImpl implements VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    @Override
    public Optional<Vehicle> getVehicleById(Long id) {
        return vehicleRepository.findById(id);
    }

    @Override
    public List<Vehicle> getVehiclesByCustomerId(Long customerId) {
        return vehicleRepository.findByCustomerId(customerId);
    }

    @Override
    public Optional<Vehicle> createVehicle(Vehicle vehicle, Long customerId) {
        return customerRepository.findById(customerId)
                .map(customer -> {
                    vehicle.setCustomer(customer);
                    return vehicleRepository.save(vehicle);
                });
    }

    @Override
    public Optional<Vehicle> updateVehicle(Long id, Vehicle vehicleDetails) {
        return vehicleRepository.findById(id)
                .map(vehicle -> {
                    vehicle.setModel(vehicleDetails.getModel());
                    vehicle.setPlateNo(vehicleDetails.getPlateNo());
                    vehicle.setYear(vehicleDetails.getYear());
                    return vehicleRepository.save(vehicle);
                });
    }

    @Override
    public boolean deleteVehicle(Long id) {
        return vehicleRepository.findById(id)
                .map(vehicle -> {
                    vehicleRepository.delete(vehicle);
                    return true;
                })
                .orElse(false);
    }
}

