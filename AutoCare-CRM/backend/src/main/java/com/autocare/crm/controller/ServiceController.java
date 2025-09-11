package com.autocare.crm.controller;


import com.autocare.crm.model.Service;
import com.autocare.crm.repository.AppointmentRepository;
import com.autocare.crm.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @GetMapping
    public List<Service> getAllServices() {
        return serviceRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable Long id) {
        return serviceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/appointment/{appointmentId}")
    public List<Service> getServicesByAppointmentId(@PathVariable Long appointmentId) {
        return serviceRepository.findByAppointmentId(appointmentId);
    }

    @PostMapping
    public ResponseEntity<Service> createService(@RequestBody Service service, @RequestParam Long appointmentId) {
        return appointmentRepository.findById(appointmentId)
                .map(appointment -> {
                    service.setAppointment(appointment);
                    Service savedService = serviceRepository.save(service);
                    return ResponseEntity.ok(savedService);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Service> updateService(@PathVariable Long id, @RequestBody Service serviceDetails) {
        return serviceRepository.findById(id)
                .map(service -> {
                    service.setDescription(serviceDetails.getDescription());
                    service.setCost(serviceDetails.getCost());
                    Service updatedService = serviceRepository.save(service);
                    return ResponseEntity.ok(updatedService);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {
        return serviceRepository.findById(id)
                .map(service -> {
                    serviceRepository.delete(service);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
