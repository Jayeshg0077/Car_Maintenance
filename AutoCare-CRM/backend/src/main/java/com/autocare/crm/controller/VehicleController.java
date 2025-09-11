package com.autocare.crm.controller;


import com.autocare.crm.model.Vehicle;
import com.autocare.crm.repository.CustomerRepository;
import com.autocare.crm.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id) {
        return vehicleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{customerId}")
    public List<Vehicle> getVehiclesByCustomerId(@PathVariable Long customerId) {
        return vehicleRepository.findByCustomerId(customerId);
    }

    @PostMapping
    public ResponseEntity<Vehicle> createVehicle(@RequestBody Vehicle vehicle, @RequestParam Long customerId) {
        return customerRepository.findById(customerId)
                .map(customer -> {
                    vehicle.setCustomer(customer);
                    Vehicle savedVehicle = vehicleRepository.save(vehicle);
                    return ResponseEntity.ok(savedVehicle);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicleDetails) {
        return vehicleRepository.findById(id)
                .map(vehicle -> {
                    vehicle.setModel(vehicleDetails.getModel());
                    vehicle.setPlateNo(vehicleDetails.getPlateNo());
                    vehicle.setYear(vehicleDetails.getYear());
                    Vehicle updatedVehicle = vehicleRepository.save(vehicle);
                    return ResponseEntity.ok(updatedVehicle);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVehicle(@PathVariable Long id) {
        return vehicleRepository.findById(id)
                .map(vehicle -> {
                    vehicleRepository.delete(vehicle);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
