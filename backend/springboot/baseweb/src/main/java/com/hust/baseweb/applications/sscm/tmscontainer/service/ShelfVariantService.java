package com.hust.baseweb.applications.sscm.tmscontainer.service;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.ImportLineItem;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.ShelfVariant;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.Variant;
import com.hust.baseweb.applications.sscm.tmscontainer.model.ShelfVariantResponse;
import com.hust.baseweb.applications.sscm.tmscontainer.repository.ImportLineItemRepository;
import com.hust.baseweb.applications.sscm.tmscontainer.repository.ShelfVariantRepository;
import com.hust.baseweb.applications.sscm.tmscontainer.repository.VariantRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShelfVariantService {

    ModelMapper mapper = new ModelMapper();

    @Autowired
    private ShelfVariantRepository shelfVariantRepository;

    @Autowired
    private ImportLineItemRepository importLineItemRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private VariantRepository variantRepository;

    public ShelfVariantResponse putIntoShelf(ShelfVariant shelfVariant) throws Exception {
// validate số lượng nhập vào phải <= số lượng có trong lineItem

        List<ShelfVariant> shelfVariants = shelfVariantRepository.findAllByShelfId(shelfVariant.getShelfId());

        ShelfVariant findVariant = shelfVariants
            .stream()
            .filter(lineItem -> lineItem.getVariantId() == shelfVariant.getVariantId())
            .findAny()
            .orElse(null);
        ShelfVariant shelfLineItemRes = new ShelfVariant();

        if (findVariant != null) {
            ImportLineItem importLineItem = importLineItemRepository.findById(shelfVariant.getLineItemId()).orElse(null);

            BigDecimal currentQuantity = importLineItem.getCurrentQuantity();
            if(currentQuantity.compareTo(shelfVariant.getQuantity()) < 0){
                throw new Exception("số lượng không đủ");
            }
            importLineItem.setCurrentQuantity(currentQuantity.subtract(shelfVariant.getQuantity()));

            // cập nhật số lượng có thể bán
            importLineItem.setAvailable(importLineItem.getAvailable().add(shelfVariant.getQuantity()));
            importLineItemRepository.save(importLineItem);
            if(importLineItem.getAvailable() == null){
                importLineItem.setAvailable(BigDecimal.ZERO);
            }
            productService.addVariantAvailable(importLineItem.getVariantId(), shelfVariant.getQuantity());
            addQuantity(findVariant, shelfVariant);


            shelfLineItemRes = shelfVariantRepository.save(findVariant);
            ShelfVariantResponse res = mapper.map(shelfLineItemRes, ShelfVariantResponse.class);
            List<ImportLineItem> importLineItems = shelfVariants.stream().map(line -> line.getLineItemId()).map(id -> {
                return importLineItemRepository.findById(id).orElse(null);
            }).collect(
                Collectors.toList());

            res.setImportLineItems(importLineItems);
            return res;
        } else {
            ImportLineItem importLineItem = importLineItemRepository.findById(shelfVariant.getLineItemId()).orElse(null);
            BigDecimal currentQuantity = importLineItem.getCurrentQuantity();
            if(currentQuantity.compareTo(shelfVariant.getQuantity()) < 0){
                throw new Exception("số lượng không đủ");
            }
            importLineItem.setCurrentQuantity(currentQuantity.subtract(shelfVariant.getQuantity()));
            // cập nhật số lượng có thể bán
            if(importLineItem.getAvailable() == null){
                importLineItem.setAvailable(BigDecimal.ZERO);
            }
            importLineItem.setAvailable(importLineItem.getAvailable().add(shelfVariant.getQuantity()));
            importLineItemRepository.save(importLineItem);

            shelfLineItemRes = shelfVariantRepository.save(shelfVariant);
            productService.addVariantAvailable(importLineItem.getVariantId(), shelfVariant.getQuantity());


            ShelfVariantResponse res = mapper.map(shelfLineItemRes, ShelfVariantResponse.class);
            List<ShelfVariant> newShelfLineItems = shelfVariantRepository.findAllByShelfId(shelfVariant.getShelfId());
            List<ImportLineItem> importLineItems = newShelfLineItems.stream().map(line -> line.getLineItemId()).map(id -> {
                return importLineItemRepository.findById(id).orElse(null);
            }).collect(
                Collectors.toList());

            res.setImportLineItems(importLineItems);
            return res;

        }


    }

    private void addQuantity(ShelfVariant shelfVariant, ShelfVariant shelfLineItemAdd) {
        BigDecimal currentquantity = shelfVariant.getQuantity();
        shelfVariant.setQuantity(currentquantity.add(shelfLineItemAdd.getQuantity()));
    }

    public  List<Variant> getAllVariantByShelfIds(List<Integer> ids){
        List<ShelfVariant> shelfVariants = shelfVariantRepository.findAllByShelfIds(ids);
        List<Integer> variantIds = shelfVariantRepository.findAllVariantIdByShelfId(ids);
        List<Variant> variants = variantRepository.findAllByIds(variantIds);
        List<Variant> res = variants.stream().map(variant -> {variant.setAvailable(BigDecimal.ZERO); return variant;}).collect(
            Collectors.toList());

        for(Variant variant: res){
            for( ShelfVariant shelfVariant : shelfVariants )
            if(shelfVariant.getVariantId() != null && variant.getId() == shelfVariant.getVariantId()){
                variant.setAvailable(variant.getAvailable().add(shelfVariant.getQuantity()));
            }
        }
        return res;
    }

    public List<ShelfVariant> getAllByVariantId(Integer id) {
        return shelfVariantRepository.findAllByVariantId(id);
    }
}
