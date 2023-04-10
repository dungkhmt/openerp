package com.hust.baseweb.applications.sscm.wmsv2.management.service;

import com.hust.baseweb.applications.sscm.wmsv2.management.model.request.CartItemRequest;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.CartItemResponse;

public interface CartService {

    CartItemResponse calculateCartFee(CartItemRequest request);

}
