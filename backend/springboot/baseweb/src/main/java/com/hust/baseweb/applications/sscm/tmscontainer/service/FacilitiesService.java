package com.hust.baseweb.applications.sscm.tmscontainer.service;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.Facility;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.Shelf;
import com.hust.baseweb.applications.sscm.tmscontainer.model.FacilityRequest;
import com.hust.baseweb.applications.sscm.tmscontainer.model.FacilityResponse;
import com.hust.baseweb.applications.sscm.tmscontainer.repository.FacilityRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FacilitiesService {

    ModelMapper mapper = new ModelMapper();

    @Autowired
    private FacilityRepository facilityRepository;

    @Autowired
    private ShelvesService shelvesService;


    public FacilityResponse createFacility(FacilityRequest facilityRequest) {

        Facility facility = new Facility(facilityRequest);

        Facility res = facilityRepository.save(facility);

        FacilityResponse facilityResponse = mapper.map(res, FacilityResponse.class);

        facilityResponse.setListShelf(shelvesService.createShelf(
            facilityResponse.getId(),
            facilityRequest.getListShelf()));

        return facilityResponse;
    }

    public FacilityResponse getById(Integer id) {
        Facility facility = facilityRepository.getOne(id);
        FacilityResponse facilityResponse = mapper.map(facility, FacilityResponse.class);
        List<Shelf> shelves =  shelvesService.getListShelves(id).stream().sorted(Comparator.comparingInt(Shelf::getShelfId)).collect(
            Collectors.toList());
        facilityResponse.setListShelf(shelves);
        return facilityResponse;
    }

    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }


    public FacilityResponse updateById(Integer id, FacilityRequest facilityRequest) throws Exception {

        Facility facility = facilityRepository.findById(id).orElse(null);
        if (facility == null) {
            throw new Exception("không tìm thấy kho");
        }

        facility.setCode(facilityRequest.getCode());
        facility.setName(facilityRequest.getName());
        facility.setFacilityLenght(facilityRequest.getFacilityLenght());
        facility.setFacilityWidth(facilityRequest.getFacilityWidth());
        facility.setAddress(facilityRequest.getAddress());
        facility.setUpdateAt(new Date());

        List<Shelf> shelves = shelvesService.getListShelves(facility.getFacilityId());
        shelvesService.updateListShelve(facilityRequest.getListShelf(), shelves, id);
        facilityRepository.save(facility);

        FacilityResponse facilityResponse = mapper.map(facility, FacilityResponse.class);
        facilityResponse.setListShelf(shelvesService.getListShelves(id));

        return facilityResponse;
    }

    public void deleteById(Integer id) {
        facilityRepository.deleteById(id);
    }

}
