package com.hust.baseweb.applications.sscm.tmscontainer.repository;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.ImportLineItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImportLineItemRepository extends JpaRepository<ImportLineItem, Integer> {

    @Query( "select o from ImportLineItem o where o.id in :ids" )
    List<ImportLineItem> findAllByIds(@Param("ids") List<Integer> ids);


    @Query( "select o from ImportLineItem o where o.variantId = :id" )
//    @Query(value = "SELECT * FROM shelves WHERE variant_id = ?1",nativeQuery = true)
    List<ImportLineItem> findAllByVariantId(Integer id);
}
