package com.hust.baseweb.applications.sscm.tmscontainer.service;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.Facility;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.Shelf;
import com.hust.baseweb.applications.sscm.tmscontainer.model.ShelfRequest;
import com.hust.baseweb.applications.sscm.tmscontainer.repository.FacilityRepository;
import com.hust.baseweb.applications.sscm.tmscontainer.repository.ShelfRepository;
import com.hust.baseweb.applications.sscm.tmscontainer.utils.Status;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShelvesService {

    ModelMapper mapper = new ModelMapper();

    @Autowired
    private ShelfRepository shelfRepository;

    @Autowired
    private FacilityRepository facilityRepository;

    public List<Shelf> createShelf(Integer facilitiesID, List<ShelfRequest> shelfRequests){

        ArrayList<Shelf> shelves = new ArrayList<>();

        for (ShelfRequest shelf: shelfRequests
             ) {
            shelf.setFacilityId(facilitiesID);
            shelves.add(new Shelf(shelf));
        }
        return shelfRepository.saveAll(shelves);
    }

    public List<Shelf> getListShelves(Integer facilitiesID){

        return shelfRepository.findShelvesByFacilityID(facilitiesID);
    }

    public void updateListShelve(List<ShelfRequest> shelfRequests, List<Shelf> shelfModel, Integer facilityId){
        List<Integer>  shelfIds = shelfRequests.stream().map(shelfRequest -> shelfRequest.getShelfId()).filter(id -> id > 0).collect(
            Collectors.toList());

        for (Shelf shelfItem : shelfModel) {
            if (!shelfIds.contains(shelfItem.getShelfId())) {
//                removeShlef(shelfModel, shelfItem);
                shelfRepository.deleteById(shelfItem.getShelfId());
            }
        }
        List<Shelf> shelfModelNew = getListShelves(facilityId);

        if(shelfModel.size() > shelfModelNew.size()){
            shelfModel = shelfModelNew;
        }

        for(ShelfRequest shelfItem : shelfRequests){
            if(shelfItem.getShelfId() == 0){
                Shelf shelfItemAdded = new Shelf(shelfItem);
                shelfItemAdded.setFacilityId(facilityId);
                shelfModel.add(shelfItemAdded);
//                addShelf(shelfModel, shelfItemAdded);
            }else{
                Shelf shelfItemUpdate = shelfModel
                    .stream().filter(li -> li.getShelfId() == shelfItem.getShelfId()).findFirst().orElse(null);
                assert shelfItemUpdate != null;
                shelfItemUpdate.update(shelfItem);
            }
        }
        shelfRepository.saveAll(shelfModel);
    }

    public void removeShlef(List<Shelf> shelves, Shelf shelfItem) {
        shelves.remove(shelfItem);
//        shelfItem.setFacilityId(null);
//        shelfItem.setStatus(Status.DELETED);
    }

    public void addShelf(List<Shelf> shelfModel, Shelf shelfAdd){
//        shelfAdd.setStatus(Status.ACTIVE);
        shelfModel.add(shelfAdd);
    }

    public List<Integer> findShelfByFacilityId(Integer id){
        return shelfRepository.findAllByFacilityId(id);
    }


}
