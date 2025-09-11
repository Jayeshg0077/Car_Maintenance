package com.autocare.crm.service.impl;

import com.autocare.crm.model.Appointment;
import com.autocare.crm.repository.AppointmentRepository;
import com.autocare.crm.repository.VehicleRepository;
import com.autocare.crm.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Override
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @Override
    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    @Override
    public List<Appointment> getAppointmentsByVehicleId(Long vehicleId) {
        return appointmentRepository.findByVehicleId(vehicleId);
    }

    @Override
    public List<Appointment> getAppointmentsByStatus(String status) {
        return appointmentRepository.findByStatus(status);
    }

    @Override
    public Optional<Appointment> createAppointment(Appointment appointment, Long vehicleId) {
        return vehicleRepository.findById(vehicleId)
                .map(vehicle -> {
                    appointment.setVehicle(vehicle);
                    return appointmentRepository.save(appointment);
                });
    }

    @Override
    public Optional<Appointment> updateAppointment(Long id, Appointment appointmentDetails) {
        return appointmentRepository.findById(id)
                .map(appointment -> {
                    appointment.setDate(appointmentDetails.getDate());
                    appointment.setStatus(appointmentDetails.getStatus());
                    appointment.setMechanicName(appointmentDetails.getMechanicName());
                    return appointmentRepository.save(appointment);
                });
    }

    @Override
    public Optional<Appointment> updateAppointmentStatus(Long id, Map<String, String> statusMap) {
        return appointmentRepository.findById(id)
                .map(appointment -> {
                    appointment.setStatus(statusMap.get("status"));
                    return appointmentRepository.save(appointment);
                });
    }

    @Override
    public boolean deleteAppointment(Long id) {
        return appointmentRepository.findById(id)
                .map(appointment -> {
                    appointmentRepository.delete(appointment);
                    return true;
                })
                .orElse(false);
    }
}

