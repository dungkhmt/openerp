package com.hust.baseweb.applications.sscm.wmsv2.management.service.impl;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.Bay;
import com.hust.baseweb.applications.sscm.wmsv2.management.entity.FacilityV2;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.request.NewFacilityRequest;
import com.hust.baseweb.applications.sscm.wmsv2.management.repository.BayRepository;
import com.hust.baseweb.applications.sscm.wmsv2.management.repository.FacilityV2Repository;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.FacilityService;
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
public class FacilityServiceImpl implements FacilityService {

    private BayRepository bayRepository;
    private FacilityV2Repository facilityRepository;

    @Transactional
    @Override
    public FacilityV2 createFacility(NewFacilityRequest request) {
        log.info(String.format("Start create facility with request %s", request));
        FacilityV2 facilityV2 = facilityRepository.save(FacilityV2.builder()
                                                                  .name(request.getName())
                                                                  .address(request.getAddress())
                                                                  .width(request.getFacilityWidth())
                                                                  .length(request.getFacilityLength())
                                                                  .code(request.getCode())
                                                                  .latitude(request.getLatitude())
                                                                  .longitude(request.getLongitude())
                                                                  .build());
        log.info("Start save list shelf");
        List<NewFacilityRequest.Shelf> listShelf = request.getListShelf();
        if (listShelf != null && !listShelf.isEmpty()) {
            UUID facilityId = facilityV2.getFacilityId();
            List<Bay> bays = listShelf.stream()
                .map(shelf -> Bay.builder()
                    .facilityId(facilityId)
                    .code(shelf.getCode())
                    .x(shelf.getX())
                    .y(shelf.getY())
                    .xLong(shelf.getWidth())
                    .yLong(shelf.getLength())
                    .build())
                .collect(Collectors.toList());
            bayRepository.saveAll(bays);
            log.info(String.format("Saved bay list for facility id %s", facilityId));
        }
        log.info(String.format("Saved facility entity with id %s", facilityV2.getFacilityId()));
        return facilityV2;
    }

    @Override
    public List<FacilityV2> getAll() {
        log.info("Start get all facilities in service");
        List<FacilityV2> response = facilityRepository.findAll();
        // TODO: Filter by company or something else... user can not view all facility in database
        log.info("Get %d facilities".format(String.valueOf(response.size())));
        return response;
    }

    @Override
    @Transactional
    public boolean delete(List<String> facilityIds) {
        if (facilityIds.isEmpty()) {
            log.info("Empty facility id list for delete");
            return true;
        }
        try {
            for (String facilityId : facilityIds) {
                log.info(String.format("Start delete data about facility id: %s", facilityId));
                UUID id = UUID.fromString(facilityId);
                bayRepository.deleteBaysByFacilityId(id);
                facilityRepository.deleteById(id);
            }
            log.info("Deleted facility ids: " + facilityIds);
            return true;
        } catch (Exception e) {
            log.info("Error when deleting facility ids: " + facilityIds);
            return false;
        }
    }
}
