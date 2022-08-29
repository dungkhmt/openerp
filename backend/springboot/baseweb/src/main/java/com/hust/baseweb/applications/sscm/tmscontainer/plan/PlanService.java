package com.hust.baseweb.applications.sscm.tmscontainer.plan;

import com.hust.baseweb.applications.sscm.tmscontainer.model.PlanResponseItem;
import com.hust.baseweb.applications.sscm.tmscontainer.model.VariantQuantity;
import com.hust.baseweb.applications.sscm.tmscontainer.repository.ShelfRepository;
import com.hust.baseweb.applications.sscm.tmscontainer.repository.ShelfVariantRepository;
import com.hust.baseweb.applications.sscm.tmscontainer.repository.VariantRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlanService {

    ModelMapper mapper = new ModelMapper();

    @Autowired
    private ShelfRepository shelfRepository;

    @Autowired
    private ShelfVariantRepository shelfVariantRepository;

    @Autowired
    private VariantRepository variantRepository;


    public List<PlanResponseItem> searchPlan(String string) {
        // TO BE REVISED
        return null;

//        return CpSatExample.searchSolution(string);

        /*
        List<PickupPoint> solution = PlanSolution.searchSolution(string);

        List<PlanResponseItem> res = solution.stream().map(point -> {
            PlanResponseItem item = new PlanResponseItem();
            item.setShelfId(point.pointId);
            item.setShelf(shelfRepository.getOne(point.pointId));
            List<VariantQuantity> variantQuantities = new ArrayList<>();
            point.quantityProduct.forEach((k, v) -> {
                if( k != 0 && v != 0){
                    VariantQuantity variantQuantity = new VariantQuantity();
                    variantQuantity.setQuantity(v);
                    variantQuantity.setVariantId(k);
                    variantQuantity.setVariant(variantRepository.findById(k).orElse(null));
                    variantQuantities.add(variantQuantity);
                }
                item.setVariantQuantityList(variantQuantities);
            });
            return item;
        }).collect(Collectors.toList());
        return  res;
         */
    }
}
