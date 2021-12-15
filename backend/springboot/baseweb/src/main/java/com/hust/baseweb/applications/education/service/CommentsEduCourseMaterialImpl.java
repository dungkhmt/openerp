package com.hust.baseweb.applications.education.service;

import com.hust.baseweb.applications.education.model.CommentEduCourseDetailOM;
import com.hust.baseweb.applications.education.repo.CommentsEduCourseMaterialRepo;
import com.hust.baseweb.applications.education.entity.CommentsEduCourseMaterial;
import com.hust.baseweb.service.UserService;
import com.hust.baseweb.model.PersonModel;
import lombok.AllArgsConstructor;
import com.hust.baseweb.entity.UserLogin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import static org.bouncycastle.asn1.x500.style.RFC4519Style.c;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class CommentsEduCourseMaterialImpl implements CommentsEduCourseMaterialService{
    @Autowired
    private CommentsEduCourseMaterialRepo commentsEduCourseMaterialRepo;
    public UserService userService;
    @Override
    public  CommentsEduCourseMaterial createComment(
        UUID eduCourseMaterialId,
        UUID replyToCommentId,
        String comment,
        UserLogin u
        ) {
        CommentsEduCourseMaterial commentsEduCourseMaterial = new CommentsEduCourseMaterial();
        commentsEduCourseMaterial.setCommentMessage(comment);
        commentsEduCourseMaterial.setEduCourseMaterialId(eduCourseMaterialId);
        commentsEduCourseMaterial.setReplyToCommentId(replyToCommentId);
        commentsEduCourseMaterial.setPostedByUserLoginId(u.getUserLoginId());
        commentsEduCourseMaterial.setCreatedStamp(new Date());
        commentsEduCourseMaterial.setStatusId(CommentsEduCourseMaterial.STATUS_CREATED);
        commentsEduCourseMaterial = commentsEduCourseMaterialRepo.save(commentsEduCourseMaterial);

        return commentsEduCourseMaterial;

    }

    @Override
    public List<CommentEduCourseDetailOM> findByEduCourseMaterialId(UUID eduCourseMaterialId){
        List<CommentsEduCourseMaterial> lst = commentsEduCourseMaterialRepo.findAllByEduCourseMaterialId(eduCourseMaterialId);
        List<CommentEduCourseDetailOM> list = new ArrayList();
        for(CommentsEduCourseMaterial cmt: lst){
            // get info of comment detail
            CommentEduCourseDetailOM cmtDetail = new CommentEduCourseDetailOM();
            cmtDetail.setCommentId(cmt.getCommentId());
            cmtDetail.setReplyToCommentId(cmt.getReplyToCommentId());
            cmtDetail.setCommentMessage(cmt.getCommentMessage());
            cmtDetail.setPostedByUserLoginId(cmt.getPostedByUserLoginId());
            cmtDetail.setCreatedStamp(cmt.getCreatedStamp());

            //get name of comment' person
            PersonModel person = userService.findPersonByUserLoginId(cmtDetail.getPostedByUserLoginId());
            if(person != null){
                cmtDetail.setFullNameOfCreator(person.getLastName() + " " + person.getMiddleName()
                                        + " " + person.getFirstName());
            }
            list.add(cmtDetail);
        }
        return list;
    }
}
