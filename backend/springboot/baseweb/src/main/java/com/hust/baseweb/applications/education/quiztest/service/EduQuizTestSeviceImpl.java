package com.hust.baseweb.applications.education.quiztest.service;

import com.hust.baseweb.applications.education.classmanagement.service.ClassService;
import com.hust.baseweb.applications.education.entity.EduClass;
import com.hust.baseweb.applications.education.entity.QuizChoiceAnswer;
import com.hust.baseweb.applications.education.entity.QuizQuestion;
import com.hust.baseweb.applications.education.model.quiz.QuizQuestionDetailModel;
import com.hust.baseweb.applications.education.quiztest.entity.*;
import com.hust.baseweb.applications.education.quiztest.entity.compositeid.CompositeEduTestQuizGroupParticipationAssignmentId;
import com.hust.baseweb.applications.education.quiztest.model.EditQuizTestInputModel;
import com.hust.baseweb.applications.education.quiztest.model.EduQuizTestModel;
import com.hust.baseweb.applications.education.quiztest.model.QuizTestCreateInputModel;
import com.hust.baseweb.applications.education.quiztest.model.StudentInTestQueryReturnModel;
import com.hust.baseweb.applications.education.quiztest.model.edutestquizparticipation.QuizTestParticipationExecutionResultOutputModel;
import com.hust.baseweb.applications.education.quiztest.model.quitestgroupquestion.AutoAssignQuestion2QuizTestGroupInputModel;
import com.hust.baseweb.applications.education.quiztest.model.quiztestgroup.AutoAssignParticipants2QuizTestGroupInputModel;
import com.hust.baseweb.applications.education.quiztest.model.quiztestgroup.QuizTestGroupInfoModel;
import com.hust.baseweb.applications.education.quiztest.model.quiztestquestion.CreateQuizTestQuestionInputModel;
import com.hust.baseweb.applications.education.quiztest.repo.*;
import com.hust.baseweb.applications.education.quiztest.repo.EduQuizTestGroupRepo.QuizTestGroupInfo;
import com.hust.baseweb.applications.education.quiztest.repo.EduQuizTestRepo.StudentInfo;
import com.hust.baseweb.applications.education.repo.QuizChoiceAnswerRepo;
import com.hust.baseweb.applications.education.repo.QuizQuestionRepo;
import com.hust.baseweb.applications.education.service.QuizQuestionService;
import com.hust.baseweb.entity.UserLogin;
import com.hust.baseweb.repo.UserLoginRepo;
import com.hust.baseweb.repo.UserRegisterRepo;
import com.hust.baseweb.utils.CommonUtils;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Log4j2
@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class EduQuizTestSeviceImpl implements QuizTestService {

    UserLoginRepo userLoginRepo;
    UserRegisterRepo userRegisterRepo;
    EduQuizTestRepo repo;
    EduTestQuizParticipantRepo eduTestQuizParticipantRepo;
    EduQuizTestGroupRepo eduQuizTestGroupRepo;
    EduTestQuizGroupParticipationAssignmentRepo eduTestQuizGroupParticipationAssignmentRepo;
    QuizQuestionService quizQuestionService;
    ClassService classService;
    QuizGroupQuestionAssignmentRepo quizGroupQuestionAssignmentRepo;
    QuizGroupQuestionParticipationExecutionChoiceRepo quizGroupQuestionParticipationExecutionChoiceRepo;
    EduQuizTestQuizQuestionService eduQuizTestQuizQuestionService;
    QuizQuestionRepo quizQuestionRepo;
    QuizChoiceAnswerRepo quizChoiceAnswerRepo;
    @Override
    public EduQuizTest save(QuizTestCreateInputModel input, UserLogin user) {
        EduQuizTest newRecord = new EduQuizTest();

        newRecord.setTestName(input.getTestName());
        newRecord.setCourseId(input.getCourseId());
        newRecord.setCreatedByUserLoginId(user.getUserLoginId());
        newRecord.setDuration(input.getDuration());
        newRecord.setScheduleDatetime(input.getScheduleDatetime());
        newRecord.setStatusId(EduQuizTest.QUIZ_TEST_STATUS_CREATED);
        newRecord.setTestId(input.getTestId());
        newRecord.setClassId(input.getClassId());
        newRecord.setCreatedStamp(new Date());
        newRecord.setLastUpdatedStamp(new Date());

        return repo.save(newRecord);
    }

    @Override
    public EduQuizTest update(EditQuizTestInputModel input) {
        log.info("update, testId = " +
                 input.getTestId() +
                 ", duration = " +
                 input.getDuration() +
                 " date = " +
                 input.getScheduleDate());

        EduQuizTest eduQuizTest = repo.findById(input.getTestId()).orElse(null);

        if (eduQuizTest != null) {
            eduQuizTest.setDuration(input.getDuration());
            eduQuizTest.setScheduleDatetime(input.getScheduleDate());
            eduQuizTest = repo.save(eduQuizTest);
            log.info("update, testId = " +
                     input.getTestId() +
                     ", duration = " +
                     input.getDuration() +
                     " date = " +
                     input.getScheduleDate() +
                     " OK updated");
        }
        return null;
    }

    @Override
    public EduQuizTest openQuizTest(String testId) {
        EduQuizTest qt = repo.findById(testId).orElse(null);
        if(qt != null){
            qt.setStatusId(EduQuizTest.QUIZ_TEST_STATUS_OPEN);
            qt = repo.save(qt);
        }
        return qt;
    }

    @Override
    public EduQuizTest hideQuizTest(String testId) {
        EduQuizTest qt = repo.findById(testId).orElse(null);
        if(qt != null){
            qt.setStatusId(EduQuizTest.QUIZ_TEST_STATUS_HIDDEN);
            qt = repo.save(qt);
        }
        return qt;
    }

    @Override
    public List<EduQuizTest> getAllTestByCreateUser(String userLoginId) {
        if(userLoginId.equals("admin")){
            log.info("getAllTestByCreateUser, user_login_id = admin -> findAll");
            return repo.findAll();
        }
        return repo.findByCreateUser(userLoginId);
    }

    @Override
    public List<StudentInTestQueryReturnModel> getAllStudentInTest(String testId) {
        List<StudentInfo> list = repo.findAllStudentInTest(testId);
        List<EduTestQuizGroup> eduTestQuizGroups = eduQuizTestGroupRepo.findByTestId(testId);
        List<UUID> groupIds = new ArrayList<UUID>();
        HashMap<UUID, EduTestQuizGroup> mId2Group = new HashMap();
        for (EduTestQuizGroup g : eduTestQuizGroups) {
            groupIds.add(g.getQuizGroupId());
            mId2Group.put(g.getQuizGroupId(), g);
        }
        List<EduTestQuizGroupParticipationAssignment> eduTestQuizGroupParticipationAssignments =
            eduTestQuizGroupParticipationAssignmentRepo.findAllByQuizGroupIdIn(groupIds);

        HashMap<String, EduTestQuizGroupParticipationAssignment> mUserLoginId2Assignment = new HashMap();
        for (EduTestQuizGroupParticipationAssignment a : eduTestQuizGroupParticipationAssignments) {
            mUserLoginId2Assignment.put(a.getParticipationUserLoginId(), a);
        }

        List<StudentInTestQueryReturnModel> re = new ArrayList<>();

        for (StudentInfo studentInfo : list) {
            StudentInTestQueryReturnModel temp = new StudentInTestQueryReturnModel();
            temp.setFullName(studentInfo.getFull_name());
            temp.setTestId(studentInfo.getTest_id());
            temp.setEmail(studentInfo.getEmail());
            temp.setUserLoginId(studentInfo.getUser_login_id());
            temp.setStatusId(studentInfo.getStatus_id());

            EduTestQuizGroupParticipationAssignment a = mUserLoginId2Assignment.get(studentInfo.getUser_login_id());
            temp.setTestGroupCode("-");
            if (a != null) {
                EduTestQuizGroup g = mId2Group.get(a.getQuizGroupId());
                if (g != null) {
                    temp.setTestGroupCode(g.getGroupCode());
                }
            }
            re.add(temp);
        }

        return re;
    }

    @Override
    public List<EduQuizTestModel> getListQuizByUserId(String userLoginId) {

        SimpleDateFormat formatter = new SimpleDateFormat("dd/M/yyyy hh:mm:ss");
        List<EduQuizTestModel> listModel = new ArrayList<>();
        // or find by user id??
        List<EduQuizTest> listEdu = repo.findAll();
        for (EduQuizTest eduEntity :
            listEdu) {
            if(eduEntity.getStatusId() == null ||
               !eduEntity.getStatusId().equals(EduQuizTest.QUIZ_TEST_STATUS_OPEN))
                continue;
            if(eduEntity.getSessionId() != null) continue;// do not list quiz test belonging to particilar session

            EduQuizTestModel eduModel = new EduQuizTestModel();
            eduModel.setTestId(eduEntity.getTestId());
            eduModel.setTestName(eduEntity.getTestName());
            eduModel.setCourseId(eduEntity.getCourseId());

            String strDate = null;
            if (eduEntity.getScheduleDatetime() != null) {
                strDate = formatter.format(eduEntity.getScheduleDatetime());
            }

            eduModel.setScheduleDatetime(strDate);
            //eduModel.setStatusId(eduEntity.getStatusId());
            List<EduTestQuizParticipant> eduTestQuizParticipants = eduTestQuizParticipantRepo
                .findByTestIdAndParticipantUserLoginId(eduEntity.getTestId(), userLoginId);
            if (eduTestQuizParticipants != null && eduTestQuizParticipants.size() > 0) {
                eduModel.setStatusId(eduTestQuizParticipants.get(0).getStatusId());
            } else {
                eduModel.setStatusId(null);
            }

            listModel.add(eduModel);
        }
        return listModel;
    }

    @Override
    public List<EduQuizTestModel> getListOpenQuizTestOfSession(UUID sessionId, String userLoginId) {
        SimpleDateFormat formatter = new SimpleDateFormat("dd/M/yyyy hh:mm:ss");
        List<EduQuizTestModel> listModel = new ArrayList<>();
        // or find by user id??
        List<EduQuizTest> listEdu = repo.findAllBySessionId(sessionId);
        for (EduQuizTest eduEntity :
            listEdu) {
            if(eduEntity.getStatusId() == null ||
               !eduEntity.getStatusId().equals(EduQuizTest.QUIZ_TEST_STATUS_OPEN))
                continue;

            EduQuizTestModel eduModel = new EduQuizTestModel();
            eduModel.setTestId(eduEntity.getTestId());
            eduModel.setTestName(eduEntity.getTestName());
            eduModel.setCourseId(eduEntity.getCourseId());

            String strDate = null;
            if (eduEntity.getScheduleDatetime() != null) {
                strDate = formatter.format(eduEntity.getScheduleDatetime());
            }

            eduModel.setScheduleDatetime(strDate);
            //eduModel.setStatusId(eduEntity.getStatusId());
            List<EduTestQuizParticipant> eduTestQuizParticipants = eduTestQuizParticipantRepo
                .findByTestIdAndParticipantUserLoginId(eduEntity.getTestId(), userLoginId);
            if (eduTestQuizParticipants != null && eduTestQuizParticipants.size() > 0) {
                eduModel.setStatusId(eduTestQuizParticipants.get(0).getStatusId());
                listModel.add(eduModel);
            } else {
                eduModel.setStatusId(null);
            }

            //listModel.add(eduModel);
        }
        return listModel;
    }

    private boolean checkCanBeReassignQuizGroup(List<UUID> quizGroupIds) {
        // if there exist participants of one of this group doing quiz, then cannot CHANGE
        List<QuizGroupQuestionParticipationExecutionChoice> quizGroupQuestionParticipationExecutionChoices
            = quizGroupQuestionParticipationExecutionChoiceRepo.findByQuizGroupIdIn(quizGroupIds);

        if (quizGroupQuestionParticipationExecutionChoices == null
            || quizGroupQuestionParticipationExecutionChoices.size() == 0) {
            return true;
        } else {
            return false;
        }
    }

    @Transactional
    @Override
    public boolean autoAssignParticipants2QuizTestGroup(AutoAssignParticipants2QuizTestGroupInputModel input) {
        List<EduTestQuizGroup> eduTestQuizGroups = eduQuizTestGroupRepo.findByTestId(input.getQuizTestId());
        if (eduTestQuizGroups.size() <= 0) {
            return false;
        }

        // remove existing records related to eduTestQizGroups
        List<UUID> quizGroupIds = new ArrayList();
        for (EduTestQuizGroup g : eduTestQuizGroups) {
            quizGroupIds.add(g.getQuizGroupId());
        }

        if (checkCanBeReassignQuizGroup(quizGroupIds) == false) {
            log.info("autoAssignParticipants2QuizTestGroup, quiz groups are executed, cannot be CHANGED");
            return false;
        }

        List<EduTestQuizGroupParticipationAssignment> eduTestQuizGroupParticipationAssignments =
            eduTestQuizGroupParticipationAssignmentRepo.findAllByQuizGroupIdIn(quizGroupIds);

        for (EduTestQuizGroupParticipationAssignment a : eduTestQuizGroupParticipationAssignments) {
            eduTestQuizGroupParticipationAssignmentRepo.delete(a);
        }

        // balanced and random assignment algorithms
        List<EduTestQuizParticipant> eduTestQuizParticipants = eduTestQuizParticipantRepo
            .findByTestIdAndStatusId(input.getQuizTestId(), EduTestQuizParticipant.STATUS_APPROVED);

        Random R = new Random();

        HashMap<EduTestQuizGroup, Integer> mGroup2Qty = new HashMap();
        for (EduTestQuizGroup g : eduTestQuizGroups) {
            mGroup2Qty.put(g, 0);
        }
        List<EduTestQuizGroup> cand = new ArrayList();

        for (EduTestQuizParticipant p : eduTestQuizParticipants) {
            int minQty = Integer.MAX_VALUE;
            for (EduTestQuizGroup g : eduTestQuizGroups) {
                if (minQty > mGroup2Qty.get(g)) {
                    minQty = mGroup2Qty.get(g);
                }
                log.info("autoAssignParticipants2QuizTestGroup, Qty = " + mGroup2Qty.get(g) + " minQty = " + minQty);
            }
            cand.clear();
            for (EduTestQuizGroup g : eduTestQuizGroups) {
                if (mGroup2Qty.get(g) == minQty) {
                    cand.add(g);
                }
            }

            //int idx  = R.nextInt(eduTestQuizGroups.size());
            //EduTestQuizGroup g = eduTestQuizGroups.get(idx);
            int idx = R.nextInt(cand.size());
            EduTestQuizGroup g = cand.get(idx);

            EduTestQuizGroupParticipationAssignment a = eduTestQuizGroupParticipationAssignmentRepo
                .findByQuizGroupIdAndParticipationUserLoginId(g.getQuizGroupId(), p.getParticipantUserLoginId());
            if (a == null) {
                log.info("autoAssignParticipants2QuizTestGroup, assignment " +
                         g.getQuizGroupId() +
                         "," +
                         p.getParticipantUserLoginId() +
                         " not exists -> insert new");
                a = new EduTestQuizGroupParticipationAssignment();
                a.setQuizGroupId(g.getQuizGroupId());
                a.setParticipationUserLoginId(p.getParticipantUserLoginId());
                a = eduTestQuizGroupParticipationAssignmentRepo.save(a);
                mGroup2Qty.put(g,minQty + 1);
            }
        }

        return true;
    }

    private List<QuizQuestion> getRandomQuiz(
        List<QuizQuestion> quizQuestions,
        int sz,
        HashMap<QuizQuestion, Integer> mQuiz2QtyUsed
    ) {
        List<QuizQuestion> retList = new ArrayList();
        int maxUsed = 0;
        for (QuizQuestion q : quizQuestions) {
            if (maxUsed < mQuiz2QtyUsed.get(q)) {
                maxUsed = mQuiz2QtyUsed.get(q);
            }
        }
        List<QuizQuestion>[] usedLevelList = new List[maxUsed + 1];
        for (int i = 0; i <= maxUsed; i++) {
            usedLevelList[i] = new ArrayList();
        }
        for (QuizQuestion q : quizQuestions) {
            int qty = mQuiz2QtyUsed.get(q);
            usedLevelList[qty].add(q);
        }
        Random R = new Random();
        int curLevel = 0;
        while (sz > 0) {
            if (sz >= usedLevelList[curLevel].size()) {
                for (QuizQuestion q : usedLevelList[curLevel]) {
                    retList.add(q);
                }
                sz = sz - usedLevelList[curLevel].size();
                curLevel++;
            } else {
                int[] idx = CommonUtils.genRandom(sz, usedLevelList[curLevel].size(), R);
                for (int i = 0; i < idx.length; i++) {
                    retList.add(usedLevelList[curLevel].get(idx[i]));
                }
                sz = 0;
            }
        }
        return retList;
    }

    private List<QuizQuestionDetailModel> getRandomQuizQuestionDetailModel(
        List<QuizQuestionDetailModel> quizQuestions,
        int sz,
        HashMap<QuizQuestionDetailModel, Integer> mQuiz2QtyUsed
    ) {
        List<QuizQuestionDetailModel> retList = new ArrayList();
        int maxUsed = 0;
        for (QuizQuestionDetailModel q : quizQuestions) {
            if (maxUsed < mQuiz2QtyUsed.get(q)) {
                maxUsed = mQuiz2QtyUsed.get(q);
            }
        }
        List<QuizQuestionDetailModel>[] usedLevelList = new List[maxUsed + 1];
        for (int i = 0; i <= maxUsed; i++) {
            usedLevelList[i] = new ArrayList();
        }
        for (QuizQuestionDetailModel q : quizQuestions) {
            int qty = mQuiz2QtyUsed.get(q);
            usedLevelList[qty].add(q);
        }
        Random R = new Random();
        int curLevel = 0;
        while (sz > 0) {
            if (sz >= usedLevelList[curLevel].size()) {
                for (QuizQuestionDetailModel q : usedLevelList[curLevel]) {
                    retList.add(q);
                }
                sz = sz - usedLevelList[curLevel].size();
                curLevel++;
            } else {
                int[] idx = CommonUtils.genRandom(sz, usedLevelList[curLevel].size(), R);
                for (int i = 0; i < idx.length; i++) {
                    retList.add(usedLevelList[curLevel].get(idx[i]));
                }
                sz = 0;
            }
        }
        return retList;
    }

    @Transactional
    @Override
    public boolean autoAssignQuestion2QuizTestGroup(AutoAssignQuestion2QuizTestGroupInputModel input) {
        log.info("autoAssignQuestion2QuizTestGroup, testId = " + input.getQuizTestId() +
                 " number questions = " + input.getNumberQuestions());
        List<EduTestQuizGroup> eduTestQuizGroups = eduQuizTestGroupRepo.findByTestId(input.getQuizTestId());
        if (eduTestQuizGroups.size() <= 0) {
            return false;
        }
        EduQuizTest eduQuizTest = repo.findById(input.getQuizTestId()).orElse(null);
        if (eduQuizTest == null) {
            log.info("autoAssignQuestion2QuizTestGroup, cannot find quizTest " + input.getQuizTestId());
            return false;
        }

        // remove existing records related to eduTestQizGroups
        List<UUID> quizGroupIds = new ArrayList();
        for (EduTestQuizGroup g : eduTestQuizGroups) {
            quizGroupIds.add(g.getQuizGroupId());
        }

        if (checkCanBeReassignQuizGroup(quizGroupIds) == false) {
            log.info("autoAssignQuestion2QuizTestGroup, quiz groups are executed, cannot be CHANGED");
            return false;
        }


        UUID classId = eduQuizTest.getClassId();
        EduClass eduClass = classService.findById(classId);
        if (eduClass == null) {
            log.info("autoAssignQuestion2QuizTestGroup, cannot find class " + classId);
            return false;
        }

        String courseId = eduClass.getEduCourse().getId();

        //List<QuizQuestion> quizQuestions = quizQuestionService.findQuizOfCourse(courseId);
        List<QuizQuestionDetailModel> quizQuestions = eduQuizTestQuizQuestionService.findAllByTestId(input.getQuizTestId());



        List<QuizQuestionDetailModel> usedQuizQuestions = new ArrayList<>();
        HashMap<QuizQuestionDetailModel, Integer> mQuiz2Qty = new HashMap();// map quiz -> amount used
        HashMap<QuizQuestionDetailModel, Integer> mQuiz2Index = new HashMap();
        HashMap<String, List<QuizQuestionDetailModel>> mapTopicLevel2Question = new HashMap();

        for (QuizQuestionDetailModel q : quizQuestions) {

            if (q.getStatusId().equals(QuizQuestion.STATUS_PUBLIC)) {
                continue;
            }

            String key = q.getQuizCourseTopic().getQuizCourseTopicId() + q.getLevelId();
            if (mapTopicLevel2Question.get(key) == null) {
                mapTopicLevel2Question.put(key, new ArrayList());
            }
            mapTopicLevel2Question.get(key).add(q);
            usedQuizQuestions.add(q);
            mQuiz2Qty.put(q, 0);
        }

        for (int i = 0; i < usedQuizQuestions.size(); i++) {
            mQuiz2Index.put(usedQuizQuestions.get(i), i);
        }
        int activeKeys = 0;
        for (String k : mapTopicLevel2Question.keySet()) {
            if (mapTopicLevel2Question.get(k) != null) {
                activeKeys++;
            }
        }
        String[] sortedTopicLevel = new String[activeKeys];
        int I = 0;
        for (String k : mapTopicLevel2Question.keySet()) {
            if (mapTopicLevel2Question.get(k) != null) {
                sortedTopicLevel[I] = k;
                I++;
            }
        }

        for (int i = 0; i < sortedTopicLevel.length; i++) {
            for (int j = i + 1; j < sortedTopicLevel.length; j++) {
                if (mapTopicLevel2Question.get(sortedTopicLevel[i]).size() <
                    mapTopicLevel2Question.get(sortedTopicLevel[j]).size()) {
                    String t = sortedTopicLevel[i];
                    sortedTopicLevel[i] = sortedTopicLevel[j];
                    sortedTopicLevel[j] = t;
                }
            }
        }

/*
        for(int i = 0; i < sortedTopicLevel.length; i++){
            log.info("autoAssignQuestion2QuizTestGroup, topicLevel " + sortedTopicLevel[i] + " has "
                     + mapTopicLevel2Question.get(sortedTopicLevel[i]).size() + " quizs");

        }
*/

        HashMap<String, Integer> mTopicId2Num = new HashMap<>();
        for (String k : mapTopicLevel2Question.keySet()) {
            mTopicId2Num.put(k, 0);
        }
        int amount = input.getNumberQuestions();
        int cnt = 0;
        //for(String k: mapTopicId2QUestion.keySet()){
        for (int i = 0; i < sortedTopicLevel.length; i++) {
            String k = sortedTopicLevel[i];
            cnt += mapTopicLevel2Question.get(k).size();
        }
        // neu user-input amount > number of availables questions cnt then amount = cnt
        if (amount > cnt) {
            amount = cnt;
        }
        amount = sortedTopicLevel.length;// TEMPORARY USED: each category pick a quiz

        int sel_idx = 0;
        while (amount > 0) {
            int a = mTopicId2Num.get(sortedTopicLevel[sel_idx]);
            if (a < mapTopicLevel2Question.get(sortedTopicLevel[sel_idx]).size()) {
                mTopicId2Num.put(sortedTopicLevel[sel_idx], a + 1);
                amount--;
            }
            sel_idx++;
            if (sel_idx >= sortedTopicLevel.length) {
                sel_idx = 0;
            }
        }
        for (int i = 0; i < sortedTopicLevel.length; i++) {
            log.info("autoAssignQuestion2QuizTestGroup, topic " + sortedTopicLevel[i] + " has "
                     + mapTopicLevel2Question.get(sortedTopicLevel[i]).size() + " questions" +
                     " select " + mTopicId2Num.get(sortedTopicLevel[i]));
        }

        Random R = new Random();

        // delete existing assignment of quiz groups
        for (EduTestQuizGroup g : eduTestQuizGroups) {
            List<QuizGroupQuestionAssignment> list = quizGroupQuestionAssignmentRepo
                .findQuizGroupQuestionAssignmentsByQuizGroupId(g.getQuizGroupId());
            for (QuizGroupQuestionAssignment qq : list) {
                quizGroupQuestionAssignmentRepo.delete(qq);
            }
        }


        for (EduTestQuizGroup g : eduTestQuizGroups) {
            for (int i = 0; i < sortedTopicLevel.length; i++) {
                String topicId = sortedTopicLevel[i];
                int sz = mTopicId2Num.get(topicId);
                List<QuizQuestionDetailModel> questions = mapTopicLevel2Question.get(topicId);
                // select randomly sz questions from questions
                List<QuizQuestionDetailModel> selectedQuiz = getRandomQuizQuestionDetailModel(questions, sz, mQuiz2Qty);
                for (QuizQuestionDetailModel q : selectedQuiz) {
                    log.info("autoAssignQuestion2QuizTestGroup, group " + g.getGroupCode()
                             + " topic " + topicId + " -> select quiz " + mQuiz2Index.get(q));

                    mQuiz2Qty.put(q, mQuiz2Qty.get(q) + 1);// augment the occurrences of q

                    QuizGroupQuestionAssignment qq = quizGroupQuestionAssignmentRepo
                        .findByQuestionIdAndQuizGroupId(q.getQuestionId(), g.getQuizGroupId());

                    if (qq == null) {
                        //log.info("autoAssignQuestion2QuizTestGroup, record " + q.getQuestionId() + "," + g.getQuizGroupId() + " not exists -> insert new");
                        qq = new QuizGroupQuestionAssignment();
                        qq.setQuestionId(q.getQuestionId());
                        qq.setQuizGroupId(g.getQuizGroupId());
                        qq = quizGroupQuestionAssignmentRepo.save(qq);
                    }

                }
                /*
                int[] idx = CommonUtils.genRandom(sz,questions.size(),R);
                if(idx != null){
                    for(int j = 0; j < idx.length; j++){
                        QuizQuestion q = questions.get(idx[j]);
                        QuizGroupQuestionAssignment qq = quizGroupQuestionAssignmentRepo
                            .findByQuestionIdAndQuizGroupId(q.getQuestionId(),g.getQuizGroupId());

                        if(qq == null){
                            log.info("autoAssignQuestion2QuizTestGroup, record " + q.getQuestionId() + "," + g.getQuizGroupId() + " not exists -> insert new");
                            qq = new QuizGroupQuestionAssignment();
                            qq.setQuestionId(q.getQuestionId());
                            qq.setQuizGroupId(g.getQuizGroupId());
                            qq = quizGroupQuestionAssignmentRepo.save(qq);
                        }
                    }
                }

                 */
            }
        }
        return true;

    }
    @Transactional
    //@Override
    public boolean autoAssignQuestion2QuizTestGroupTMP(AutoAssignQuestion2QuizTestGroupInputModel input) {
        log.info("autoAssignQuestion2QuizTestGroup, testId = " + input.getQuizTestId() +
                 " number questions = " + input.getNumberQuestions());
        List<EduTestQuizGroup> eduTestQuizGroups = eduQuizTestGroupRepo.findByTestId(input.getQuizTestId());
        if (eduTestQuizGroups.size() <= 0) {
            return false;
        }
        EduQuizTest eduQuizTest = repo.findById(input.getQuizTestId()).orElse(null);
        if (eduQuizTest == null) {
            log.info("autoAssignQuestion2QuizTestGroup, cannot find quizTest " + input.getQuizTestId());
            return false;
        }

        // remove existing records related to eduTestQizGroups
        List<UUID> quizGroupIds = new ArrayList();
        for (EduTestQuizGroup g : eduTestQuizGroups) {
            quizGroupIds.add(g.getQuizGroupId());
        }

        if (checkCanBeReassignQuizGroup(quizGroupIds) == false) {
            log.info("autoAssignQuestion2QuizTestGroup, quiz groups are executed, cannot be CHANGED");
            return false;
        }


        UUID classId = eduQuizTest.getClassId();
        EduClass eduClass = classService.findById(classId);
        if (eduClass == null) {
            log.info("autoAssignQuestion2QuizTestGroup, cannot find class " + classId);
            return false;
        }

        String courseId = eduClass.getEduCourse().getId();

        List<QuizQuestion> quizQuestions = quizQuestionService.findQuizOfCourse(courseId);


        List<QuizQuestion> usedQuizQuestions = new ArrayList<>();
        HashMap<QuizQuestion, Integer> mQuiz2Qty = new HashMap();// map quiz -> amount used
        HashMap<QuizQuestion, Integer> mQuiz2Index = new HashMap();
        HashMap<String, List<QuizQuestion>> mapTopicLevel2Question = new HashMap();

        for (QuizQuestion q : quizQuestions) {

            if (q.getStatusId().equals(QuizQuestion.STATUS_PUBLIC)) {
                continue;
            }

            String key = q.getQuizCourseTopic().getQuizCourseTopicId() + q.getLevelId();
            if (mapTopicLevel2Question.get(key) == null) {
                mapTopicLevel2Question.put(key, new ArrayList<QuizQuestion>());
            }
            mapTopicLevel2Question.get(key).add(q);
            usedQuizQuestions.add(q);
            mQuiz2Qty.put(q, 0);
        }

        for (int i = 0; i < usedQuizQuestions.size(); i++) {
            mQuiz2Index.put(usedQuizQuestions.get(i), i);
        }
        int activeKeys = 0;
        for (String k : mapTopicLevel2Question.keySet()) {
            if (mapTopicLevel2Question.get(k) != null) {
                activeKeys++;
            }
        }
        String[] sortedTopicLevel = new String[activeKeys];
        int I = 0;
        for (String k : mapTopicLevel2Question.keySet()) {
            if (mapTopicLevel2Question.get(k) != null) {
                sortedTopicLevel[I] = k;
                I++;
            }
        }

        for (int i = 0; i < sortedTopicLevel.length; i++) {
            for (int j = i + 1; j < sortedTopicLevel.length; j++) {
                if (mapTopicLevel2Question.get(sortedTopicLevel[i]).size() <
                    mapTopicLevel2Question.get(sortedTopicLevel[j]).size()) {
                    String t = sortedTopicLevel[i];
                    sortedTopicLevel[i] = sortedTopicLevel[j];
                    sortedTopicLevel[j] = t;
                }
            }
        }

/*
        for(int i = 0; i < sortedTopicLevel.length; i++){
            log.info("autoAssignQuestion2QuizTestGroup, topicLevel " + sortedTopicLevel[i] + " has "
                     + mapTopicLevel2Question.get(sortedTopicLevel[i]).size() + " quizs");

        }
*/

        HashMap<String, Integer> mTopicId2Num = new HashMap<>();
        for (String k : mapTopicLevel2Question.keySet()) {
            mTopicId2Num.put(k, 0);
        }
        int amount = input.getNumberQuestions();
        int cnt = 0;
        //for(String k: mapTopicId2QUestion.keySet()){
        for (int i = 0; i < sortedTopicLevel.length; i++) {
            String k = sortedTopicLevel[i];
            cnt += mapTopicLevel2Question.get(k).size();
        }
        // neu user-input amount > number of availables questions cnt then amount = cnt
        if (amount > cnt) {
            amount = cnt;
        }
        amount = sortedTopicLevel.length;// TEMPORARY USED: each category pick a quiz

        int sel_idx = 0;
        while (amount > 0) {
            int a = mTopicId2Num.get(sortedTopicLevel[sel_idx]);
            if (a < mapTopicLevel2Question.get(sortedTopicLevel[sel_idx]).size()) {
                mTopicId2Num.put(sortedTopicLevel[sel_idx], a + 1);
                amount--;
            }
            sel_idx++;
            if (sel_idx >= sortedTopicLevel.length) {
                sel_idx = 0;
            }
        }
        for (int i = 0; i < sortedTopicLevel.length; i++) {
            log.info("autoAssignQuestion2QuizTestGroup, topic " + sortedTopicLevel[i] + " has "
                     + mapTopicLevel2Question.get(sortedTopicLevel[i]).size() + " questions" +
                     " select " + mTopicId2Num.get(sortedTopicLevel[i]));
        }

        Random R = new Random();

        // delete existing assignment of quiz groups
        for (EduTestQuizGroup g : eduTestQuizGroups) {
            List<QuizGroupQuestionAssignment> list = quizGroupQuestionAssignmentRepo
                .findQuizGroupQuestionAssignmentsByQuizGroupId(g.getQuizGroupId());
            for (QuizGroupQuestionAssignment qq : list) {
                quizGroupQuestionAssignmentRepo.delete(qq);
            }
        }


        for (EduTestQuizGroup g : eduTestQuizGroups) {
            for (int i = 0; i < sortedTopicLevel.length; i++) {
                String topicId = sortedTopicLevel[i];
                int sz = mTopicId2Num.get(topicId);
                List<QuizQuestion> questions = mapTopicLevel2Question.get(topicId);
                // select randomly sz questions from questions
                List<QuizQuestion> selectedQuiz = getRandomQuiz(questions, sz, mQuiz2Qty);
                for (QuizQuestion q : selectedQuiz) {
                    log.info("autoAssignQuestion2QuizTestGroup, group " + g.getGroupCode()
                             + " topic " + topicId + " -> select quiz " + mQuiz2Index.get(q));

                    mQuiz2Qty.put(q, mQuiz2Qty.get(q) + 1);// augment the occurrences of q

                    QuizGroupQuestionAssignment qq = quizGroupQuestionAssignmentRepo
                        .findByQuestionIdAndQuizGroupId(q.getQuestionId(), g.getQuizGroupId());

                    if (qq == null) {
                        //log.info("autoAssignQuestion2QuizTestGroup, record " + q.getQuestionId() + "," + g.getQuizGroupId() + " not exists -> insert new");
                        qq = new QuizGroupQuestionAssignment();
                        qq.setQuestionId(q.getQuestionId());
                        qq.setQuizGroupId(g.getQuizGroupId());
                        qq = quizGroupQuestionAssignmentRepo.save(qq);
                    }

                }
                /*
                int[] idx = CommonUtils.genRandom(sz,questions.size(),R);
                if(idx != null){
                    for(int j = 0; j < idx.length; j++){
                        QuizQuestion q = questions.get(idx[j]);
                        QuizGroupQuestionAssignment qq = quizGroupQuestionAssignmentRepo
                            .findByQuestionIdAndQuizGroupId(q.getQuestionId(),g.getQuizGroupId());

                        if(qq == null){
                            log.info("autoAssignQuestion2QuizTestGroup, record " + q.getQuestionId() + "," + g.getQuizGroupId() + " not exists -> insert new");
                            qq = new QuizGroupQuestionAssignment();
                            qq.setQuestionId(q.getQuestionId());
                            qq.setQuizGroupId(g.getQuizGroupId());
                            qq = quizGroupQuestionAssignmentRepo.save(qq);
                        }
                    }
                }

                 */
            }
        }
        return true;

    }


    @Override
    public Integer rejectStudentsInTest(String testId, String[] userLoginId) {
        Integer re = 0;
        for (String student : userLoginId) {
            re += repo.rejectStudentInTest(testId, student);
        }
        return re;
    }

    @Override
    public EduQuizTest getQuizTestById(String testId) {
        Optional<EduQuizTest> re = repo.findById(testId);

        if (re.isPresent()) {
            return re.get();
        } else {
            return null;
        }
    }

    @Override
    public Integer acceptStudentsInTest(String testId, String[] userLoginId) {
        Integer re = 0;
        for (String student : userLoginId) {
            re += repo.acceptStudentInTest(testId, student);
        }
        return re;
    }

    @Override
    public List<QuizTestGroupInfoModel> getQuizTestGroupsInfoByTestId(String testId) {
        List<QuizTestGroupInfo> info = eduQuizTestGroupRepo.findQuizTestGroupsInfo(testId);

        List<QuizTestGroupInfoModel> re = new ArrayList<>();

        for (QuizTestGroupInfo quizTestGroupInfo : info) {
            QuizTestGroupInfoModel temp = new QuizTestGroupInfoModel();
            temp.setQuizGroupId(quizTestGroupInfo.getQuiz_group_id());
            temp.setGroupCode(quizTestGroupInfo.getGroup_code());
            temp.setNote(quizTestGroupInfo.getNote());
            temp.setNumQuestion(quizTestGroupInfo.getNum_question());
            temp.setNumStudent(quizTestGroupInfo.getNum_student());
            re.add(temp);
        }

        return re;
    }

    private boolean checkQuizGroupCanbeDeleted(UUID quizGroupId) {
        List<QuizGroupQuestionParticipationExecutionChoice> lst = quizGroupQuestionParticipationExecutionChoiceRepo
            .findByQuizGroupId(quizGroupId);
        if (lst == null || lst.size() == 0) {
            return true;
        } else {
            return false;
        }
    }

    public Integer deleteQuizTestGroups(String testId, String[] listQuizTestGroupId) {
        for (String id : listQuizTestGroupId) {
            UUID quizGroupId = UUID.fromString(id);
            if (checkQuizGroupCanbeDeleted(quizGroupId) == false) {
                log.info("deleteQuizTestGroups, quizGroup " + quizGroupId + " being executed, cannot be deleted!");
                return 0;
            }
        }

        Integer re = 0;
        for (String id : listQuizTestGroupId) {
            UUID quizGroupId = UUID.fromString(id);
            re += eduQuizTestGroupRepo.deleteQuizTestGroup(testId, quizGroupId);
        }
        return re;
    }

    public List<QuizTestParticipationExecutionResultOutputModel> getQuizTestParticipationExecutionResult(String testId) {
        //TODO by HUY HUY

        //create list
        List<QuizTestParticipationExecutionResultOutputModel> listResult = new ArrayList<>();


        //find user + group id
        List<EduTestQuizParticipant> eduTestQuizParticipants = eduTestQuizParticipantRepo.findByTestIdAndStatusId(
            testId,
            "STATUS_APPROVED");

        List<StudentInfo> list = repo.findAllStudentInTest(testId);

        List<EduTestQuizGroup> eduTestQuizGroups = eduQuizTestGroupRepo.findByTestId(testId);

        for (StudentInfo studentInfo : list) {
            log.info("getQuizTestParticipationExecutionResult, consider user " + studentInfo.getUser_login_id() + "");

            for (EduTestQuizGroup eduTestQuizGroup : eduTestQuizGroups) {

                if (eduTestQuizGroupParticipationAssignmentRepo.existsById(new CompositeEduTestQuizGroupParticipationAssignmentId(
                    eduTestQuizGroup.getQuizGroupId(),
                    studentInfo.getUser_login_id()))) {
                    List<QuizGroupQuestionAssignment> quizGroupQuestionAssignments = quizGroupQuestionAssignmentRepo.findQuizGroupQuestionAssignmentsByQuizGroupId(
                        eduTestQuizGroup.getQuizGroupId());
                    quizGroupQuestionAssignments.forEach(question -> {

                        //create model
                        QuizTestParticipationExecutionResultOutputModel quizTestParticipationExecutionResultOutputModel =
                            new QuizTestParticipationExecutionResultOutputModel();

                        // get list choice
                        List<UUID> chooseAnsIds = new ArrayList<>();
                        List<QuizGroupQuestionParticipationExecutionChoice> quizGroupQuestionParticipationExecutionChoices =
                            quizGroupQuestionParticipationExecutionChoiceRepo
                            .findQuizGroupQuestionParticipationExecutionChoicesByParticipationUserLoginIdAndQuizGroupIdAndQuestionId(
                                studentInfo.getUser_login_id(),
                                eduTestQuizGroup.getQuizGroupId(),
                                question.getQuestionId());

                        //quizGroupQuestionParticipationExecutionChoices.forEach(choice -> {
                        //    chooseAnsIds.add(choice.getChoiceAnswerId());
                        //});
                        Date createdStamp = null;
                        for(QuizGroupQuestionParticipationExecutionChoice choice: quizGroupQuestionParticipationExecutionChoices){
                            createdStamp = choice.getCreatedStamp();
                            chooseAnsIds.add(choice.getChoiceAnswerId());
                        }
                        quizTestParticipationExecutionResultOutputModel.setChooseAnsIds(chooseAnsIds);
                        quizTestParticipationExecutionResultOutputModel.setCreatedStamp(createdStamp);

                        //get question
                        //QuizQuestionDetailModel quizQuestionDetail = quizQuestionService.findQuizDetail(question.getQuestionId());
                        //quizTestParticipationExecutionResultOutputModel.setQuizChoiceAnswerList(quizQuestionDetail.getQuizChoiceAnswerList());
                        //quizTestParticipationExecutionResultOutputModel.setQuestionContent(quizQuestionDetail.getStatement());

                        QuizQuestion q = quizQuestionRepo.findById(question.getQuestionId()).orElse(null);
                        List<QuizChoiceAnswer> ans = quizChoiceAnswerRepo.findAllByQuizQuestion(q);
                        quizTestParticipationExecutionResultOutputModel.setQuestionContent(q.getQuestionContent());

                        //check choice in question

                        boolean ques_ans = true;
                        List<UUID> correctAns =
                            //quizQuestionDetail.getQuizChoiceAnswerList()
                            ans
                            .stream()
                            .filter(answer -> answer.getIsCorrectAnswer() == 'Y')
                            .map(QuizChoiceAnswer::getChoiceAnswerId)
                            .collect(Collectors.toList());

                        // TRUE if and only if correctAns = chooseAnsIds
                        //if (!correctAns.containsAll(chooseAnsIds)) {
                        //    ques_ans = false;
                        //}
                        ques_ans = correctAns.containsAll(chooseAnsIds) && chooseAnsIds.containsAll(correctAns)
                                   && chooseAnsIds.size() > 0;

                       // log.info("getQuizTestParticipationExecutionResult, correctAns = ");
                        //for (UUID u : correctAns) {
                           // log.info("getQuizTestParticipationExecutionResult, correctAns = " + u);
                        //}
                        //for (UUID u : chooseAnsIds) {
                            //log.info("getQuizTestParticipationExecutionResult, chooseAns = " + u);
                        //}
                        //log.info("getQuizTestParticipationExecutionResult, user " + studentInfo.getUser_login_id() +
                        //         " quiz " + question.getQuestionId() + " -> ques_ans = " + ques_ans);

                        char result = ques_ans ? 'Y' : 'N';
                        int grade = ques_ans ? 1 : 0;

                        quizTestParticipationExecutionResultOutputModel.setParticipationUserLoginId(studentInfo.getUser_login_id());
                        quizTestParticipationExecutionResultOutputModel.setTestId(testId);
                        quizTestParticipationExecutionResultOutputModel.setQuizGroupId(eduTestQuizGroup.getQuizGroupId());
                        quizTestParticipationExecutionResultOutputModel.setQuizGroupCode(eduTestQuizGroup.getGroupCode());
                        quizTestParticipationExecutionResultOutputModel.setQuestionId(question.getQuestionId());
                        quizTestParticipationExecutionResultOutputModel.setResult(result);
                        quizTestParticipationExecutionResultOutputModel.setGrade(grade);
                        quizTestParticipationExecutionResultOutputModel.setParticipationFullName(studentInfo.getFull_name());

                        listResult.add(quizTestParticipationExecutionResultOutputModel);
                        //log.info("getQuizTestParticipationExecutionResult, add result with user " + quizTestParticipationExecutionResultOutputModel.getParticipationUserLoginId()
                        //+ " group " + eduTestQuizGroup.getGroupCode() + " question " + question.getQuestionId() + " time = " + quizTestParticipationExecutionResultOutputModel.getCreatedStamp());
                    });
                }

            }
        }

        return listResult;
    }
    public List<QuizTestParticipationExecutionResultOutputModel> getQuizTestParticipationExecutionResultNewByPQD(String testId) {
//create list
        List<QuizTestParticipationExecutionResultOutputModel> listResult = new ArrayList<>();


        //find user + group id
        List<EduTestQuizParticipant> eduTestQuizParticipants = eduTestQuizParticipantRepo.findByTestIdAndStatusId(
            testId,
            "STATUS_APPROVED");

        List<StudentInfo> list = repo.findAllStudentInTest(testId);

        List<EduTestQuizGroup> eduTestQuizGroups = eduQuizTestGroupRepo.findByTestId(testId);
        List<String> userLoginIds = eduTestQuizParticipants.stream().map(p -> p.getParticipantUserLoginId()).collect(
            Collectors.toList());
        List<UUID> groupIds = eduTestQuizGroups.stream().map(g -> g.getQuizGroupId()).collect(Collectors.toList());

        List<QuizGroupQuestionParticipationExecutionChoice> lst = quizGroupQuestionParticipationExecutionChoiceRepo
            .findAllByParticipationUserLoginIdInAndQuizGroupIdIn(userLoginIds, groupIds);

        for(String u: userLoginIds){
            log.info("getQuizTestParticipationExecutionResultNewByPQD, collect users in test " + u);
        }
        for(UUID g: groupIds){
            log.info("getQuizTestParticipationExecutionResultNewByPQD, collect group in test " + g);
        }

        class QuestionAndAnswer{
            public UUID questionId;
            List<UUID> chooseAnswerIds;
        }
        Map<String, List<QuestionAndAnswer>> m = new HashMap<String, List<QuestionAndAnswer>>();

        for(QuizGroupQuestionParticipationExecutionChoice ec: lst){
            log.info("getQuizTestParticipationExecutionResultNewByPQD executionChoice user = "
                     + ec.getParticipationUserLoginId() + " group " + ec.getQuizGroupId() + " question " +
                     ec.getQuestionId() + "datetime = " + ec.getCreatedStamp());
            if(m.get(ec.getParticipationUserLoginId())==null)
                m.put(ec.getParticipationUserLoginId(), new ArrayList<QuestionAndAnswer>());


        }

        return listResult;
    }

    @Override
    public boolean userAnsweredAQuizQuestion(String userLoginId, UUID questionId, UUID quizGroupId) {
        List<QuizGroupQuestionParticipationExecutionChoice> choices =
            quizGroupQuestionParticipationExecutionChoiceRepo
                .findQuizGroupQuestionParticipationExecutionChoicesByParticipationUserLoginIdAndQuizGroupIdAndQuestionId(
                    userLoginId,
                    quizGroupId,
                    questionId);

        return choices != null && choices.size() > 0;
    }

    @Override
    public int copyQuestionsFromQuizTest2QuizTest(UserLogin u, String fromQuizTestId, String toQuizTestId) {
        List<QuizQuestionDetailModel> quizQuestions =
            eduQuizTestQuizQuestionService.findAllByTestId(fromQuizTestId);
        int cnt = 0;
        for(QuizQuestionDetailModel q: quizQuestions){

            cnt += eduQuizTestQuizQuestionService.createQuizTestQuestion(u,toQuizTestId, q.getQuestionId());
        }
        return cnt;
    }
}
