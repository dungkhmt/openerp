package com.hust.baseweb.applications.sscm.wmsv2.vrp.delivery;

import lombok.*;
import org.jetbrains.annotations.NotNull;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class DeliveryAddressDTO implements Comparable<DeliveryAddressDTO> {
    private String deliveryItemId;
    private BigDecimal longitude;
    private BigDecimal latitude;
    private int sequence; // for response purpose; if dto is request, sequence = null

    @Override
    public int compareTo(@NotNull DeliveryAddressDTO o) {
        return deliveryItemId.compareTo(o.getDeliveryItemId());
    }
}
