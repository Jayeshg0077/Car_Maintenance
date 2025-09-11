package com.autocare.crm.service;

import java.util.Map;

public interface DashboardService {
    Map<String, Object> getDashboardStats();
    Map<String, Object> getAppointmentsChart();
}

