package com.hust.baseweb.applications.sscm.wmsv2.management.auto;

import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.AutoAssignOrderItemResponse;

public interface AutoAssignOrderItem {

    AutoAssignOrderItemResponse assign(String orderId);

}
