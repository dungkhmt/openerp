package com.hust.baseweb.applications.sscm.tmscontainer.model;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.Variant;
import lombok.*;
import org.springframework.lang.Nullable;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductRequest {

    @NotNull
    private String code;
    @NotNull
    private String type;
    @NotNull
    private String name;
    @NotNull
    private String description;

    private String image;

    private Boolean isActive;

    private String opt1;

    private String opt2;

    private String opt3;

    private Integer weightValue;

    private String weightUnit;

    private BigDecimal importPrice;

    private BigDecimal wholePrice;

    private BigDecimal retailPrice;

    private List<String> opt1Val;

    private List<String> opt2Val;

    private List<Variant> variants;

    public void setForCreate() {
        if (this.isActive == null) {
            this.setIsActive(true);
        }
        setVariantsCreate();
    }

    public void setVariantsCreate() {

        this.variants = new ArrayList<Variant>();
        if (opt1Val != null && opt2Val != null) {
            if (opt1Val.size() == 0 && opt2Val.size() == 0) {
                setVariantItemOpt();
            } else if (opt1Val != null && opt2Val.size() == 0) {
                setVariantItemOpt1();
            } else if (opt1Val.size() == 0 && opt2Val != null) {
                setVariantItemOpt2();
            } else {
                setVariantItemTwoOpt();
            }
        }
        if (opt1Val != null && opt2Val == null) {
            setVariantItemOpt1();
        }
        if (opt1Val == null && opt2Val != null) {
            setVariantItemOpt2();
        }
        if (opt1Val == null && opt2Val == null) {
            setVariantItemOpt();
        }
    }

    private void setVariantItemOpt() {
        Variant variantItem = new Variant();
        variantItem.setName(this.name);
        variantItem.setIsActive(true);
        variantItem.setWeightUnit(this.weightUnit);
        variantItem.setWeightValue(this.weightValue);
        variantItem.setImportPrice(this.importPrice);
        variantItem.setWholePrice(this.wholePrice);
        variantItem.setRetailPrice(this.retailPrice);
        variants.add(variantItem);
    }

    public void setVariantItemTwoOpt() {
        for (String opt1Item : opt1Val) {
            for (String opt2Item : opt2Val) {
                Variant variantItem = new Variant();
                variantItem.setName(this.name + " " + opt1Item + " " + opt2Item);
                variantItem.setIsActive(true);
                variantItem.setWeightUnit(this.weightUnit);
                variantItem.setWeightValue(this.weightValue);
                variantItem.setImportPrice(this.importPrice);
                variantItem.setWholePrice(this.wholePrice);
                variantItem.setRetailPrice(this.retailPrice);
                variantItem.setOpt1(opt1Item);
                variantItem.setOpt2(opt2Item);
                variants.add(variantItem);
            }
        }
    }

    public void setVariantItemOpt1() {
        for (String opt1Item : opt1Val) {
            Variant variantItem = new Variant();
            variantItem.setName(this.name + " " + opt1Item);
            variantItem.setIsActive(true);
            variantItem.setWeightUnit(this.weightUnit);
            variantItem.setWeightValue(this.weightValue);
            variantItem.setImportPrice(this.importPrice);
            variantItem.setWholePrice(this.wholePrice);
            variantItem.setRetailPrice(this.retailPrice);
            variantItem.setOpt1(opt1Item);
            variants.add(variantItem);
        }
    }

    public void setVariantItemOpt2() {
        for (String opt2Item : opt2Val) {
            Variant variantItem = new Variant();
            variantItem.setName(this.name + " " + opt2Item);
            variantItem.setIsActive(true);
            variantItem.setWeightUnit(this.weightUnit);
            variantItem.setWeightValue(this.weightValue);
            variantItem.setImportPrice(this.importPrice);
            variantItem.setWholePrice(this.wholePrice);
            variantItem.setRetailPrice(this.retailPrice);
            variantItem.setOpt2(opt2Item);
            variants.add(variantItem);
        }
    }


}

/*

    "name": "products",
    "code": "1212",
    "weight": "100",
    "description": "mo ta san pham ",
    "opt1": "Kích thước",
    "opt2": "Màu sắc",
    "opt1Val": [
        "S",
        "M",
        "L"
    ],
    "opt2Val": [
        "Đen",
        "Trắng"
    ],
    "type": "normal",
    "inputPrice": 100000,
    "wholePrice": 120000,
    "retailPrice": 150000,
    "weightUnit": "g"

 */
