package com.hust.baseweb.applications.admin.dataadmin.repo;

import com.hust.baseweb.applications.education.entity.LogUserLoginCourseChapterMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface DataAdminLogUserLoginCourseChapterMaterialRepo extends JpaRepository<LogUserLoginCourseChapterMaterial, UUID> {
    @Query(value="select * from log_user_login_course_chapter_material offset ?1 limit ?2",nativeQuery=true)
    List<LogUserLoginCourseChapterMaterial> getPage(int offset, int limit);

    @Query(value="select * from log_user_login_course_chapter_material where user_login_id = ?3 offset ?1 limit ?2",nativeQuery=true)
    List<LogUserLoginCourseChapterMaterial> getPageOfUserLogin(int offset, int limit, String userLoginId);

    @Query(value="select count(*) from log_user_login_course_chapter_material",nativeQuery=true)
    int countTotal();

}
