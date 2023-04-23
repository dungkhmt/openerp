package com.hust.baseweb.applications.sscm.wmsv2.management.service.impl;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.ProductV2;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.request.CartItemRequest;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.CartItemResponse;
import com.hust.baseweb.applications.sscm.wmsv2.management.repository.ProductV2Repository;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.CartService;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.DeliveryService;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.ProductService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class CartServiceImpl implements CartService {

    private ProductV2Repository productRepository;

    private ProductService productService;
    private DeliveryService deliveryService;

    @Override
    public CartItemResponse calculateCartFee(CartItemRequest request) {
        List<CartItemRequest.Item> itemList = request.getItems();
        if (itemList.size() < 1) {
            log.warn("Cart item request is empty....");
            return null;
        }

        List<CartItemResponse.Item> items = new ArrayList<>();
        BigDecimal itemCost = BigDecimal.ZERO;
        for (CartItemRequest.Item r : itemList) {
            Optional<ProductV2> productOpt = productRepository.findById(UUID.fromString(r.getProductId()));
            if (productOpt.isPresent()) {
                ProductV2 product = productOpt.get();
                BigDecimal currPrice = productService.getCurrPriceByProductId(product.getProductId());
                if (currPrice == null) {
                    log.warn("Product %s hasn't configed price. Please try another");
                    return null;
                }
                long quantity = r.getQuantity();

                items.add(CartItemResponse.Item.builder()
                              .productId(product.getProductId())
                              .imageData(product.getImageData())
                              .imageContentType(product.getImageContentType())
                              .name(product.getName())
                              .priceUnit(currPrice)
                              .quantity(quantity)
                              .build());
                BigDecimal adderItemCost = currPrice.multiply(BigDecimal.valueOf(quantity));
                itemCost = itemCost.add(adderItemCost);
            }
        }

        BigDecimal deliveryFee = deliveryService.calDeliveryFee(request.getLongitude(), request.getLatitude());
        BigDecimal totalOrderCost = itemCost.add(deliveryFee);
        return CartItemResponse.builder()
            .items(items)
            .totalProductCost(itemCost)
            .deliveryFee(deliveryFee)
            .totalOrderCost(totalOrderCost)
            .build();
    }
}
