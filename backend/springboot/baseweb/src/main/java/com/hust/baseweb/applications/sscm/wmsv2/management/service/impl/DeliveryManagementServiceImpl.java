package com.hust.baseweb.applications.sscm.wmsv2.management.service.impl;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.DeliveryPerson;
import com.hust.baseweb.applications.sscm.wmsv2.management.repository.DeliveryPersonRepository;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.DeliveryManagementService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class DeliveryManagementServiceImpl implements DeliveryManagementService {

    private DeliveryPersonRepository deliveryPersonRepository;

    @Override
    public List<DeliveryPerson> getAllDeliveryPersons() {
        return deliveryPersonRepository.findAll();
    }

    @Override
    public DeliveryPerson create(DeliveryPerson deliveryPerson) {
        if (deliveryPerson.getFullName() == null) {
            log.warn("Delivery person full name must not be null");
            return null;
        }
        deliveryPerson.setDeliveryPersonId(UUID.randomUUID());
        deliveryPersonRepository.save(deliveryPerson);
        return deliveryPerson;
    }

    @Override
    public boolean delete(String deliveryPersonId) {
        try {
            UUID id = UUID.fromString(deliveryPersonId);
            Optional<DeliveryPerson> deliveryPersonOpt = deliveryPersonRepository.findById(id);
            if (!deliveryPersonOpt.isPresent()) {
                log.warn(String.format("Delivery person with id %s is not exist", deliveryPersonId));
                return false;
            }
            deliveryPersonRepository.delete(deliveryPersonOpt.get());
            return true;
        } catch (Exception e) {
            log.warn(e.getMessage());
            return false;
        }
    }

    @Override
    public Map<UUID, String> getDeliveryPersonNameMap() {
        Map<UUID, String> nameMap = new HashMap<>();
        List<DeliveryPerson> persons = getAllDeliveryPersons();
        for (DeliveryPerson person : persons) {
            nameMap.put(person.getDeliveryPersonId(), person.getFullName());
        }
        return nameMap;
    }
}
