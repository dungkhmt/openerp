package com.hust.baseweb.applications.sscm.wms.orderpickupplanning;

import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.OrderPickupPlanningIM;
import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.solution.OrderPickupPlanningSolution;
import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.service.ExcelExtractor;
import com.hust.baseweb.applications.sscm.wms.orderpickupplanning.service.OptimizationSolver;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;

@Log4j2
@org.springframework.stereotype.Controller
@Validated
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class Controller {
    @PostMapping("/upload-excel-order-pickup-planning")
    public ResponseEntity<?> uploadExcelOrderPickupPlanning(
        Principal principale,
        @RequestParam("inputJson") String inputJson,
        @RequestParam("file") MultipartFile file){
        ExcelExtractor extractor = new ExcelExtractor();
        log.info("uploadExcelOrderPickupPlanning. inputJson = " + inputJson);

        OrderPickupPlanningIM I = extractor.extract(file);
        OptimizationSolver solver = new OptimizationSolver();
        OrderPickupPlanningSolution sol = solver.solve(I);
        return ResponseEntity.ok().body(sol);

        /*
        List<Order> order1 = new ArrayList();
        List<Order> order2 = new ArrayList();
        for(int i = 0; i < I.getOrders().size()/2; i++){
            order1.add(I.getOrders().get(i));
        }
        for(int i =  I.getOrders().size()/2; i < I.getOrders().size(); i++){
            order2.add(I.getOrders().get(i));
        }

        OrderPickupRoute route = solver.solve(I.getOrders(), I.getShelfs(), I.getDistances(), I.getDoorIn(), I.getDoorOut());
        OrderPickupRoute route1 = solver.solve(order1, I.getShelfs(), I.getDistances(), I.getDoorIn(), I.getDoorOut());
        OrderPickupRoute route2 = solver.solve(order2, I.getShelfs(), I.getDistances(), I.getDoorIn(), I.getDoorOut());

        OrderPickupPlanningSolution sol = new OrderPickupPlanningSolution();
        List<OrderPickupRoute> routes = new ArrayList();
        routes.add(route);  route.setIndex(1);
        routes.add(route1); route1.setIndex(2);
        routes.add(route2); route2.setIndex(3);

        sol.setRoutes(routes);

        return ResponseEntity.ok().body(sol);
        */
    }
}
