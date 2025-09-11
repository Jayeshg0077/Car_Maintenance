package com.autocare.crm.service;

import com.autocare.crm.model.Invoice;
import java.util.List;
import java.util.Optional;

public interface InvoiceService {
    List<Invoice> getAllInvoices();
    Optional<Invoice> getInvoiceById(Long id);
    Optional<Invoice> getInvoiceByAppointmentId(Long appointmentId);
    Optional<Invoice> createInvoice(Invoice invoice, Long appointmentId);
    Optional<Invoice> updateInvoice(Long id, Invoice invoiceDetails);
    boolean deleteInvoice(Long id);
}

