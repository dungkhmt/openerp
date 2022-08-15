package com.hust.baseweb.applications.sscm.tmscontainer.repository;

import com.hust.baseweb.applications.education.entity.LogUserLoginCourseChapterMaterial;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.LotsDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface LotsDateRepository  extends JpaRepository<LotsDate, Integer> {

    @Query(value="select * from lots_date where variant_id = ?", nativeQuery=true)
    List<LotsDate> findAllByVariantId(Integer id);

}
