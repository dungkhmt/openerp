package com.hust.baseweb.applications.education.repo;

import com.hust.baseweb.applications.education.entity.CommentsEduCourseMaterial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CommentsEduCourseMaterialRepo extends JpaRepository<CommentsEduCourseMaterial, UUID> {
    List<CommentsEduCourseMaterial> findAllByEduCourseMaterialId(UUID eduCourseMaterialId);
}
