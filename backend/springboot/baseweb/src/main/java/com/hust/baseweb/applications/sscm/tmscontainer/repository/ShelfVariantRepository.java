package com.hust.baseweb.applications.sscm.tmscontainer.repository;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.ExportShelfVariant;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.Product;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.ShelfVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ShelfVariantRepository extends JpaRepository<ShelfVariant, Integer> {

    @Query(value = "SELECT * FROM shelf_variants WHERE shelf_id = ?1", nativeQuery = true)
    List<ShelfVariant> findAllByShelfId(Integer shelfId);

    @Query( "select o.lineItemId from ShelfVariant o where o.shelfId in :ids" )
    List<Integer> findByShelfIds(@Param("ids") List<Integer> ids);


    @Query( "select o.variantId from ShelfVariant o where o.shelfId in :ids" )
    List<Integer> findAllVariantIdByShelfId(@Param("ids") List<Integer> ids);


    @Query( "select o from ShelfVariant o where o.shelfId in :ids" )
    List<ShelfVariant> findAllByShelfIds(@Param("ids") List<Integer> ids);

    @Query(value = "SELECT * FROM shelf_variants WHERE variant_id = ?1", nativeQuery = true)
    List<ShelfVariant> findAllByVariantId(Integer id);

    @Query(value="SELECT * FROM shelf_variants WHERE shelf_id = :shelfId ORDER BY id DESC LIMIT 1", nativeQuery = true)
    ShelfVariant findFirstShelfVariant(@Param("shelfId") Integer shelfId);



}
