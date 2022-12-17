package com.hust.baseweb.applications.education.quiztest.service;

import com.hust.baseweb.applications.education.quiztest.entity.EduTestQuizGroup;
import com.hust.baseweb.applications.education.quiztest.model.QuizGroupTestDetailModel;
import com.hust.baseweb.applications.education.quiztest.model.quiztestgroup.GenerateQuizTestGroupInputModel;

import java.security.Principal;
import java.util.List;

public interface EduQuizTestGroupService {

    List<EduTestQuizGroup> generateQuizTestGroups(GenerateQuizTestGroupInputModel input);

    QuizGroupTestDetailModel getTestGroupQuestionDetail(Principal principal, String testID);
    QuizGroupTestDetailModel getTestGroupQuestionDetail(String userLoginId, String testID);
    QuizGroupTestDetailModel getTestGroupQuestionDetailOfGroupCode(String userLoginId, String groupCode, String testId);
}
