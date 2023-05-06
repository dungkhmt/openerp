package com.hust.baseweb.applications.sscm.wmsv2.management.repository;

import com.hust.baseweb.BasewebApplication;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@RunWith(SpringRunner.class)
@SpringBootTest
@ContextConfiguration(classes = BasewebApplication.class)
class DeliveryTripItemRepositoryTest {

    @Autowired
    DeliveryTripItemRepository deliveryTripItemRepository;

    @Test
    @Transactional
    public void updateSequenceTest() {
        deliveryTripItemRepository.updateSequenceByDeliveryItemId(5, "TRP_ITEM_00004");
    }

    @Test
    public void getTotalDoneDeliveryItemByOrderIdAndProductIdTest() {
        long res = deliveryTripItemRepository.getTotalCompleteDeliveryItemByOrderIdAndProductId(
            UUID.fromString("cb26f59b-d9a6-4f61-b70d-7859861204c3"),
            UUID.fromString("8f911ecd-c57d-4a2b-8440-d515b63a8fb5"));
        System.out.printf("Res => %d%n", res);
    }

}
