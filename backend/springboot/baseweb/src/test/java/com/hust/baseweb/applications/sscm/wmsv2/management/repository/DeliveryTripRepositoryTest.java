package com.hust.baseweb.applications.sscm.wmsv2.management.repository;

import com.hust.baseweb.BasewebApplication;
import com.hust.baseweb.applications.sscm.wmsv2.management.entity.DeliveryTrip;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
@RunWith(SpringRunner.class)
@SpringBootTest
@ContextConfiguration(classes = BasewebApplication.class)
class DeliveryTripRepositoryTest {

    @Autowired
    DeliveryTripRepository deliveryTripRepository;

    @Test
    public void findTodayDeliveryTripByPersonTest() {
        List<DeliveryTrip> trips = deliveryTripRepository.findTodayDeliveryTripsByPerson("32227cda-2d6d-4572-9d21-48a37ffb6a17",
                                                                                         Arrays.asList("CREATED", "DONE"));
        for (DeliveryTrip trip : trips) {
            System.out.println(trip);
        }
    }
}
