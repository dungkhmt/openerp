package com.hust.baseweb.applications.sscm.wmsv2.management.service;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.Receipt;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.ReceiptRequest;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.ReceiptGeneralResponse;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.ReceiptRequestResponse;

import java.security.Principal;
import java.util.List;

public interface ReceiptService {

    Receipt createReceipt(ReceiptRequest request);

    List<ReceiptGeneralResponse> getAllReceiptGeneral();

    ReceiptRequest getById(String id);

    List<ReceiptRequestResponse> getForSaleManagement(Principal principal, String status);

    ReceiptRequestResponse getForSaleManagementById(String id);

    boolean approve(Principal principal, String id);

    boolean cancel(Principal principal, String id);
}
