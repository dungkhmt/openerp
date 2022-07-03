package com.hust.baseweb.applications.sscm.tmscontainer.service;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.Facilities;
import com.hust.baseweb.applications.sscm.tmscontainer.model.FacilityRequest;
import com.hust.baseweb.applications.sscm.tmscontainer.model.FacilityResponse;
import com.hust.baseweb.applications.sscm.tmscontainer.repository.FacilitiesRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FacilitiesService {

    ModelMapper mapper = new ModelMapper();

    @Autowired
    private FacilitiesRepository facilitiesRepository;

    @Autowired
    private ShelvesService shelvesService;

    public FacilityResponse createFacility(FacilityRequest facilityRequest){

        Facilities facilities = new Facilities(facilityRequest);

        Facilities res = facilitiesRepository.save(facilities);

        FacilityResponse facilityResponse = mapper.map(res, FacilityResponse.class);

        facilityResponse.setListShelf(shelvesService.createShelf(facilityResponse.getId(), facilityRequest.getListShelf()));

        return facilityResponse;
    }

    public  FacilityResponse getById(Integer id){
        Facilities facility = facilitiesRepository.getOne(id);
        FacilityResponse facilityResponse = mapper.map(facility, FacilityResponse.class);
        facilityResponse.setListShelf(shelvesService.getListShelves(id));
        return facilityResponse;
    }

    public List<Facilities> getAllFacilities(){
        return  facilitiesRepository.findAll();
    }

    public FacilityResponse updateById(Integer id, FacilityRequest facilityRequest){
        Optional<Facilities> facility = facilitiesRepository.findById(id);
        Facilities facilities = facility.get();
//        facilities.set
//        Facilities facility = facilitiesRepository.getOne(id);
        FacilityResponse facilityResponse = mapper.map(facility, FacilityResponse.class);
        facilityResponse.setListShelf(shelvesService.getListShelves(id));
        return facilityResponse;
    }
    public void deleteById(Integer id){
        facilitiesRepository.deleteById(id);
    }

}
