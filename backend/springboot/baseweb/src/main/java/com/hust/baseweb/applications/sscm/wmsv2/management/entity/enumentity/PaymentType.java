package com.hust.baseweb.applications.sscm.wmsv2.management.entity.enumentity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum PaymentType {

    COD(0, "COD");

    private final long code;
    private final String name;

    public static PaymentType findByCode(long code) {
        for (PaymentType type : PaymentType.values()) {
            if (type.getCode() == code) {
                return type;
            }
        }
        return null;
    }
}
