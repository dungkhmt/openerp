package com.hust.baseweb.applications.sscm.tmscontainer.service;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.LineItem;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.Shelf;
import com.hust.baseweb.applications.sscm.tmscontainer.model.FacilityResponse;
import com.hust.baseweb.applications.sscm.tmscontainer.model.ShelfRequest;
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

    public void updateListShelve(List<ShelfRequest> shelfRequests, List<Shelf> shelfModel){
        List<Integer>  shelfIds = shelfRequests.stream().map(ShelfRequest::getShelf_id).filter(li -> li > 0).collect(
            Collectors.toList());

        for (var shelfItem : shelfModel) {
            if (!shelfIds.contains(shelfItem.getShelfId())) {
                removeShlef(shelfModel, shelfItem);
            }
        }

        for(var shelfItem : shelfRequests){
            if(shelfItem.getShelf_id() == 0){
                var shelfItemAdded = new Shelf(shelfItem);
                addShelf(shelfModel, shelfItemAdded);
            }else{
                var shelfItemUpdate = shelfModel
                    .stream().filter(li -> li.getShelfId() == shelfItem.getShelf_id()).findFirst().orElse(null);
                assert shelfItemUpdate != null;
                shelfItemUpdate.update(shelfItem);
            }
        }
        shelfRepository.saveAll(shelfModel);
    }

    public void removeShlef(List<Shelf> shelves, Shelf shelfItem) {
        shelves.remove(shelfItem);
        shelfItem.setFacilityId(null);
        shelfItem.setStatus(Status.DELETED);
    }
    public void addShelf(List<Shelf> shelfModel, Shelf shelfAdd){
        shelfAdd.setStatus(Status.ACTIVE);
        shelfModel.add(shelfAdd);
    }

    public List<Integer> findShelfByFacilityId(Integer id){
        return shelfRepository.findAllByFacilityId(id);
    }


}
