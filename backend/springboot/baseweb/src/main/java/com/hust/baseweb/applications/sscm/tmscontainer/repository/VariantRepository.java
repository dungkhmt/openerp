package com.hust.baseweb.applications.sscm.tmscontainer.repository;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.LotsDate;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.Product;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.Variant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VariantRepository  extends JpaRepository<Variant, Integer> {

    @Query( "select distinct o.product from Variant o where o.id in :ids" )
    List<Product> findAllProductByVariantIds(@Param("ids") List<Integer> ids);

    @Query( "select o from Variant o where o.id in :ids" )
    List<Variant> findAllByIds(@Param("ids") List<Integer> ids);

}
