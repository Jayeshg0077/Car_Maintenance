package com.autocare.crm.service.impl;

import com.autocare.crm.model.Service;
import com.autocare.crm.repository.AppointmentRepository;
import com.autocare.crm.repository.ServiceRepository;
import com.autocare.crm.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Service
public class ServiceServiceImpl implements ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Override
    public List<Service> getAllServices() {
        return serviceRepository.findAll();
    }

    @Override
    public Optional<Service> getServiceById(Long id) {
        return serviceRepository.findById(id);
    }

    @Override
    public List<Service> getServicesByAppointmentId(Long appointmentId) {
        return serviceRepository.findByAppointmentId(appointmentId);
    }

    @Override
    public Optional<Service> createService(Service service, Long appointmentId) {
        return appointmentRepository.findById(appointmentId)
                .map(appointment -> {
                    service.setAppointment(appointment);
                    return serviceRepository.save(service);
                });
    }

    @Override
    public Optional<Service> updateService(Long id, Service serviceDetails) {
        return serviceRepository.findById(id)
                .map(service -> {
                    service.setDescription(serviceDetails.getDescription());
                    service.setCost(serviceDetails.getCost());
                    return serviceRepository.save(service);
                });
    }

    @Override
    public boolean deleteService(Long id) {
        return serviceRepository.findById(id)
                .map(service -> {
                    serviceRepository.delete(service);
                    return true;
                })
                .orElse(false);
    }
}

