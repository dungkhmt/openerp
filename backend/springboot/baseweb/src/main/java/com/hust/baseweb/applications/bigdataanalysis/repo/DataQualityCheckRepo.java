package com.hust.baseweb.applications.bigdataanalysis.repo;
import com.hust.baseweb.applications.bigdataanalysis.entity.DataQualityCheck;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface DataQualityCheckRepo extends JpaRepository<DataQualityCheck, UUID>{

}
