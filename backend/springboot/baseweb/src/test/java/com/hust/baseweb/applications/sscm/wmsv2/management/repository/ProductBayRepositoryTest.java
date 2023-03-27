package com.hust.baseweb.applications.sscm.wmsv2.management.repository;

import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.ProductDetailQuantityResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import javax.transaction.Transactional;
import java.util.List;
import java.util.UUID;

@ExtendWith(SpringExtension.class)
@Transactional
@SpringBootTest
class ProductBayRepositoryTest {

    @Autowired
    private ProductBayRepository productBayRepository;

    @Test
    public void getProductDetailQuantityResponseByProductIdTest() {
        List<ProductDetailQuantityResponse> response = productBayRepository.
            getProductDetailQuantityResponseByProductId(UUID.fromString("2a09bc6e-17ce-45b2-8213-acb1ef1130c1"));
        System.out.println("Response ----");
        System.out.println(response);
    }

}
