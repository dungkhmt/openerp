package com.hust.baseweb.applications.sscm.wmsv2.management.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.ToString;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.util.List;

@Data
@ToString
public class NewWarehouseRequest {
    @NotBlank
    private String address;
    @NotBlank
    private String code;
    @NotBlank
    private String name;
    @Min(value = 0)
    private int facilityLength;
    @Min(value = 0)
    private int facilityWidth;
    private BigDecimal longitude;
    private BigDecimal latitude;
    @Valid
    private List<Shelf> listShelf;

    @Data
    @AllArgsConstructor
    public static class Shelf {
        @NotBlank
        private String code;
        @Min(value = 0)
        private Integer x;
        @Min(value = 0)
        private Integer y;
        @Min(value = 0)
        private Integer width;
        @Min(value = 0)
        private Integer length;
    }
}
