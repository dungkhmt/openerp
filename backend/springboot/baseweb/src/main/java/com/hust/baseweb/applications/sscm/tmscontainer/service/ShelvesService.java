package com.hust.baseweb.applications.sscm.tmscontainer.service;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.Facilities;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.Shelves;
import com.hust.baseweb.applications.sscm.tmscontainer.model.FacilityRequest;
import com.hust.baseweb.applications.sscm.tmscontainer.model.FacilityResponse;
import com.hust.baseweb.applications.sscm.tmscontainer.model.ShelfRequest;
import com.hust.baseweb.applications.sscm.tmscontainer.repository.FacilitiesRepository;
import com.hust.baseweb.applications.sscm.tmscontainer.repository.ShelvesRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ShelvesService {

    ModelMapper mapper = new ModelMapper();

    @Autowired
    private ShelvesRepository shelvesRepository;

    public List<Shelves> createShelf( Integer facilitiesID, List<ShelfRequest> shelfRequests){

        ArrayList<Shelves> shelves = new ArrayList<>();

        for (ShelfRequest shelf: shelfRequests
             ) {
            shelf.setFacilityId(facilitiesID);
            shelves.add(new Shelves(shelf));
        }
        return shelvesRepository.saveAll(shelves);
    }

    public List<Shelves> getListShelves( Integer facilitiesID){

        return shelvesRepository.findUserByFacilityID(facilitiesID);
    }



}
