package com.hust.baseweb.applications.education.service;

import com.hust.baseweb.applications.education.entity.CommentsEduCourseMaterial;
import com.hust.baseweb.applications.education.model.CommentEduCourseDetailOM;
import com.hust.baseweb.entity.UserLogin;

import java.util.List;
import java.util.UUID;

public interface CommentsEduCourseMaterialService {
    CommentsEduCourseMaterial createComment(UUID commentId, UUID replyToCommentId, String comment, UserLogin u);
    List<CommentEduCourseDetailOM> findByEduCourseMaterialId(UUID eduCourseMaterialId);
}
