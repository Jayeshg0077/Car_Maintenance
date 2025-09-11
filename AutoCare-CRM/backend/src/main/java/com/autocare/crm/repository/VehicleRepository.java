package com.autocare.crm.repository;

import com.autocare.crm.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    
    List<Vehicle> findByCustomerId(Long customerId);
    
    List<Vehicle> findByModelContainingIgnoreCaseOrPlateNoContainingIgnoreCase(String model, String plateNo);
}
