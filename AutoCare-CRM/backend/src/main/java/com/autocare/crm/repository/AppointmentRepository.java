package com.autocare.crm.repository;

import com.autocare.crm.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    List<Appointment> findByVehicleId(Long vehicleId);
    
    List<Appointment> findByStatus(String status);
    
    List<Appointment> findByDateBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT COUNT(a) FROM Appointment a WHERE MONTH(a.date) = :month AND YEAR(a.date) = :year")
    Long countAppointmentsByMonth(int month, int year);
}
