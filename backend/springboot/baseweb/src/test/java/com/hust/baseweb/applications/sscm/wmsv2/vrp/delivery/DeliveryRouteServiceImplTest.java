package com.hust.baseweb.applications.sscm.wmsv2.vrp.delivery;

import com.graphhopper.ResponsePath;
import com.graphhopper.util.PointList;
import com.hust.baseweb.BasewebApplication;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@RunWith(SpringRunner.class)
@SpringBootTest
@ContextConfiguration(classes = BasewebApplication.class)
public class DeliveryRouteServiceImplTest {

    @Autowired
    DeliveryRouteServiceImpl deliveryRouteService;

    @Test
    public void tspTest() {
        List<DeliveryAddressDTO> addressDTOs = new ArrayList<>();
        // Thuong Tin Train Station, Đường Trần Lư, Thường Tín District, Hanoi, Vietnam
        addressDTOs.add(DeliveryAddressDTO.builder().deliveryItemId("TRP_ITEM_00001")
                                          .longitude(BigDecimal.valueOf(105.86))
                                          .latitude(BigDecimal.valueOf(20.87)).build());
        // Son la, Đường tỉnh 112, Tà Xùa, Bắc Yên District, Son La province, Vietnam
        addressDTOs.add(DeliveryAddressDTO.builder().deliveryItemId("TRP_ITEM_00002")
                                          .longitude(BigDecimal.valueOf(104.43))
                                          .latitude(BigDecimal.valueOf(21.28)).build());
        // Nút giao Ô Chợ Dừa, Phố Xã Đàn, Phường Nam Đồng, Dong Da District, Hanoi, 10999, Vietnam
        addressDTOs.add(DeliveryAddressDTO.builder().deliveryItemId("TRP_ITEM_00003")
                                          .longitude(BigDecimal.valueOf(105.83))
                                          .latitude(BigDecimal.valueOf(21.02)).build());
        // Ô mai Hồng Lam Trương Định, 540, Truong Dinh Road, Hanoi, 11617, Vietnam
        RouteRequest request = RouteRequest.builder().warehouseLon(BigDecimal.valueOf(105.84606580000000))
            .warehouseLat(BigDecimal.valueOf(20.98420000000000)).addressDTOs(addressDTOs).build();
        RouteResponse response = deliveryRouteService.getRoute(request);
        System.out.println(String.format("Response => %s", response));
        System.out.println("Response order => ");
        for (DeliveryAddressDTO dto : response.getOrder()) {
            System.out.println(dto);
        }
        System.out.println("Response path => ");
        for (ResponsePath path : response.getPaths()) {
            PointList pointList = path.getPoints();
            System.out.println(pointList);
        }
    }

    @Test
    public void getReducedMatrix() {
        ReducedMatrix matrix = ReducedMatrix.builder().reducedCost(0.0).build();
        List<Double[]> rows = new ArrayList<>();
        rows.add(new Double[]{Double.MAX_VALUE, 20.0, 30.0, 10.0, 11.0});
        rows.add(new Double[]{15.0, Double.MAX_VALUE, 16.0, 4.0, 2.0});
        rows.add(new Double[]{3.0, 5.0, Double.MAX_VALUE, 2.0, 4.0});
        rows.add(new Double[]{19.0, 6.0, 18.0, Double.MAX_VALUE, 3.0});
        rows.add(new Double[]{16.0, 4.0, 7.0, 16.0, Double.MAX_VALUE});
        matrix.setMatrix(rows);

        ReducedMatrix reducedMatrix = deliveryRouteService.getReducedMatrix(matrix);
        System.out.printf("ReducedMatrix => Cost: %f%n", reducedMatrix.getReducedCost());
        List<Double[]> reducedRows = reducedMatrix.getMatrix();
        for (Double[] row : reducedRows) {
            System.out.println(Arrays.toString(row));
        }
    }

    @Test
    public void getSimpleRouteTest1() {
        ReducedMatrix matrix = ReducedMatrix.builder().reducedCost(0.0).build();
        List<Double[]> rows = new ArrayList<>();
        rows.add(new Double[]{Double.MAX_VALUE, 20.0, 30.0, 10.0, 11.0});
        rows.add(new Double[]{15.0, Double.MAX_VALUE, 16.0, 4.0, 2.0});
        rows.add(new Double[]{3.0, 5.0, Double.MAX_VALUE, 2.0, 4.0});
        rows.add(new Double[]{19.0, 6.0, 18.0, Double.MAX_VALUE, 3.0});
        rows.add(new Double[]{16.0, 4.0, 7.0, 16.0, Double.MAX_VALUE});
        matrix.setMatrix(rows);
        deliveryRouteService.getSimpleRoute(rows);
    }

    @Test
    public void getSimpleRouteTest2() {
        ReducedMatrix matrix = ReducedMatrix.builder().reducedCost(0.0).build();
        List<Double[]> rows = new ArrayList<>();
        rows.add(new Double[]{Double.MAX_VALUE, 16558.45710991086, 206162.0077087628, 5203.754655415322});
        rows.add(new Double[]{16558.45710991086, Double.MAX_VALUE, 216917.95332298166, 18529.64826963401});
        rows.add(new Double[]{206162.0077087628, 219001.91232298155, Double.MAX_VALUE, 197020.3048684862});
        rows.add(new Double[]{5203.754655415322, 20830.318236661213, 196728.69283551347, Double.MAX_VALUE});
        matrix.setMatrix(rows);
        deliveryRouteService.getSimpleRoute(rows);
    }

}
