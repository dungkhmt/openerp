package com.hust.baseweb.applications.sscm.tmscontainer.service;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.LineItem;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.ShelfLineItem;
import com.hust.baseweb.applications.sscm.tmscontainer.model.ShelfLineItemResponse;
import com.hust.baseweb.applications.sscm.tmscontainer.repository.LineItemRepository;
import com.hust.baseweb.applications.sscm.tmscontainer.repository.ProductRepository;
import com.hust.baseweb.applications.sscm.tmscontainer.repository.ShelfLineItemRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ShelfLineItemService {

    ModelMapper mapper = new ModelMapper();

    @Autowired
    private ShelfLineItemRepository shelfLineItemRepository;

    @Autowired
    private LineItemRepository lineItemRepository;

    @Autowired
    private ProductService productService;

    public ShelfLineItemResponse putIntoShelf(ShelfLineItem shelfLineItem) throws Exception {
// validate số lượng nhập vào phải <= số lượng có trong lineItem
        List<ShelfLineItem> shelfLineItems = shelfLineItemRepository.findAllByShelfId(shelfLineItem.getShelfId());

        ShelfLineItem findVariant = shelfLineItems
            .stream()
            .filter(lineItem -> lineItem.getLineItemId() == shelfLineItem.getLineItemId())
            .findAny()
            .orElse(null);
        ShelfLineItem shelfLineItemRes = new ShelfLineItem();

        if (findVariant != null) {
            LineItem lineItem = lineItemRepository.findById(shelfLineItem.getLineItemId()).orElse(null);
            BigDecimal currentQuantity = lineItem.getCurrentQuantity();
            if(currentQuantity.compareTo(shelfLineItem.getQuantity()) < 0){
                throw new Exception("số lượng không đủ");
            }
            lineItem.setCurrentQuantity(currentQuantity.subtract(shelfLineItem.getQuantity()));
            lineItemRepository.save(lineItem);
            productService.addVariantAvailable(lineItem.getVariantId(),shelfLineItem.getQuantity());
            addQuantity(findVariant, shelfLineItem);


            shelfLineItemRes = shelfLineItemRepository.save(findVariant);
            ShelfLineItemResponse res = mapper.map(shelfLineItemRes, ShelfLineItemResponse.class);
            List<LineItem> lineItems = shelfLineItems.stream().map(line -> line.getLineItemId()).map(id -> {
                return lineItemRepository.findById(id).orElse(null);
            }).collect(
                Collectors.toList());

            res.setLineItems(lineItems);
            return res;
        } else {
            LineItem lineItem = lineItemRepository.findById(shelfLineItem.getLineItemId()).orElse(null);
            BigDecimal currentQuantity = lineItem.getCurrentQuantity();
            if(currentQuantity.compareTo(shelfLineItem.getQuantity()) < 0){
                throw new Exception("số lượng không đủ");
            }
            lineItem.setCurrentQuantity(currentQuantity.subtract(shelfLineItem.getQuantity()));
            lineItemRepository.save(lineItem);
            shelfLineItemRes = shelfLineItemRepository.save(shelfLineItem);
            productService.addVariantAvailable(lineItem.getVariantId(),shelfLineItem.getQuantity());


            ShelfLineItemResponse res = mapper.map(shelfLineItemRes, ShelfLineItemResponse.class);
            List<ShelfLineItem> newShelfLineItems = shelfLineItemRepository.findAllByShelfId(shelfLineItem.getShelfId());
            List<LineItem> lineItems = newShelfLineItems.stream().map(line -> line.getLineItemId()).map(id -> {
                return lineItemRepository.findById(id).orElse(null);
            }).collect(
                Collectors.toList());

            res.setLineItems(lineItems);
            return res;

        }


    }


    private void addQuantity(ShelfLineItem shelfLineItem, ShelfLineItem shelfLineItemAdd) {
        BigDecimal currentquantity = shelfLineItem.getQuantity();
        shelfLineItem.setQuantity(currentquantity.add(shelfLineItemAdd.getQuantity()));
    }

}
