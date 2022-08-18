package com.hust.baseweb.applications.sscm.tmscontainer.repository;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.ExportLineItem;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.ExportShelfVariant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExportLineItemRepository extends JpaRepository<ExportLineItem, Integer> {

}
