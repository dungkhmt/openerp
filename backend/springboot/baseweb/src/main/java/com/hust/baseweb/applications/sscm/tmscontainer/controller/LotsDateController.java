package com.hust.baseweb.applications.sscm.tmscontainer.controller;


import com.hust.baseweb.applications.sscm.tmscontainer.entity.LotsDate;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.Product;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.Variant;
import com.hust.baseweb.applications.sscm.tmscontainer.model.FacilityRequest;
import com.hust.baseweb.applications.sscm.tmscontainer.model.FacilityResponse;
import com.hust.baseweb.applications.sscm.tmscontainer.model.LotsDateUpdateRequest;
import com.hust.baseweb.applications.sscm.tmscontainer.repository.LotsDateRepository;
import com.hust.baseweb.applications.sscm.tmscontainer.repository.ProductRepository;
import com.hust.baseweb.applications.sscm.tmscontainer.repository.VariantRepository;
import com.hust.baseweb.applications.sscm.tmscontainer.service.ShelvesService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@AllArgsConstructor(onConstructor_ = @Autowired)

@RequestMapping("/admin/wms/warehouse/lots")
@CrossOrigin()
@RestController
public class LotsDateController {

    @Autowired
    private LotsDateRepository lotsDateRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private VariantRepository variantRepository;


    @PostMapping("")
    public LotsDate createLots(@RequestBody @Valid LotsDate lotsDate) {

//        cập nhật onhand khi tạo mới lô
        return lotsDateRepository.save(lotsDate);
    }

    @GetMapping("/{id}")
    public LotsDate getById(@PathVariable Integer id){
        return lotsDateRepository.findById(id).orElse(null);
    }
    @GetMapping("/variant/{variant_id}")
    public List<LotsDate> getByVariant(@PathVariable Integer id){
       return findLotsByVariant(id);
    }

    @GetMapping("/product/{product_id}")
    public List<LotsDate> getByProduct(@PathVariable Integer id) throws Exception{
        Product product = productRepository.findById(id).orElse(null);
        if(product == null ) throw  new Exception("khong tim thay san pham");
        List<LotsDate> lotsDates = new ArrayList<LotsDate>();
        for(Variant v: product.getVariants()){
            lotsDates.addAll(findLotsByVariant(v.getId()));
        }
        return lotsDates;
    }


    // chỉ cho phép update số lượng của lotsDate, khi update thì update cả onhand và available
    @PutMapping("/{id}")
    public LotsDate updateLotsDate(@PathVariable Integer id, @RequestBody @Valid LotsDateUpdateRequest request) throws Exception {
        LotsDate lots = lotsDateRepository.findById(id).orElse(null);
        if(lots == null ) throw new Exception("lô sản phẩm không đúng");
        BigDecimal quantity = lots.getQuantity();
        lots.setQuantity(request.getQuantity());
        if(quantity != request.getQuantity()){
            BigDecimal adjusment = request.getQuantity().subtract(quantity);
            Variant variant = variantRepository.getOne(lots.getVariantId());
            variant.setOnHand(variant.getOnHand().add(adjusment));
            variant.setAvailable(variant.getAvailable().add(adjusment));
            variantRepository.save(variant);
        }
        return lotsDateRepository.save(lots);
    }

    private List<LotsDate> findLotsByVariant(Integer vatiantId){
        return lotsDateRepository.findAllByVariantId(vatiantId);
    }

}

// form nhập hàng vào kho thì thêm số lô



