package com.autocare.crm.controller;

import com.autocare.crm.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats() {
        return dashboardService.getDashboardStats();
    }

    @GetMapping("/appointments-chart")
    public Map<String, Object> getAppointmentsChart() {
        return dashboardService.getAppointmentsChart();
    }
}
