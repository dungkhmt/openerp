package com.hust.baseweb.applications.sscm.tmscontainer.service;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.*;
import com.hust.baseweb.applications.sscm.tmscontainer.model.ImportOrderResponse;
import com.hust.baseweb.applications.sscm.tmscontainer.model.ImportLineItemResponse;
import com.hust.baseweb.applications.sscm.tmscontainer.repository.ImportOrderRepository;
import com.hust.baseweb.applications.sscm.tmscontainer.repository.ShelfVariantRepository;
import com.hust.baseweb.applications.sscm.tmscontainer.repository.VariantRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ImportOrderService {

    ModelMapper mapper = new ModelMapper();

    @Autowired
    private ImportOrderRepository importOrderRepository;

    @Autowired
    private FacilitiesService facilitiesService;

    @Autowired
    private ProductService productService;

    @Autowired
    private ShelfVariantRepository shelfVariantRepository;

    @Autowired
    private VariantRepository variantRepository;


    public ImportOrderResponse creatImportOrder(ImportOrder importOrder) {
        if (importOrder.getLineItems() != null) {
            for (ImportLineItem item : importOrder.getLineItems()) {
                item.setImportOrder(importOrder);
                if (item.getQuantity() != null) {
                    item.setCurrentQuantity(item.getQuantity());
                    item.setOnHand(item.getQuantity());
//                    item.setAvailable();
                    productService.addVariantOnHand(item.getVariantId(), item.getQuantity());
                }
            }
        }
        setImportOrderCode(importOrder);

        ImportOrder importOrderRes = importOrderRepository.save(importOrder);
        ImportOrderResponse res = mapper.map(importOrderRes, ImportOrderResponse.class);
        res.setFacility(facilitiesService.getById(res.getFacilityId()));
        res.updateStatusImport();
        return res;
    }

    public ImportOrderResponse getById(Integer id) throws Exception {
        ImportOrder importOrder = importOrderRepository.findById(id).orElse(null);
        if (importOrder == null) {
            throw new Exception("khong tim thay don nhap hang");
        }
        List<ImportLineItemResponse> lineItemsRes = importOrder.getLineItems().stream().map(lineItem -> {
            return mapper.map(lineItem, ImportLineItemResponse.class);
        }).map(importLineItemResponse -> {
            Product product = variantRepository.getOne(importLineItemResponse.getVariantId()).getProduct();
            importLineItemResponse.setProductId(product.getId());
            return importLineItemResponse;
        }).collect(Collectors.toList());

        ImportOrderResponse res = mapper.map(importOrder, ImportOrderResponse.class);

        res.setFacility(facilitiesService.getById(res.getFacilityId()));
        res.setLineItems(lineItemsRes);
        res.updateStatusImport();
        return res;
    }

    public List<ImportOrderResponse> getAllImportOrder() {
        List<ImportOrderResponse> res = importOrderRepository
            .findAll()
            .stream()
            .map(importOrder -> mapper.map(importOrder, ImportOrderResponse.class))
            .collect(
                Collectors.toList());
        return res
            .stream()
            .map(importOrderResponse -> {
                importOrderResponse.setFacility(facilitiesService.getById(importOrderResponse.getFacilityId()));
                importOrderResponse.updateStatusImport();
                return importOrderResponse;
            }).collect(Collectors.toList());
//        return res;
    }

    public void setImportOrderCode(ImportOrder importOrder) {
        long currentCode = importOrderRepository.count();
        importOrder.setCode("IMP00" + currentCode);
    }

}
