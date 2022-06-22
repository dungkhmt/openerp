package com.hust.baseweb.applications.sscm.tmscontainer.model;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.Shelves;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FacilityRequest{
    @NotBlank
    private String code;
    @NotBlank
    private String name;
    @NotBlank
    private String address;
    @NotNull(message = "Chiều rộng kho không được bỏ trống")
    private int facilityWidth;
    @NotNull(message = "Chiều dài kho không được bỏ trống")
    private int facilityLenght;
    @NotNull
    private List<ShelfRequest> listShelf;

}
