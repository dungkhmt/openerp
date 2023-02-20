package com.hust.baseweb.applications.sscm.wmsv2.management.service.impl;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.Bay;
import com.hust.baseweb.applications.sscm.wmsv2.management.entity.WMSV2Warehouse;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.WarehouseWithBays;
import com.hust.baseweb.applications.sscm.wmsv2.management.repository.BayRepository;
import com.hust.baseweb.applications.sscm.wmsv2.management.repository.WarehouseRepository;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.WarehouseService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
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
    public WMSV2Warehouse createWarehouse(WarehouseWithBays request) {
        log.info(String.format("Start create warehouse with request %s", request));
        WMSV2Warehouse newWarehouse = WMSV2Warehouse.builder()
                                                    .name(request.getName())
                                                    .address(request.getAddress())
                                                    .width(request.getWarehouseWidth())
                                                    .length(request.getWarehouseLength())
                                                    .code(request.getCode())
                                                    .latitude(request.getLatitude())
                                                    .longitude(request.getLongitude())
                                                    .build();

        List<Bay> prevBays;
        if (request.getId() != null) {
            UUID warehouseIdUUID = UUID.fromString(request.getId());
            newWarehouse.setWarehouseId(warehouseIdUUID);
            prevBays = bayRepository.findAllByWarehouseId(warehouseIdUUID);
        } else {
            prevBays = new ArrayList<>();
        }

        WMSV2Warehouse warehouse = warehouseRepository.save(newWarehouse);
        log.info("Start save list shelf");
        List<WarehouseWithBays.Shelf> listShelf = request.getListShelf();
        if (listShelf != null && !listShelf.isEmpty()) {
            UUID warehouseId = warehouse.getWarehouseId();
            List<Bay> bays = listShelf.stream()
                                      .map(shelf -> {
                                          Bay bay = Bay.builder()
                                                       .warehouseId(warehouseId)
                                                       .code(shelf.getCode())
                                                       .x(shelf.getX())
                                                       .y(shelf.getY())
                                                       .xLong(shelf.getWidth())
                                                       .yLong(shelf.getLength())
                                                       .build();
                                          if (shelf.getId() != null) {
                                              bay.setBayId(UUID.fromString(shelf.getId()));
                                          }
                                          return bay;
                                      })
                                      .collect(Collectors.toList());

            List<UUID> newBayIds = bays.stream().map(Bay::getBayId).collect(Collectors.toList());
            List<Bay> deletedBays = prevBays.stream().filter(bay -> !newBayIds.contains(bay.getBayId())).collect(
                Collectors.toList());

            bayRepository.deleteAll(deletedBays);
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
        log.info(String.format("Get %d facilities", response.size()));
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

    @Override
    public WarehouseWithBays getById(String id) {
        log.info(String.format("Start get warehouse information with id %s", id));
        UUID uuid = UUID.fromString(id);
        Optional<WMSV2Warehouse> warehouseOpt = warehouseRepository.findById(uuid);
        if (warehouseOpt.isPresent()) {
            WMSV2Warehouse warehouse = warehouseOpt.get();
            List<Bay> bays = bayRepository.findAllByWarehouseId(uuid);
            List<WarehouseWithBays.Shelf> shelves = bays.stream()
                                                        .map(bay -> WarehouseWithBays.Shelf.builder()
                                                                                           .code(bay.getCode())
                                                                                           .width(bay.getXLong())
                                                                                           .length(bay.getYLong())
                                                                                           .x(bay.getX())
                                                                                           .y(bay.getY())
                                                                                           .id(bay
                                                                                                   .getBayId()
                                                                                                   .toString())
                                                                                           .build())
                                                        .collect(Collectors.toList());
            return WarehouseWithBays.builder()
                                    .id(warehouse.getWarehouseId().toString())
                                    .warehouseLength(warehouse.getLength())
                                    .warehouseWidth(warehouse.getWidth())
                                    .name(warehouse.getName())
                                    .code(warehouse.getCode())
                                    .latitude(warehouse.getLatitude())
                                    .longitude(warehouse.getLongitude())
                                    .address(warehouse.getAddress())
                                    .listShelf(shelves)
                                    .build();
        } else {
            log.warn(String.format("Not found warehouse with id %s", id));
            return null;
        }
    }

}
