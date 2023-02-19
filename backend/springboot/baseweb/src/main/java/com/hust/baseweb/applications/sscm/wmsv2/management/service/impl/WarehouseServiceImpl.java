package com.hust.baseweb.applications.sscm.wmsv2.management.service.impl;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.Bay;
import com.hust.baseweb.applications.sscm.wmsv2.management.entity.WMSV2Warehouse;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.request.NewWarehouseRequest;
import com.hust.baseweb.applications.sscm.wmsv2.management.repository.BayRepository;
import com.hust.baseweb.applications.sscm.wmsv2.management.repository.WarehouseRepository;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.WarehouseService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class WarehouseServiceImpl implements WarehouseService {

    private BayRepository bayRepository;
    private WarehouseRepository warehouseRepository;

    @Transactional
    @Override
    public WMSV2Warehouse createWarehouse(NewWarehouseRequest request) {
        log.info(String.format("Start create warehouse with request %s", request));
        WMSV2Warehouse warehouse = warehouseRepository.save(WMSV2Warehouse.builder()
                                                                           .name(request.getName())
                                                                           .address(request.getAddress())
                                                                           .width(request.getFacilityWidth())
                                                                           .length(request.getFacilityLength())
                                                                           .code(request.getCode())
                                                                           .latitude(request.getLatitude())
                                                                           .longitude(request.getLongitude())
                                                                           .build());
        log.info("Start save list shelf");
        List<NewWarehouseRequest.Shelf> listShelf = request.getListShelf();
        if (listShelf != null && !listShelf.isEmpty()) {
            UUID warehouseId = warehouse.getWarehouseId();
            List<Bay> bays = listShelf.stream()
                .map(shelf -> Bay.builder()
                    .warehouseId(warehouseId)
                    .code(shelf.getCode())
                    .x(shelf.getX())
                    .y(shelf.getY())
                    .xLong(shelf.getWidth())
                    .yLong(shelf.getLength())
                    .build())
                .collect(Collectors.toList());
            bayRepository.saveAll(bays);
            log.info(String.format("Saved bay list for warehouse id %s", warehouseId));
        }
        log.info(String.format("Saved warehouse entity with id %s", warehouse.getWarehouseId()));
        return warehouse;
    }

    @Override
    public List<WMSV2Warehouse> getAll() {
        log.info("Start get all warehouse in service");
        List<WMSV2Warehouse> response = warehouseRepository.findAll();
        // TODO: Filter by company or something else... user can not view all facility in database
        log.info("Get %d facilities".format(String.valueOf(response.size())));
        return response;
    }

    @Override
    @Transactional
    public boolean delete(List<String> warehouseIds) {
        if (warehouseIds.isEmpty()) {
            log.info("Empty warehouse id list for delete");
            return true;
        }
        try {
            for (String warehouseId : warehouseIds) {
                log.info(String.format("Start delete data about warehouse id: %s", warehouseId));
                UUID id = UUID.fromString(warehouseId);
                bayRepository.deleteBaysByWarehouseId(id);
                warehouseRepository.deleteById(id);
            }
            log.info("Deleted warehouse ids: " + warehouseIds);
            return true;
        } catch (Exception e) {
            log.info("Error when deleting warehouse ids: " + warehouseIds);
            return false;
        }
    }
}
