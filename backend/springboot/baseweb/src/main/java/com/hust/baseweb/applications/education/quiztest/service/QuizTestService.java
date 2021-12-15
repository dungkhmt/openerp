package com.hust.baseweb.applications.education.quiztest.service;

import com.hust.baseweb.applications.education.quiztest.entity.EduQuizTest;
import com.hust.baseweb.applications.education.quiztest.model.EditQuizTestInputModel;
import com.hust.baseweb.applications.education.quiztest.model.EduQuizTestModel;
import com.hust.baseweb.applications.education.quiztest.model.QuizTestCreateInputModel;
import com.hust.baseweb.applications.education.quiztest.model.StudentInTestQueryReturnModel;
import com.hust.baseweb.applications.education.quiztest.model.edutestquizparticipation.QuizTestParticipationExecutionResultOutputModel;
import com.hust.baseweb.applications.education.quiztest.model.quitestgroupquestion.AutoAssignQuestion2QuizTestGroupInputModel;
import com.hust.baseweb.applications.education.quiztest.model.quiztestgroup.AutoAssignParticipants2QuizTestGroupInputModel;
import com.hust.baseweb.applications.education.quiztest.model.quiztestgroup.QuizTestGroupInfoModel;
import com.hust.baseweb.entity.UserLogin;

import java.util.List;
import java.util.UUID;

public interface QuizTestService {

    public EduQuizTest save(QuizTestCreateInputModel input, UserLogin user);

    public EduQuizTest update(EditQuizTestInputModel input);
    public EduQuizTest openQuizTest(String testId);
    public EduQuizTest hideQuizTest(String testId);

    public List<EduQuizTest> getAllTestByCreateUser(String userLoginId);

    public List<StudentInTestQueryReturnModel> getAllStudentInTest(String testId);

    public List<EduQuizTestModel> getListQuizByUserId(String userLoginId);

    public List<EduQuizTestModel> getListOpenQuizTestOfSession(UUID sessionId, String userLoginId);

    public boolean autoAssignParticipants2QuizTestGroup(AutoAssignParticipants2QuizTestGroupInputModel input);

    public boolean autoAssignQuestion2QuizTestGroup(AutoAssignQuestion2QuizTestGroupInputModel input);

    public Integer rejectStudentsInTest(String testId, String[] userLoginId);

    public EduQuizTest getQuizTestById(String testId);

    public Integer acceptStudentsInTest(String testId, String[] userLoginId);

    public List<QuizTestGroupInfoModel> getQuizTestGroupsInfoByTestId(String testId);

    public Integer deleteQuizTestGroups(String testId, String[] listQuizTestGroupId);

    public List<QuizTestParticipationExecutionResultOutputModel> getQuizTestParticipationExecutionResult(String testId);

    public int copyQuestionsFromQuizTest2QuizTest(UserLogin u, String fromQuizTestId, String toQuizTestId);
}
