package com.hust.baseweb.applications.sscm.wmsv2.management.service;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.Receipt;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.ReceiptRequest;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.ReceiptGeneralResponse;

import java.util.List;

public interface ReceiptService {

    Receipt createReceipt(ReceiptRequest request);

    List<ReceiptGeneralResponse> getAllReceiptGeneral();

    ReceiptRequest getById(String id);

}
