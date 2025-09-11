package com.autocare.crm.controller;

import com.autocare.crm.model.Appointment;
import com.autocare.crm.repository.AppointmentRepository;
import com.autocare.crm.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        return appointmentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/vehicle/{vehicleId}")
    public List<Appointment> getAppointmentsByVehicleId(@PathVariable Long vehicleId) {
        return appointmentRepository.findByVehicleId(vehicleId);
    }

    @GetMapping("/status/{status}")
    public List<Appointment> getAppointmentsByStatus(@PathVariable String status) {
        return appointmentRepository.findByStatus(status);
    }

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment, @RequestParam Long vehicleId) {
        return vehicleRepository.findById(vehicleId)
                .map(vehicle -> {
                    appointment.setVehicle(vehicle);
                    Appointment savedAppointment = appointmentRepository.save(appointment);
                    return ResponseEntity.ok(savedAppointment);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable Long id, @RequestBody Appointment appointmentDetails) {
        return appointmentRepository.findById(id)
                .map(appointment -> {
                    appointment.setDate(appointmentDetails.getDate());
                    appointment.setStatus(appointmentDetails.getStatus());
                    appointment.setMechanicName(appointmentDetails.getMechanicName());
                    Appointment updatedAppointment = appointmentRepository.save(appointment);
                    return ResponseEntity.ok(updatedAppointment);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Appointment> updateAppointmentStatus(@PathVariable Long id, @RequestBody Map<String, String> status) {
        return appointmentRepository.findById(id)
                .map(appointment -> {
                    appointment.setStatus(status.get("status"));
                    Appointment updatedAppointment = appointmentRepository.save(appointment);
                    return ResponseEntity.ok(updatedAppointment);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        return appointmentRepository.findById(id)
                .map(appointment -> {
                    appointmentRepository.delete(appointment);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
