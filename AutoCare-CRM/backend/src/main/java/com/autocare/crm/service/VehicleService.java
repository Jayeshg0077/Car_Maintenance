package com.autocare.crm.service;

import com.autocare.crm.model.Vehicle;
import java.util.List;
import java.util.Optional;

public interface VehicleService {
    List<Vehicle> getAllVehicles();
    Optional<Vehicle> getVehicleById(Long id);
    List<Vehicle> getVehiclesByCustomerId(Long customerId);
    Optional<Vehicle> createVehicle(Vehicle vehicle, Long customerId);
    Optional<Vehicle> updateVehicle(Long id, Vehicle vehicleDetails);
    boolean deleteVehicle(Long id);
}
