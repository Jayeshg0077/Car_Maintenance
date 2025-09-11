package com.autocare.crm.service.impl;

import com.autocare.crm.model.Invoice;
import com.autocare.crm.repository.AppointmentRepository;
import com.autocare.crm.repository.InvoiceRepository;
import com.autocare.crm.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Override
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    @Override
    public Optional<Invoice> getInvoiceById(Long id) {
        return invoiceRepository.findById(id);
    }

    @Override
    public Optional<Invoice> getInvoiceByAppointmentId(Long appointmentId) {
        return invoiceRepository.findByAppointmentId(appointmentId);
    }

    @Override
    public Optional<Invoice> createInvoice(Invoice invoice, Long appointmentId) {
        return appointmentRepository.findById(appointmentId)
                .map(appointment -> {
                    invoice.setAppointment(appointment);
                    return invoiceRepository.save(invoice);
                });
    }

    @Override
    public Optional<Invoice> updateInvoice(Long id, Invoice invoiceDetails) {
        return invoiceRepository.findById(id)
                .map(invoice -> {
                    invoice.setTotalAmount(invoiceDetails.getTotalAmount());
                    return invoiceRepository.save(invoice);
                });
    }

    @Override
    public boolean deleteInvoice(Long id) {
        return invoiceRepository.findById(id)
                .map(invoice -> {
                    invoiceRepository.delete(invoice);
                    return true;
                })
                .orElse(false);
    }
}

