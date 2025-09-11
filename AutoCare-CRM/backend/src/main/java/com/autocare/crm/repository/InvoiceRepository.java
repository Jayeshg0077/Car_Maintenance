package com.autocare.crm.repository;

import com.autocare.crm.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    
    Optional<Invoice> findByAppointmentId(Long appointmentId);
    
    List<Invoice> findByDateBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT SUM(i.totalAmount) FROM Invoice i")
    Double getTotalRevenue();
}
