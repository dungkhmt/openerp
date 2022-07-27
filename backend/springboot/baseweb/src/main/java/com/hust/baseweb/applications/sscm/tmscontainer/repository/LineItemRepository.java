package com.hust.baseweb.applications.sscm.tmscontainer.repository;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.LineItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LineItemRepository extends JpaRepository<LineItem, Integer> {

    @Query( "select o from LineItem o where o.id in :ids" )
    List<LineItem> findAllByIds(@Param("ids") List<Integer> ids);


    @Query( "select o from LineItem o where o.variantId = :id" )
//    @Query(value = "SELECT * FROM shelves WHERE variant_id = ?1",nativeQuery = true)
    List<LineItem> findAllByVariantId(Integer id);
}
