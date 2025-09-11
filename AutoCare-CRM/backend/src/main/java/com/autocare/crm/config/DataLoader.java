package com.autocare.crm.config;

import com.autocare.crm.model.*;
import com.autocare.crm.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataLoader {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Bean
    public CommandLineRunner loadData() {
        return args -> {
            // Create customers
            Customer john = new Customer();
            john.setName("John Smith");
            john.setEmail("john.smith@example.com");
            john.setPhone("(555) 123-4567");
            john.setStatus("active");
            customerRepository.save(john);

            Customer sarah = new Customer();
            sarah.setName("Sarah Johnson");
            sarah.setEmail("sarah.j@example.com");
            sarah.setPhone("(555) 987-6543");
            sarah.setStatus("active");
            customerRepository.save(sarah);

            Customer michael = new Customer();
            michael.setName("Michael Brown");
            michael.setEmail("m.brown@example.com");
            michael.setPhone("(555) 456-7890");
            michael.setStatus("inactive");
            customerRepository.save(michael);

            // Create vehicles
            Vehicle johnCar1 = new Vehicle();
            johnCar1.setModel("Toyota Camry 2020");
            johnCar1.setPlateNo("ABC123");
            johnCar1.setYear(2020);
            johnCar1.setCustomer(john);
            vehicleRepository.save(johnCar1);

            Vehicle johnCar2 = new Vehicle();
            johnCar2.setModel("Honda Civic 2018");
            johnCar2.setPlateNo("XYZ789");
            johnCar2.setYear(2018);
            johnCar2.setCustomer(john);
            vehicleRepository.save(johnCar2);

            Vehicle sarahCar = new Vehicle();
            sarahCar.setModel("Ford F-150 2021");
            sarahCar.setPlateNo("DEF456");
            sarahCar.setYear(2021);
            sarahCar.setCustomer(sarah);
            vehicleRepository.save(sarahCar);

            Vehicle michaelCar1 = new Vehicle();
            michaelCar1.setModel("Chevrolet Malibu 2019");
            michaelCar1.setPlateNo("GHI789");
            michaelCar1.setYear(2019);
            michaelCar1.setCustomer(michael);
            vehicleRepository.save(michaelCar1);

            Vehicle michaelCar2 = new Vehicle();
            michaelCar2.setModel("Nissan Altima 2017");
            michaelCar2.setPlateNo("JKL012");
            michaelCar2.setYear(2017);
            michaelCar2.setCustomer(michael);
            vehicleRepository.save(michaelCar2);

            // Create appointments
            Appointment appointment1 = new Appointment();
            appointment1.setVehicle(johnCar1);
            appointment1.setDate(LocalDateTime.now().plusDays(3));
            appointment1.setStatus("Scheduled");
            appointment1.setMechanicName("Mike Johnson");
            appointmentRepository.save(appointment1);

            Appointment appointment2 = new Appointment();
            appointment2.setVehicle(sarahCar);
            appointment2.setDate(LocalDateTime.now().plusDays(1));
            appointment2.setStatus("Scheduled");
            appointment2.setMechanicName("Lisa Chen");
            appointmentRepository.save(appointment2);

            Appointment appointment3 = new Appointment();
            appointment3.setVehicle(michaelCar1);
            appointment3.setDate(LocalDateTime.now().minusDays(5));
            appointment3.setStatus("Completed");
            appointment3.setMechanicName("Robert Wilson");
            appointmentRepository.save(appointment3);

            // Create services
            Service service1 = new Service();
            service1.setAppointment(appointment1);
            service1.setDescription("Oil Change");
            service1.setCost(49.99);
            serviceRepository.save(service1);

            Service service2 = new Service();
            service2.setAppointment(appointment1);
            service2.setDescription("Tire Rotation");
            service2.setCost(29.99);
            serviceRepository.save(service2);

            Service service3 = new Service();
            service3.setAppointment(appointment2);
            service3.setDescription("Brake Inspection");
            service3.setCost(89.99);
            serviceRepository.save(service3);

            Service service4 = new Service();
            service4.setAppointment(appointment3);
            service4.setDescription("Full Service");
            service4.setCost(199.99);
            serviceRepository.save(service4);

            Service service5 = new Service();
            service5.setAppointment(appointment3);
            service5.setDescription("Air Filter Replacement");
            service5.setCost(24.99);
            serviceRepository.save(service5);

            // Create invoices
            Invoice invoice1 = new Invoice();
            invoice1.setAppointment(appointment3);
            invoice1.setTotalAmount(224.98);
            invoice1.setDate(LocalDateTime.now().minusDays(5));
            invoiceRepository.save(invoice1);
        };
    }
}
