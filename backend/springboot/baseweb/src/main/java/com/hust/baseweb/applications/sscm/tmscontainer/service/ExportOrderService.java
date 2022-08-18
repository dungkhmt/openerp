package com.hust.baseweb.applications.sscm.tmscontainer.service;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.*;
import com.hust.baseweb.applications.sscm.tmscontainer.model.*;
import com.hust.baseweb.applications.sscm.tmscontainer.repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExportOrderService {

    ModelMapper mapper = new ModelMapper();

    @Autowired
    private ExportOrderRepository exportOrderRepository;

    @Autowired
    private ShelvesService shelvesService;

    @Autowired
    private ShelfRepository shelfRepository;

    @Autowired
    private ShelfVariantService shelfVariantService;

    @Autowired
    private FacilitiesService facilitiesService;

    @Autowired
    private ProductService productService;

    @Autowired
    private VariantRepository variantRepository;

    @Autowired
    private ShelfVariantRepository shelfVariantRepository;

    @Autowired
    private ExportLineItemRepository exportLineItemRepository;

    @Autowired
    private ExportShelfVariantRepository exportShelfVariantRepository;

    @Autowired
    private ImportLineItemRepository importLineItemRepository;


    public ExportOrderResponse createExportOrder(ExportOrder exportOrder) {
        if (exportOrder.getLineItems() != null) {
            for (ExportLineItem item : exportOrder.getLineItems()) {
                item.setExportOrder(exportOrder);
                if (item.getQuantity() != null) {
                    item.setTotalQuantity(item.getQuantity());
                }
            }
        }
        setExportOrderCode(exportOrder);

        ExportOrder exportOrderRes = exportOrderRepository.save(exportOrder);
        ExportOrderResponse res = mapper.map(exportOrderRes, ExportOrderResponse.class);
        res.setFacility(facilitiesService.getById(res.getFacilityId()));
        return res;
    }

    public void setExportOrderCode(ExportOrder exportOrder) {
        long currentCode = exportOrderRepository.count();
        long index = currentCode + 1;
        exportOrder.setCode("EXP00" + index);
    }


    public ExportOrderResponse getById(Integer id) throws Exception {
        ExportOrder exportOrder = exportOrderRepository.findById(id).orElse(null);
        if (exportOrder == null) {
            throw new Exception("Không tìm thấy đơn xuất hàng ");
        }
        List<ExportLineItemResponse> lineItemsRes = exportOrder.getLineItems().stream().map(exportLineItem -> {
            return mapper.map(exportLineItem, ExportLineItemResponse.class);
        }).map(exportLineItemResponse -> {
            Product product = variantRepository.getOne(exportLineItemResponse.getVariantId()).getProduct();
            exportLineItemResponse.setProductId(product.getId());
            exportLineItemResponse.setVariant(variantRepository.getOne(exportLineItemResponse.getVariantId()));
            // lấy danh sách exportShelfVariant theo exportLineItemId
            setShelfVariantInExportLineItem(exportLineItemResponse);
//            exportLineItemResponse.setEx

            return exportLineItemResponse;
        }).sorted(Comparator.comparingInt(ExportLineItemResponse::getId)).collect(Collectors.toList());
        ExportOrderResponse res = mapper.map(exportOrder, ExportOrderResponse.class);
        res.setFacility(facilitiesService.getById(res.getFacilityId()));
        res.setLineItems(lineItemsRes);
        res.updateStatusExport();

        List<Integer> shelfIds = shelvesService.findShelfByFacilityId(exportOrder.getFacilityId());// lấy id các shelf
        List<ShelfVariant> shelfVariants = shelfVariantRepository.findAllByShelfIds(shelfIds); // tìm shelfVariants trong shelf_variant
        res.getFacility().setShelfVariants(shelfVariants);
        return res;

    }

    private void setShelfVariantInExportLineItem(ExportLineItemResponse exportLineItemResponse) {
        List<ExportShelfVariant> exportShelfVariants = exportShelfVariantRepository.findByExportLineItemId(
            exportLineItemResponse.getId());
        List<ExportShelfVariantResponse> shelfVariantResponses = exportShelfVariants
            .stream()
            .map(exportShelfVariant -> {
                ExportShelfVariantResponse exportShelfVariantResponse = mapper.map(
                    exportShelfVariant,
                    ExportShelfVariantResponse.class);
                exportShelfVariantResponse.setShelfVariant(shelfVariantRepository.getOne(exportShelfVariant.getShelfVariantId()));
                exportShelfVariantResponse.setShelfNum(shelfRepository
                                                           .getOne(exportShelfVariantResponse
                                                                       .getShelfVariant()
                                                                       .getShelfId())
                                                           .getNum());

                return exportShelfVariantResponse;
            })
            .collect(Collectors.toList());
        exportLineItemResponse.setExportShelfVariantResponses(shelfVariantResponses);
    }
//    public ImportOrderResponse getByFacilityId(Integer id) {
//        List<Shelf> shelves =  shelvesService.getListShelves(id);
//        List<Integer> shelfIds = shelves.stream().map(Shelf::getShelfId).collect(Collectors.toList());
//
//    }

    public List<ExportOrderResponse> getAllExportOrder() {
        List<ExportOrderResponse> res = exportOrderRepository
            .findAll()
            .stream()
            .map(exportOrder -> mapper.map(exportOrder, ExportOrderResponse.class))
            .collect(
                Collectors.toList());
        return res
            .stream()
            .map(exportOrderResponse -> {
                exportOrderResponse.setFacility(facilitiesService.getById(exportOrderResponse.getFacilityId()));
                exportOrderResponse.updateStatusExport();
                return exportOrderResponse;
            }).collect(Collectors.toList());
//        return res;
    }

    public List<ShelfVariant> getShelfByVariantId(Integer id) {
        return shelfVariantService.getAllByVariantId(id);
    }

    public ExportLineItemResponse createExportShelfVariant(ExportShelfVariantRequest exportShelfVariantRequest) {
// check nếu tổng số lượng lớn hơn cần lấy thì cập nhật lại số lượng cần lấy trong exportLineItem
        // tổng  số lượng lấy bằng tổng số lượng dự định + số lượng lấy thêm

        if (exportShelfVariantRequest.getGetQuantity().compareTo(exportShelfVariantRequest.getSumQuantity()) < 0) {
            ExportLineItem exportLineItem = exportLineItemRepository.getOne(exportShelfVariantRequest.getExportLineItemId());
            exportLineItem.setTotalQuantity(exportShelfVariantRequest.getSumQuantity());
            exportLineItem.setQuantity(exportShelfVariantRequest.getSumQuantity());
            exportLineItemRepository.save(exportLineItem);
        }
        // nếu không có ExportShelfVariantRequest id thì xóa
        //    // xứ lý nếu cùng 1 exportLineItem lấy ra ở cùng 1 kệ thì : nếu trong bảng là đã lấy, mới là chưa lấy thì tạo mới, bảng là đã lấy, mới là đã lấy thì cộng


        List<ExportShelfVariant> exportShelfVariants = exportShelfVariantRequest.getShelfVariants();

        List<ExportShelfVariant> exportShelfVariantsOld = exportShelfVariantRepository.findByExportLineItemId(
            exportShelfVariantRequest.getExportLineItemId());



        List<ExportShelfVariantResponse> res = exportShelfVariants.stream().map(exportShelfVariant -> {
            if (exportShelfVariant.getId() == 0) {
                exportShelfVariantRepository.save(exportShelfVariant);
            } else {
                List<Integer> exportShelfVariantsOldIds = exportShelfVariantsOld
                    .stream()
                    .map(ExportShelfVariant::getId)
                    .collect(Collectors.toList());

                List<Integer> exportShelfVariantsNewIds = exportShelfVariants
                    .stream()
                    .map(ExportShelfVariant::getId)
                    .collect(Collectors.toList());

                List<Integer> differences = exportShelfVariantsOldIds
                    .stream()
                    .filter(e -> !exportShelfVariantsNewIds.contains(e))
                    .collect(
                        Collectors.toList());

                List<Integer> common = exportShelfVariantsOldIds
                    .stream()
                    .filter(e -> exportShelfVariantsNewIds.contains(e))
                    .collect(
                        Collectors.toList());

                for(Integer id : differences){
                    exportShelfVariantRepository.deleteById(id);
                }
                for(Integer id : common){
                    exportShelfVariantRepository.save(exportShelfVariant);
                }
            }

            return mapper.map(exportShelfVariant, ExportShelfVariantResponse.class);
        }).collect(Collectors.toList());


        ExportLineItem exportLineItem = exportLineItemRepository
            .findById(exportShelfVariantRequest.getExportLineItemId())
            .orElse(null);
        ExportLineItemResponse response = mapper.map(exportLineItem, ExportLineItemResponse.class);
        response.setExportShelfVariantResponses(res);
        return response;
    }

    @Transactional
    public ExportShelfVariant confirmExported(ExportShelfVariant exportShelfVariant) throws Exception {
        // cập nhật trạng thái ExportShelfVariant //
        // cập nhật số lượng trong ExportLineItem
        // cập nhật  số lượng Variant trong ShelfVariant
        // cập nhật số lượng Variant trong kho
        // cập nhật số lượng Variant trong tổng kho

        // cập nhật trạng thái ExportShelfVariant
        exportShelfVariant.setExported(true);

        // cập nhật số lượng trong ExportLineItem
        ExportLineItem exportLineItem = exportLineItemRepository.getOne(exportShelfVariant.getExportLineItemId());
        BigDecimal currentQuantity = exportLineItem.getQuantity();
        exportLineItem.setQuantity(currentQuantity.subtract(exportShelfVariant.getQuantity()));
        exportLineItemRepository.save(exportLineItem);

        // cập nhật  số lượng Variant trong ShelfVariant
        ShelfVariant shelfVariant = shelfVariantRepository.getOne(exportShelfVariant.getShelfVariantId());
        if(shelfVariant.getQuantity().compareTo(exportShelfVariant.getQuantity()) >= 0){
        shelfVariant.setQuantity(shelfVariant.getQuantity().subtract(exportShelfVariant.getQuantity()));
        shelfVariantRepository.save(shelfVariant);
        }else{
            throw new Exception("Số lượng không đủ");
        }

        // cập nhật số lượng Variant trong kho (ImportLineItem)
        ImportLineItem importLineItem = importLineItemRepository.getOne(shelfVariant.getLineItemId());
        importLineItem.setOnHand(importLineItem.getOnHand().subtract(exportShelfVariant.getQuantity()));
        importLineItem.setAvailable(importLineItem.getAvailable().subtract(exportShelfVariant.getQuantity()));
        importLineItemRepository.save(importLineItem);

        // cập nhật số lượng Variant trong tổng kho
        productService.subVariantAvailable(shelfVariant.getVariantId(), exportShelfVariant.getQuantity());
        productService.subVariantOnHand(shelfVariant.getVariantId(), exportShelfVariant.getQuantity());

        exportShelfVariantRepository.save(exportShelfVariant);
        return exportShelfVariant;
    }
}
