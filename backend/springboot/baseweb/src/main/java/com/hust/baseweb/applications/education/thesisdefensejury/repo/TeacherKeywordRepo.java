package com.hust.baseweb.applications.education.thesisdefensejury.repo;

import com.hust.baseweb.applications.education.thesisdefensejury.entity.AcademicKeyword;
import com.hust.baseweb.applications.education.thesisdefensejury.entity.DefenseJury;
import com.hust.baseweb.applications.education.thesisdefensejury.entity.TeacherKeyword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TeacherKeywordRepo extends JpaRepository<TeacherKeyword, String> {
    @Query(value = "select * from teacher_keyword tk where tk.teacher_id = :teacherId", nativeQuery = true)
    List<TeacherKeyword> findAllByTeacherId(String teacherId);
}
