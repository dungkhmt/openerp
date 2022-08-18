package com.hust.baseweb.applications.sscm.tmscontainer.repository;


import com.hust.baseweb.applications.sscm.tmscontainer.entity.ExportOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExportOrderRepository extends JpaRepository<ExportOrder, Integer> {

}
