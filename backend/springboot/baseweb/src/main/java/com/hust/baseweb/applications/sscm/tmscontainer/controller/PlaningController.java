package com.hust.baseweb.applications.sscm.tmscontainer.controller;

import com.google.ortools.Loader;
import com.hust.baseweb.applications.sscm.tmscontainer.model.PlanResponseItem;
import com.hust.baseweb.applications.sscm.tmscontainer.plan.PlanService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@AllArgsConstructor(onConstructor_ = @Autowired)

@RequestMapping("/admin/wms/controller/planing")
@CrossOrigin()
@RestController
public class PlaningController {

    @Autowired
    private PlanService planService;

    @PostMapping("/search")
    public List<PlanResponseItem> planing(@RequestBody String planRequest){
        return planService.searchPlan(planRequest);
    }
}
