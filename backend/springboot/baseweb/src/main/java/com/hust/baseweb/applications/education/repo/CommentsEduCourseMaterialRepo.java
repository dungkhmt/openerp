package com.hust.baseweb.applications.education.repo;

import com.hust.baseweb.applications.education.entity.CommentsEduCourseMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

public interface CommentsEduCourseMaterialRepo extends JpaRepository<CommentsEduCourseMaterial, UUID> {
    List<CommentsEduCourseMaterial> findAllByEduCourseMaterialId(UUID eduCourseMaterialId);

    CommentsEduCourseMaterial findByCommentId(UUID commentId);

    CommentsEduCourseMaterial deleteByCommentId(UUID commentId);

    @Transactional
    @Modifying
    @Query(value="delete from comments_edu_course_material where reply_to_comment_id = :commentId", nativeQuery = true)
    void deleteAllByReplyToCommentId(UUID commentId);

    @Transactional
    @Modifying
    @Query(value="select * from comments_edu_course_material where edu_course_material_id = :eduCourseMaterialId and reply_to_comment_id is null", nativeQuery = true)
    List<CommentsEduCourseMaterial> findByEduCourseMaterialIdWithoutReplyComment(UUID eduCourseMaterialId);

    List<CommentsEduCourseMaterial> findByReplyToCommentId(UUID replyToCommentId);
}
