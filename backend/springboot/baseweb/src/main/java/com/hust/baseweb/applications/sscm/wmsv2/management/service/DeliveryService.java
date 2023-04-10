package com.hust.baseweb.applications.sscm.wmsv2.management.service;

import java.math.BigDecimal;

public interface DeliveryService {

    BigDecimal calDeliveryFee(BigDecimal longitude, BigDecimal latitude);

}
