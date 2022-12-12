package com.hust.baseweb.applications.bigdataanalysis.repo;

import com.hust.baseweb.applications.bigdataanalysis.entity.DataQualityCheckMaster;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DataQualityCheckMasterRepo extends JpaRepository<DataQualityCheckMaster, UUID>{
    List<DataQualityCheckMaster> findAllByCreatedByUserLoginId(String createdByUserLoginId);
}
