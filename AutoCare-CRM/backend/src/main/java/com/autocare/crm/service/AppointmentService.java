package com.autocare.crm.service;

import com.autocare.crm.model.Appointment;
import java.util.List;
import java.util.Optional;
import java.util.Map;

public interface AppointmentService {
    List<Appointment> getAllAppointments();
    Optional<Appointment> getAppointmentById(Long id);
    List<Appointment> getAppointmentsByVehicleId(Long vehicleId);
    List<Appointment> getAppointmentsByStatus(String status);
    Optional<Appointment> createAppointment(Appointment appointment, Long vehicleId);
    Optional<Appointment> updateAppointment(Long id, Appointment appointmentDetails);
    Optional<Appointment> updateAppointmentStatus(Long id, Map<String, String> status);
    boolean deleteAppointment(Long id);
}
