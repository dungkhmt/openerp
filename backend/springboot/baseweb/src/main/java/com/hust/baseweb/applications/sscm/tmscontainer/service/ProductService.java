package com.hust.baseweb.applications.sscm.tmscontainer.service;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.LineItem;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.Product;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.ShelfLineItem;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.Variant;
import com.hust.baseweb.applications.sscm.tmscontainer.model.LineItemResponse;
import com.hust.baseweb.applications.sscm.tmscontainer.model.ProductRequest;
import com.hust.baseweb.applications.sscm.tmscontainer.model.ProductResponse;
import com.hust.baseweb.applications.sscm.tmscontainer.model.ShelfLineItemResponse;
import com.hust.baseweb.applications.sscm.tmscontainer.repository.*;
import com.hust.baseweb.applications.sscm.tmscontainer.utils.Const;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    ModelMapper mapper = new ModelMapper();

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private VariantRepository variantRepository;

    @Autowired
    private ShelvesService shelvesService;

    @Autowired
    private LineItemRepository lineItemRepository;

    @Autowired
    private ShelfLineItemRepository shelfLineItemRepository;


    public ProductResponse createProduct(ProductRequest productRequest) {
        Product checkCode = productRepository.findProductByCode(productRequest.getCode());
        if(checkCode != null){
            throw new RuntimeException("Mã sản phẩm đã tồn tại");
        }

        productRequest.setForCreate();
        Product product = new Product(productRequest);
        long variantCurrentId = variantRepository.count();
        for (Variant item : product.getVariants()) {
            item.setProduct(product);
            setVariantSku(item, variantCurrentId);
            variantCurrentId = variantCurrentId + 1;
        }
//        product.setVariants(product.getVariants().stream().map(variant -> {variant.setProduct(product); return variant;}).collect(
//            Collectors.toList()));
        Product res = productRepository.save(product);
        var productRes = mapper.map(res, ProductResponse.class);
        productRes.setQuantity();

        return productRes;
    }

    public ProductResponse getProductById(Integer id) throws Exception {
        var product = productRepository.findById(id).orElse(null);
        if (product == null) {
            throw new Exception(
                "khong tim thay san pham "
            );
        }
        var productRes = mapper.map(product, ProductResponse.class);
        productRes.setQuantity();
        return productRes;
    }


    public List<ProductResponse> getAllProducts() {
        List<ProductResponse> productResponses = productRepository
            .findAll()
            .stream()
            .map(product -> mapper.map(product, ProductResponse.class))
            .map(productResponse -> {
                productResponse.setQuantity();
                return productResponse;
            })
            .collect(
                Collectors.toList());
        return productResponses;
    }

    public List<Variant> getAllVariants() {
        return variantRepository.findAll();
    }


    public ProductResponse updateById(Integer id, ProductRequest productRequest) throws Exception {
        Product product = productRepository.findById(id).orElse(null);
        if (product == null) {
            throw new Exception(
                "khong tim thay san pham "
            );
        }
        product.setCode(productRequest.getCode());
        product.setType(productRequest.getType().equals(Const.LOTS) ? Const.LOTS : Const.NORMAL);
        product.setDescription(productRequest.getDescription());
        product.setImage(productRequest.getImage());
        product.setOpt1(productRequest.getOpt1());
        product.setOpt2(productRequest.getOpt2());
        product.setOpt3(productRequest.getOpt3());
        product.setUpdateAt(new Date());
        List<Variant> variants = product.getVariants();
        updateVariant(productRequest.getVariants(), variants);
        productRepository.save(product);
        ProductResponse productRes = mapper.map(product, ProductResponse.class);
        productRes.setQuantity();
        return productRes;
    }


    private void updateVariant(List<Variant> variantRequests, List<Variant> variants) {

        List<Integer> variantIds = variantRequests
            .stream()
            .map(Variant::getId)
            .filter(li -> li > 0)
            .collect(Collectors.toList());

        for (Variant variantItem : variants) {
            if (!variantIds.contains(variantItem.getId())) {
                removeVariant(variants, variantItem);
            }
        }

        for (Variant variantItem : variantRequests) {
            if (variantItem.getId() == 0) {
                addVariant(variants, variantItem);
            } else {
                Variant variantItemUpdate = variants
                    .stream().filter(li -> li.getId() == variantItem.getId()).findFirst().orElse(null);
                assert variantItemUpdate != null;
                variantItemUpdate.update(variantItem);
            }
        }
    }


    private void removeVariant(List<Variant> variants, Variant variantItem) {
        variants.remove(variantItem);
        variantItem.setProduct(null);
        variantItem.setIsActive(false);
    }

    private void addVariant(List<Variant> variants, Variant variantItem) {
        variantItem.setIsActive(true);
        variants.add(variantItem);
    }

    public void deleteProductById(Integer id) throws Exception {
        var product = productRepository.findById(id).orElse(null);
        if (product == null) {
            throw new Exception(
                "khong tim thay san pham "
            );
        }
        product.setIsActive(false);
        productRepository.save(product);
    }

    // thêm sản phẩm vào kho
    public void addVariantOnHand(Integer variantId, BigDecimal quantity) {
        var variant = variantRepository.getOne(variantId);
        var currentOnhand = variant.getOnHand();
        if (currentOnhand == null) {
            currentOnhand = BigDecimal.ZERO;
        }
        variant.setOnHand(currentOnhand.add(quantity));
        variantRepository.save(variant);
    }

    // lấy sản phẩm ra khỏi kho
    public void subVariantOnHand(Integer variantId, BigDecimal quantity) {
        var variant = variantRepository.getOne(variantId);
        var currentOnhand = variant.getOnHand();
        if (currentOnhand == null) {
            currentOnhand = BigDecimal.ZERO;
        }
        variant.setOnHand(currentOnhand.subtract(quantity));
        variantRepository.save(variant);
    }

    // thêm sản phẩm lên kệ
    public void addVariantAvailable(Integer variantId, BigDecimal quantity) {
        var variant = variantRepository.getOne(variantId);
        var currentAvailable = variant.getAvailable();
        if (currentAvailable == null) {
            currentAvailable = BigDecimal.ZERO;
        }
        variant.setAvailable(currentAvailable.add(quantity));
        variantRepository.save(variant);
    }

    // lấy sản phẩm ra khỏi kệ
    public void subVariantAvailable(Integer variantId, BigDecimal quantity) {
        var variant = variantRepository.getOne(variantId);
        var currentAvailable = variant.getAvailable();
        if (currentAvailable == null) {
            currentAvailable = BigDecimal.ZERO;
        }
        variant.setAvailable(currentAvailable.add(quantity));
        variantRepository.save(variant);
    }

    public void setVariantSku(Variant variant, Long num) {
        variant.setSku("PRD00" + num);
    }

    public List<ProductResponse> getAllProductsByFacility(Integer id) {
        var shelfIds = shelvesService.findShelfByFacilityId(id);// lấy id các shelf
        var lineItemsIds = shelfLineItemRepository.findByShelfIds(shelfIds); // tìm lineItem trong shelf
        var lineITems = lineItemRepository.findAllByIds(lineItemsIds); // lấy ra lineItem
        var variantIds = lineITems.stream().map(lineItem -> lineItem.getVariantId()).collect(Collectors.toList());
        var variants = variantRepository.findAllByIds(variantIds);
        var products = variantRepository.findAllProductByVariantIds(variantIds);

        for (Product product : products) {
            var variantInProduct = product.getVariants();
            for (Variant v : variantInProduct) {
                for (LineItem item : lineITems) {
                    if (v.getId() == item.getVariantId()) {
                        if (item.getQuantity() == null) {
                            item.setQuantity(BigDecimal.ZERO);
                        }
                        if (item.getCurrentQuantity() == null) {
                            item.setCurrentQuantity(BigDecimal.ZERO);
                        }
                        v.setAvailable(item.getQuantity().subtract(item.getCurrentQuantity()));
                        v.setOnHand(item.getQuantity());
                    }
                }
            }
        }

        var res = products.stream().map(product -> {
            return mapper.map(product, ProductResponse.class);
        }).map(productResponse -> {
            productResponse.setQuantity();
            return productResponse;
        }).collect(Collectors.toList());
        return res;
    }

    public List<LineItemResponse> getAllProductInShelf(Integer id) {
        var shelfLineItems= shelfLineItemRepository.findAllByShelfId(id);

        List<LineItem> lineItems = new ArrayList<LineItem>();

        for(ShelfLineItem item : shelfLineItems){
            var lineItem  = lineItemRepository.findById(item.getLineItemId()).orElse(null);
            lineItem.setOnHand(item.getQuantity());
            lineItems.add(lineItem);
        }
        return  lineItems.stream().map(lineItem -> mapLineItemInShelf(lineItem)).sorted(Comparator.comparingInt(LineItemResponse::getId)).collect(Collectors.toList());
    }


    public List<LineItemResponse> getAllVariantImport(Integer id) {
        var lineItems = lineItemRepository.findAllByVariantId(id);
        var res = lineItems.stream().map(lineItem -> {return mapper.map(lineItem, LineItemResponse.class);}).collect(
            Collectors.toList());
        return res;
    }

    public LineItemResponse mapLineItemInShelf(LineItem lineItem){
        var product = variantRepository.getOne(lineItem.getVariantId()).getProduct();
        var res = mapper.map(lineItem, LineItemResponse.class);
        res.setProductId(product.getId());
        return res;
    }
}
