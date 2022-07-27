package com.hust.baseweb.applications.sscm.tmscontainer.repository;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.LineItem;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

//    @Query(value = "SELECT Top 1 * FROM products WHERE code = :code ORDER BY id" ,nativeQuery = true)

    @Query(value="SELECT * FROM products WHERE code = :code ORDER BY id DESC LIMIT 1", nativeQuery = true)
    Product findProductByCode(@Param("code") String code);
}
