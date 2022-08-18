package com.hust.baseweb.applications.sscm.tmscontainer.service;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.ImportLineItem;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.Product;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.ShelfVariant;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.Variant;
import com.hust.baseweb.applications.sscm.tmscontainer.model.ImportLineItemResponse;
import com.hust.baseweb.applications.sscm.tmscontainer.model.ProductRequest;
import com.hust.baseweb.applications.sscm.tmscontainer.model.ProductResponse;
import com.hust.baseweb.applications.sscm.tmscontainer.model.ShelfVariantResponse;
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
    private ImportLineItemRepository importLineItemRepository;

    @Autowired
    private ShelfVariantRepository shelfVariantRepository;

    @Autowired
    private ShelfVariantService shelfVariantService;


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
        ProductResponse productRes = mapper.map(res, ProductResponse.class);
        productRes.setQuantity();

        return productRes;
    }

    public ProductResponse getProductById(Integer id) throws Exception {
        Product product = productRepository.findById(id).orElse(null);
        if (product == null) {
            throw new Exception(
                "khong tim thay san pham "
            );
        }
        ProductResponse productRes = mapper.map(product, ProductResponse.class);
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

    public List<Variant> getAllVariantsActive() {
        List<Variant> res =  variantRepository.findAll().stream().filter(variant -> variant.checkStatus(variant) == true).collect(Collectors.toList());
        return res;
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
        updateVariant(productRequest.getVariants(), variants, product);
        productRepository.save(product);
        ProductResponse productRes = mapper.map(product, ProductResponse.class);
        productRes.setQuantity();
        return productRes;
    }


    private void updateVariant(List<Variant> variantRequests, List<Variant> variants, Product product) throws Exception {

        List<Integer> variantIds = variantRequests
            .stream()
            .map(Variant::getId)
            .filter(li -> li > 0)
            .collect(Collectors.toList());

        for (Variant variantItem : variants) {
            if (!variantIds.contains(variantItem.getId())) {
                Variant variant = variantRepository.getOne(variantItem.getId());
                if( variant.getAvailable().compareTo(BigDecimal.ZERO) > 0 ||  variant.getOnHand().compareTo(BigDecimal.ZERO) > 0){
                    throw new Exception("Không thể xóa phiên bản sản phẩm đang còn hàng");
                }else{
                removeVariant(variants, variantItem, product);
                }
            }
        }

        for (Variant variantItem : variantRequests) {
            if (variantItem.getId() == 0) {
                addVariant(variants, variantItem, product);
            } else {
                Variant variantItemUpdate = variants
                    .stream().filter(li -> li.getId() == variantItem.getId()).findFirst().orElse(null);
                assert variantItemUpdate != null;
                variantItemUpdate.update(variantItem);
            }
        }
    }


    private void removeVariant(List<Variant> variants, Variant variantItem,Product product) {
        variants.remove(variantItem);
        variantItem.setProduct(null);
        variantItem.setIsActive(false);
    }

    private void addVariant(List<Variant> variants, Variant variantItem, Product product) {
        long variantCurrentId = variantRepository.count();
        setVariantSku(variantItem,variantCurrentId + 1);
        variantItem.setIsActive(true);
        variantItem.setProduct(product);
        variants.add(variantItem);
    }

    public void deleteProductById(Integer id) throws Exception {
        Product product = productRepository.findById(id).orElse(null);
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
        Variant variant = variantRepository.getOne(variantId);
        BigDecimal currentOnhand = variant.getOnHand();
        if (currentOnhand == null) {
            currentOnhand = BigDecimal.ZERO;
        }
        variant.setOnHand(currentOnhand.add(quantity));
        variantRepository.save(variant);
    }

    // lấy sản phẩm ra khỏi kho
    public void subVariantOnHand(Integer variantId, BigDecimal quantity) {
        Variant variant = variantRepository.getOne(variantId);
        BigDecimal currentOnhand = variant.getOnHand();
        if (currentOnhand == null) {
            currentOnhand = BigDecimal.ZERO;
        }
        variant.setOnHand(currentOnhand.subtract(quantity));
        variantRepository.save(variant);
    }

    // thêm sản phẩm lên kệ
    public void addVariantAvailable(Integer variantId, BigDecimal quantity) {
        Variant variant = variantRepository.getOne(variantId);
        BigDecimal currentAvailable = variant.getAvailable();
        if (currentAvailable == null) {
            currentAvailable = BigDecimal.ZERO;
        }
        variant.setAvailable(currentAvailable.add(quantity));
        variantRepository.save(variant);
    }

    // lấy sản phẩm ra khỏi kệ
    public void subVariantAvailable(Integer variantId, BigDecimal quantity) {
        Variant variant = variantRepository.getOne(variantId);
        BigDecimal currentAvailable = variant.getAvailable();
        if (currentAvailable == null) {
            currentAvailable = BigDecimal.ZERO;
        }
        variant.setAvailable(currentAvailable.subtract(quantity));
        variantRepository.save(variant);
    }

    public void setVariantSku(Variant variant, Long num) {
        variant.setSku("PRD00" + num);
    }

    public List<ProductResponse> getAllProductsByFacility(Integer id) {
        List<Integer> shelfIds = shelvesService.findShelfByFacilityId(id);// lấy id các shelf
        List<Integer> lineItemsIds = shelfVariantRepository.findByShelfIds(shelfIds); // tìm lineItem trong shelf
        List<ImportLineItem> importLineITems = importLineItemRepository.findAllByIds(lineItemsIds); // lấy ra lineItem
        List<Integer> variantIds = importLineITems.stream().map(lineItem -> lineItem.getVariantId()).collect(Collectors.toList());
        List<Variant> variants = variantRepository.findAllByIds(variantIds);
        List<Product> products = variantRepository.findAllProductByVariantIds(variantIds);

//        for (Product product : products) {
//            List<Variant> variantInProduct = product.getVariants();
//            for (Variant v : variantInProduct) {
//                for (ImportLineItem item : importLineITems) {
//                    if (v.getId() == item.getVariantId()) {
//                        if (item.getQuantity() == null) {
//                            item.setQuantity(BigDecimal.ZERO);
//                        }
//                        if (item.getCurrentQuantity() == null) {
//                            item.setCurrentQuantity(BigDecimal.ZERO);
//                        }
//                        v.setAvailable(item.getQuantity().subtract(item.getCurrentQuantity()));
//                        v.setOnHand(item.getQuantity());
//                    }
//                }
//            }
//        }

        List<ProductResponse> res = products.stream().map(product -> {
            return mapper.map(product, ProductResponse.class);
        }).map(productResponse -> {
            productResponse.setQuantity();
            return productResponse;
        }).collect(Collectors.toList());
        return res;
    }

    public List<Variant> getAllVariantsByFacilityId(Integer id) {
        List<Integer> shelfIds = shelvesService.findShelfByFacilityId(id);// lấy id các shelf

        List<Variant> variants = shelfVariantService.getAllVariantByShelfIds(shelfIds);

        return variants;
    }

    public List<ImportLineItemResponse> getAllProductInShelf(Integer id) {
        List<ShelfVariant> shelfLineItems= shelfVariantRepository.findAllByShelfId(id);

        List<ImportLineItem> importLineItems = new ArrayList<ImportLineItem>();

        for(ShelfVariant item : shelfLineItems){
            ImportLineItem importLineItem = importLineItemRepository.findById(item.getLineItemId()).orElse(null);
            importLineItems.add(importLineItem);
        }
        return  importLineItems
            .stream().map(lineItem -> mapLineItemInShelf(lineItem)).sorted(Comparator.comparingInt(
                ImportLineItemResponse::getId)).collect(Collectors.toList());
    }

    public List<ShelfVariantResponse> getAllVariantInShelf(Integer id) {
        List<ShelfVariant> shelfVariants = shelfVariantRepository.findAllByShelfId(id);

        List<ShelfVariantResponse> res = shelfVariants.stream().map(shelfVariant -> {
           return mapper.map(shelfVariant,ShelfVariantResponse.class);
        }).map(shelfVariantResponse -> {
            Variant variant = variantRepository.getOne(shelfVariantResponse.getVariantId());
            shelfVariantResponse.setVariant(variant);
            shelfVariantResponse.setProductId(variant.getProduct().getId());
            return shelfVariantResponse;
        }).collect(Collectors.toList());
        return res;
    }





    public List<ImportLineItemResponse> getAllVariantImport(Integer id) {
        List<ImportLineItem> importLineItems = importLineItemRepository.findAllByVariantId(id);
        List<ImportLineItemResponse> res = importLineItems
            .stream().map(lineItem -> {return mapper.map(lineItem, ImportLineItemResponse.class);}).collect(
            Collectors.toList());
        return res;
    }

    public ImportLineItemResponse mapLineItemInShelf(ImportLineItem importLineItem){
        Product product = variantRepository.getOne(importLineItem.getVariantId()).getProduct();
        ImportLineItemResponse res = mapper.map(importLineItem, ImportLineItemResponse.class);
        res.setProductId(product.getId());
        return res;
    }

    public List<ShelfVariant> getAllShelfVariantInFacility(Integer id) {
        // lây danh sách shelf id
        List<Integer> shelfIds = shelvesService.findShelfByFacilityId(id);// lấy id các shelf
        // lấy danh sách sản phẩm trong shelf id
        List<ShelfVariant> shelfVariants = shelfVariantRepository.findAllByShelfIds(shelfIds);
        // lưu tất cả vào 1 mảng

    return shelfVariants;
    }
}
