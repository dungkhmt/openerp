package com.hust.baseweb.applications.bigdataanalysis.repo;
import com.hust.baseweb.applications.bigdataanalysis.entity.DataQualityCheckResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface DataQualityCheckResultRepo extends JpaRepository<DataQualityCheckResult, UUID>{

}
