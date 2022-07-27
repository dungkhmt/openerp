package com.hust.baseweb.applications.sscm.tmscontainer.repository;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.LineItem;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.ShelfLineItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ShelfLineItemRepository extends JpaRepository<ShelfLineItem, Integer> {

    @Query(value = "SELECT * FROM shelf_line_item WHERE shelf_id = ?1", nativeQuery = true)
    List<ShelfLineItem> findAllByShelfId(Integer shelfId);

    @Query( "select o.lineItemId from ShelfLineItem o where o.shelfId in :ids" )
    List<Integer> findByShelfIds(@Param("ids") List<Integer> ids);
}
