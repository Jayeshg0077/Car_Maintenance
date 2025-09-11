package com.autocare.crm.service.impl;

import com.autocare.crm.repository.AppointmentRepository;
import com.autocare.crm.repository.CustomerRepository;
import com.autocare.crm.repository.InvoiceRepository;
import com.autocare.crm.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Year;
import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Override
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Total customers
        stats.put("totalCustomers", customerRepository.count());
        
        // Upcoming appointments
        stats.put("upcomingAppointments", appointmentRepository.findByStatus("Scheduled").size());
        
        // Active work orders
        stats.put("activeWorkOrders", appointmentRepository.findByStatus("In-Progress").size());
        
        // Total revenue
        Double revenue = invoiceRepository.getTotalRevenue();
        stats.put("revenue", revenue != null ? revenue : 0);
        
        return stats;
    }

    @Override
    public Map<String, Object> getAppointmentsChart() {
        Map<String, Object> chartData = new HashMap<>();
        
        int currentYear = Year.now().getValue();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        Long[] data = new Long[12];
        
        for (int i = 0; i < 12; i++) {
            data[i] = appointmentRepository.countAppointmentsByMonth(i + 1, currentYear);
        }
        
        chartData.put("labels", months);
        chartData.put("data", data);
        
        return chartData;
    }
}

