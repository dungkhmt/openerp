package com.hust.baseweb.applications.sscm.wmsv2.management.entity.enumentity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum DeliveryTripStatus {
    CREATED("Khởi tạo", "CREATED"),
    DELIVERING("Đang giao", "DELIVERING"),
    FAIL("Giao thất bại", "FAIL"),
    DONE("Giao thành công", "DONE");

    private final String name;
    private final String code;

    public static DeliveryTripStatus findByCode(String code) {
        for (DeliveryTripStatus status : DeliveryTripStatus.values()) {
            if (status.getCode().equals(code)) {
                return status;
            }
        }
        return null;
    }
}
