package com.hust.baseweb.applications.sscm.wmsv2.management.service;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.DeliveryPerson;

import java.util.List;

public interface DeliveryManagementService {

    List<DeliveryPerson> getAllDeliveryPersons();

    DeliveryPerson create(DeliveryPerson deliveryPerson);

    boolean delete(String deliveryPersonId);

}
