package com.autocare.crm.service;

import com.autocare.crm.model.Service;
import java.util.List;
import java.util.Optional;

public interface ServiceService {
    List<Service> getAllServices();
    Optional<Service> getServiceById(Long id);
    List<Service> getServicesByAppointmentId(Long appointmentId);
    Optional<Service> createService(Service service, Long appointmentId);
    Optional<Service> updateService(Long id, Service serviceDetails);
    boolean deleteService(Long id);
}
