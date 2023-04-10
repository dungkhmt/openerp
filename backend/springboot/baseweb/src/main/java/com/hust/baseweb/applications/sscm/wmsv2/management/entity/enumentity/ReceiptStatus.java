package com.hust.baseweb.applications.sscm.wmsv2.management.entity.enumentity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum ReceiptStatus {

    CREATED("Khởi tạo"),
    APPROVED("Đã phê duyệt"),
    IN_PROGRESS("Đang xử lý"),
    CANCELLED("Đã hủy"),
    COMPLETED("Đã hoàn thành");

    private String name;
}
