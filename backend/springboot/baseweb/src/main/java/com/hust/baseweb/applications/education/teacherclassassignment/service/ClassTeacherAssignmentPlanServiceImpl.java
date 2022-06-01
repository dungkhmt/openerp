package com.hust.baseweb.applications.education.teacherclassassignment.service;

import com.google.gson.Gson;
import com.hust.baseweb.applications.education.entity.EduCourse;
import com.hust.baseweb.applications.education.repo.EduCourseRepo;
import com.hust.baseweb.applications.education.teacherclassassignment.entity.*;
import com.hust.baseweb.applications.education.teacherclassassignment.entity.compositeid.TeacherCourseId;
import com.hust.baseweb.applications.education.teacherclassassignment.model.*;
import com.hust.baseweb.applications.education.teacherclassassignment.model.teachersuggestion.ClassToListTeacher;
import com.hust.baseweb.applications.education.teacherclassassignment.model.teachersuggestion.SuggestedTeacherAndActionForClass;
import com.hust.baseweb.applications.education.teacherclassassignment.model.teachersuggestion.TeacherCandidate;
import com.hust.baseweb.applications.education.teacherclassassignment.repo.*;
import com.hust.baseweb.applications.education.teacherclassassignment.utils.CheckConflict;
import com.hust.baseweb.applications.education.teacherclassassignment.utils.TimeTableStartAndDuration;
import com.hust.baseweb.applications.education.teacherclassassignment.utils.TimetableConflictChecker;
import com.hust.baseweb.entity.UserLogin;
import com.hust.baseweb.repo.UserLoginRepo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

@Log4j2
@AllArgsConstructor(onConstructor_ = @Autowired)
@Service
public class ClassTeacherAssignmentPlanServiceImpl implements ClassTeacherAssignmentPlanService {

    private UserLoginRepo userLoginRepo;

    private ClassTeacherAssignmentPlanRepo classTeacherAssignmentPlanRepo;

    private ClassTeacherAssignmentClassInfoRepo classTeacherAssignmentClassInfoRepo;

    private TeacherCourseRepo teacherCourseRepo;

    private EduTeacherRepo eduTeacherRepo;

    private EduCourseRepo eduCourseRepo;

    private TeacherClassAssignmentSolutionRepo teacherClassAssignmentSolutionRepo;

    private TeacherCourseForAssignmentPlanRepo teacherCourseForAssignmentPlanRepo;

    private TeacherForAssignmentPlanRepo teacherForAssignmentPlanRepo;

    private TeacherClassAssignmentAlgoService teacherClassAssignmentAlgoService;

    @Override
    public ClassTeacherAssignmentPlan create(UserLogin u, ClassTeacherAssignmentPlanCreateModel input) {
        ClassTeacherAssignmentPlan classTeacherAssignmentPlan = new ClassTeacherAssignmentPlan();
        classTeacherAssignmentPlan.setPlanName(input.getPlanName());
        classTeacherAssignmentPlan.setCreatedStamp(new Date());
        classTeacherAssignmentPlan.setCreatedByUserLoginId(u.getUserLoginId());
        classTeacherAssignmentPlan = classTeacherAssignmentPlanRepo.save(classTeacherAssignmentPlan);

        return classTeacherAssignmentPlan;
    }

    @Override
    public List<ClassTeacherAssignmentPlan> findAll() {
        List<ClassTeacherAssignmentPlan> classTeacherAssignmentPlans = classTeacherAssignmentPlanRepo.findAll();
        return classTeacherAssignmentPlans;
    }

    @Override
    public ClassTeacherAssignmentPlanDetailModel getClassTeacherAssignmentPlanDetail(UUID planId) {
        ClassTeacherAssignmentPlan classTeacherAssignmentPlan = classTeacherAssignmentPlanRepo
            .findById(planId)
            .orElse(null);
        ClassTeacherAssignmentPlanDetailModel classTeacherAssignmentPlanDetailModel = new ClassTeacherAssignmentPlanDetailModel();
        classTeacherAssignmentPlanDetailModel.setPlanId(classTeacherAssignmentPlan.getPlanId());
        classTeacherAssignmentPlanDetailModel.setPlanName(classTeacherAssignmentPlan.getPlanName());
        classTeacherAssignmentPlanDetailModel.setCreatedByUserLoginId(classTeacherAssignmentPlan.getCreatedByUserLoginId());
        DateFormat dateFormat = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");
        String dateTimeStr = dateFormat.format(classTeacherAssignmentPlan.getCreatedStamp());
        classTeacherAssignmentPlanDetailModel.setCreatedDate(dateTimeStr);

        return classTeacherAssignmentPlanDetailModel;
    }

    @Override
    //public List<ClassTeacherAssignmentClassInfo> findAllClassTeacherAssignmentClassByPlanId(UUID planId) {
    public List<ClassInfoForAssignment2TeacherModel> findAllClassTeacherAssignmentClassByPlanId(UUID planId) {
        List<ClassTeacherAssignmentClassInfo> classTeacherAssignmentClassInfos =
            classTeacherAssignmentClassInfoRepo.findAllByPlanId(planId);
        List<ClassInfoForAssignment2TeacherModel> lst = new ArrayList();
        List<TeacherCourse> teacherCourses = teacherCourseRepo.findAll();
        HashMap<String, List<TeacherCourse>> mCourseId2Teacher = new HashMap();

        for (TeacherCourse tc : teacherCourses) {
            if (mCourseId2Teacher.get(tc.getCourseId()) == null) {
                mCourseId2Teacher.put(tc.getCourseId(), new ArrayList<>());
            }
            mCourseId2Teacher.get(tc.getCourseId()).add(tc);
        }

        List<TeacherCourseForAssignmentPlan> teacherCourseForAssignmentPlans = teacherCourseForAssignmentPlanRepo.findAllByPlanId(
            planId);
        List<TeacherForAssignmentPlan> teacherForAssignmentPlans = teacherForAssignmentPlanRepo.findAllByPlanId(planId);
        HashSet<String> teacherPlanIds = new HashSet();

        for (TeacherForAssignmentPlan t : teacherForAssignmentPlans) {
            teacherPlanIds.add(t.getTeacherId());
        }

        HashMap<String, List<TeacherCourseForAssignmentPlan>> mCourseId2TeacherInPlan = new HashMap();
        for (TeacherCourseForAssignmentPlan tcp : teacherCourseForAssignmentPlans) {
            if (mCourseId2TeacherInPlan.get(tcp.getCourseId()) == null) {
                mCourseId2TeacherInPlan.put(tcp.getCourseId(), new ArrayList());
            }

            if (teacherPlanIds.contains(tcp.getTeacherId())) {
                mCourseId2TeacherInPlan.get(tcp.getCourseId()).add(tcp);
            }
        }

        for (ClassTeacherAssignmentClassInfo c : classTeacherAssignmentClassInfos) {
            ClassInfoForAssignment2TeacherModel classInfoForAssignment2TeacherModel =
                new ClassInfoForAssignment2TeacherModel(c);
            int nbTeachers = 0;

            if (mCourseId2Teacher.get(c.getCourseId()) != null) {
                nbTeachers = mCourseId2Teacher.get(c.getCourseId()).size();
            }

            int nbTeachersInPlan = 0;
            if (mCourseId2TeacherInPlan.get(c.getCourseId()) != null) {
                nbTeachersInPlan = mCourseId2TeacherInPlan.get(c.getCourseId()).size();
            }

            classInfoForAssignment2TeacherModel.setNumberPosibleTeachers(nbTeachers);
            classInfoForAssignment2TeacherModel.setNumberPosibleTeachersInPlan(nbTeachersInPlan);

            lst.add(classInfoForAssignment2TeacherModel);
        }
        //return classTeacherAssignmentClassInfos;
        return lst;
    }

    @Transactional
    @Override
    public boolean extractExcelAndStoreDB(UUID planId, MultipartFile file) {
        List<ClassTeacherAssignmentClassInfo> lst = new ArrayList();
        try {
            InputStream inputStream = file.getInputStream();
            HSSFWorkbook wb = new HSSFWorkbook(inputStream);
            HSSFSheet sheet = wb.getSheetAt(0);
            int sz = sheet.getLastRowNum();
            for (int i = 1; i <= sz; i++) {
                Row row = sheet.getRow(i);
                Cell c = row.getCell(0);
                String schoolName = c.getStringCellValue();
                c = row.getCell(1);
                String semesterId = c.getStringCellValue();
                c = row.getCell(2);
                String classId = c.getStringCellValue();
                c = row.getCell(3);
                String courseId = c.getStringCellValue();
                c = row.getCell(4);
                String className = c.getStringCellValue();
                c = row.getCell(5);
                String creditInfo = c.getStringCellValue();
                c = row.getCell(6);
                String classNote = c.getStringCellValue();

                c = row.getCell(7);
                String program = c.getStringCellValue();
                c = row.getCell(8);
                String semesterType = c.getStringCellValue();
                c = row.getCell(9);
                int enrollment = Integer.valueOf(c.getStringCellValue());
                c = row.getCell(10);
                int maxEnrollment = Integer.valueOf(c.getStringCellValue());

                c = row.getCell(12);
                String timeTable = c.getStringCellValue();
                c = row.getCell(13);
                String lesson = c.getStringCellValue();
                c = row.getCell(14);
                String department = c.getStringCellValue();
                c = row.getCell(15);
                double hourLoad = c.getNumericCellValue();

                ClassTeacherAssignmentClassInfo cls = new ClassTeacherAssignmentClassInfo();
                cls.setClassId(classId);
                cls.setClassName(className);
                cls.setCourseId(courseId);
                cls.setClassNote(classNote);
                cls.setSemesterId(semesterId);
                cls.setSemesterType(semesterType);
                cls.setProgram(program);
                cls.setTimeTable(timeTable);
                cls.setLesson(lesson);
                cls.setDepartmentId(department);
                cls.setEnrollment(enrollment);
                cls.setMaxEnrollment(maxEnrollment);
                cls.setPlanId(planId);
                cls.setHourLoad(hourLoad);
                lst.add(cls);
                log.info(classId + "\t" + courseId + "\t" + className + "\t" + timeTable);
                cls = classTeacherAssignmentClassInfoRepo.save(cls);
            }
            inputStream.close();
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }

        return true;
    }

    @Override
    public String addTeacher(EduTeacher teacher) {
        Optional<EduTeacher> t = eduTeacherRepo.findById(teacher.getTeacherId());
        if (t.isPresent()) {
            return "Email đã tồn tại";
        }

        if (teacher.getUserLoginId() != null && !teacher.getUserLoginId().isEmpty()) {
            Optional<EduTeacher> t2 = eduTeacherRepo.findByUserLoginId(teacher.getUserLoginId());
            if (t2.isPresent()) {
                return "Tài khoản đã liên kết với email khác";
            }

            Optional<UserLogin> user = userLoginRepo.findById(teacher.getUserLoginId());
            if (!user.isPresent()) {
                return "Tài khoản không tồn tại";
            }
        }

        eduTeacherRepo.save(teacher);
        return "OK";
    }

    ;

    @Override
    public List<EduTeacher> findAllTeachers() {
        return eduTeacherRepo.findAll();
    }

    @Override
    public Page<EduTeacher> findAllTeachersByPage(String keyword, Pageable pageable) {
        return eduTeacherRepo.findAllContain(keyword, pageable);
    }

    @Override
    public List<TeacherForAssignmentPlan> findAllTeacherByPlanId(UUID planId) {
        return teacherForAssignmentPlanRepo.findAllByPlanId(planId);
    }

    @Transactional
    @Override
    public boolean addTeacherToAssignmentPlan(UUID planId, String teacherList) {
        log.info("addTeacherToAssignmentPlan");
        List<EduTeacher> teachers = eduTeacherRepo.findAll();
        Map<String, EduTeacher> mId2Teacher = new HashMap();
        for (EduTeacher t : teachers) {
            mId2Teacher.put(t.getTeacherId(), t);
            log.info("addTeacherToAssignmentPlan, put teacher " + t.getTeacherId() + " maxCredit " + t.getMaxCredit());
        }
        String[] lst = teacherList.split(";");
        Gson gson = new Gson();
        for (String t : lst) {
            TeacherMaxHourLoad teacherMaxHourLoad = gson.fromJson(t, TeacherMaxHourLoad.class);
            TeacherForAssignmentPlan teacherForAssignmentPlan =
                teacherForAssignmentPlanRepo.findByTeacherIdAndPlanId(teacherMaxHourLoad.getTeacherId(), planId);
            if (teacherForAssignmentPlan == null) {
                teacherForAssignmentPlan = new TeacherForAssignmentPlan();
                log.info("addTeacherToAssignmentPlan, record not exist -> create new!");
            }

            teacherForAssignmentPlan.setMaxHourLoad(teacherMaxHourLoad.getMaxHourLoad());
            teacherForAssignmentPlan.setTeacherId(teacherMaxHourLoad.getTeacherId());
            teacherForAssignmentPlan.setPlanId(planId);

            EduTeacher teacher = mId2Teacher.get(teacherMaxHourLoad.getTeacherId());
            if (teacher != null) {
                if (teacherMaxHourLoad.getMaxHourLoad() == 0) {
                    // take info from DB

                    teacherForAssignmentPlan.setMaxHourLoad(teacher.getMaxCredit());
                    log.info("addTeacherToAssignmentPlan, input maxHourLoad = 0 -> take from DB = " +
                             teacherForAssignmentPlan.getMaxHourLoad()
                             +
                             " = " +
                             teacher.getMaxCredit());
                }
            } else {
                log.info("addTeacherToAssignmentPlan, not found teacher " + teacherMaxHourLoad.getTeacherId());
            }


            teacherForAssignmentPlan = teacherForAssignmentPlanRepo.save(teacherForAssignmentPlan);

            log.info("addTeacherToAssignmentPlan, save teacher " +
                     teacherForAssignmentPlan.getTeacherId() +
                     " plan "
                     +
                     teacherForAssignmentPlan.getPlanId() +
                     " maxCredit  " +
                     teacherForAssignmentPlan.getMaxHourLoad());

        }
        return true;
    }

    @Transactional
    @Override
    public boolean removeTeacherFromAssignmentPlan(UUID planId, String teacherList) {
        log.info("removeTeacherFromAssignmentPlan");
        String[] lst = teacherList.split(";");
        Gson gson = new Gson();
        for (String t : lst) {
            TeacherMaxHourLoad teacherMaxHourLoad = gson.fromJson(t, TeacherMaxHourLoad.class);
            TeacherForAssignmentPlan teacherForAssignmentPlan
                = teacherForAssignmentPlanRepo.findByTeacherIdAndPlanId(teacherMaxHourLoad.getTeacherId(), planId);
            if (teacherForAssignmentPlan != null) {
                // remove related items from TeacherClassAssignmentSolution
                List<TeacherClassAssignmentSolution> sol = teacherClassAssignmentSolutionRepo
                    .findAllByPlanIdAndTeacherId(planId, teacherForAssignmentPlan.getTeacherId());
                for (TeacherClassAssignmentSolution s : sol) {
                    log.info("removeTeacherFromAssignmentPlan, delete item in solution (" +
                             s.getClassId() +
                             " - " +
                             s.getTeacherId()
                             +
                             ") in plan " +
                             planId);
                    teacherClassAssignmentSolutionRepo.delete(s);
                }

                teacherForAssignmentPlanRepo.delete(teacherForAssignmentPlan);
                log.info("removeTeacherFromAssignmentPlan, delete (" +
                         teacherMaxHourLoad.getTeacherId() +
                         "," +
                         planId +
                         ")");
            }

        }
        return true;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    class ClassIdModel {

        String classId;
    }

    @Override
    public boolean removeClassFromAssignmentPlan(UUID planId, String classList) {
        log.info("removeClassFromAssignmentPlan");
        String[] lst = classList.split(";");
        Gson gson = new Gson();
        for (String t : lst) {
            ClassIdModel cm = gson.fromJson(t, ClassIdModel.class);
            String classId = cm.getClassId();
            ClassTeacherAssignmentClassInfo cls = classTeacherAssignmentClassInfoRepo.findById(classId).orElse(null);
            if (cls != null) {
                classTeacherAssignmentClassInfoRepo.delete(cls);
                log.info("removeClassFromAssignmentPlan, remove classId " + classId + " OK");
            }
        }
        return true;
    }

    @Override
    public List<TeacherCourse> findAllTeacherCourse() {
        List<TeacherCourse> teacherCourses = teacherCourseRepo.findAll();
        return teacherCourses;
    }

    @Override
    public List<TeacherCourseForAssignmentPlan> findTeacherCourseOfPlan(UUID planId) {
        return teacherCourseForAssignmentPlanRepo.findAllByPlanId(planId);
    }

    @Transactional
    @Override
    public boolean extractExcelAndStoreDBTeacherCourse(UUID planId, String choice, MultipartFile file) {
        try {
            InputStream inputStream = file.getInputStream();
            HSSFWorkbook wb = new HSSFWorkbook(inputStream);
            HSSFSheet sheet = wb.getSheetAt(0);
            int sz = sheet.getLastRowNum();
            List<TeacherCourse> lst = new ArrayList();
            List<EduTeacher> eduTeachers = new ArrayList();
            List<EduCourse> eduCourses = new ArrayList();
            HashMap<TeacherCourseId, TeacherCourse> mId2TeacherCourse = new HashMap();
            HashSet<String> teacherIds = new HashSet();
            HashSet<String> courseIds = new HashSet();
            for (int i = 1; i <= sz; i++) {
                Row row = sheet.getRow(i);
                Cell c = row.getCell(0);
                String courseId = c.getStringCellValue();

                c = row.getCell(1);
                String courseName = c.getStringCellValue();

                c = row.getCell(3);
                String teacherName = c.getStringCellValue();

                c = row.getCell(4);
                String teacherId = c.getStringCellValue();
                c = row.getCell(5);

                //int maxCredits = Integer.valueOf(c.getStringCellValue());

                c = row.getCell(6);
                int priority = 0;
                if (c.getCellType().equals(CellType.STRING)) {
                    //System.out.println("line i = " + i + ", column 6, str = " + c.getStringCellValue());
                    try {
                        priority = Integer.valueOf(c.getStringCellValue());
                    } catch (Exception e) {
                        System.out.println("exception priority convert str to int");
                        //e.printStackTrace();
                    }
                } else if (c.getCellType().equals(CellType.NUMERIC)) {
                    priority = (int) c.getNumericCellValue();
                }

                TeacherCourse teacherCourse = new TeacherCourse();
                teacherCourse.setCourseId(courseId);
                teacherCourse.setTeacherId(teacherId);
                teacherCourse.setPriority(priority);

                TeacherCourseId id = new TeacherCourseId(courseId, teacherId);

                if (!teacherIds.contains(teacherId)) {
                    EduTeacher eduTeacher = new EduTeacher();
                    eduTeacher.setTeacherId(teacherId);
                    eduTeacher.setTeacherName(teacherName);

                    eduTeachers.add(eduTeacher);
                    teacherIds.add(teacherId);
                }
                if (!courseIds.contains(courseId)) {
                    EduCourse eduCourse = new EduCourse();
                    eduCourse.setId(courseId);
                    eduCourse.setName(courseName);
                    eduCourse.setCredit((short) 0);
                    eduCourse.setCreatedStamp(new Date());

                    eduCourses.add(eduCourse);
                    courseIds.add(courseId);
                }

                if (mId2TeacherCourse.get(id) == null) {
                    mId2TeacherCourse.put(id, teacherCourse);
                    lst.add(teacherCourse);
                    //log.info("extractExcelAndStoreDBTeacherCourse, add new " + courseId + ", " + teacherId + ", " + priority);
                } else {
                    log.info("extractExcelAndStoreDBTeacherCourse, " + courseId + ", " + teacherId + ", " + priority +
                             " EXISTS");
                }

                //teacherCourse  = teacherCourseRepo.save(teacherCourse);
                //log.info("extractExcelAndStoreDBTeacherCourse, " + courseId + ", " + teacherId + ", " + priority);
            }
            log.info("extractExcelAndStoreDBTeacherCourse, choice = " + choice + " courses.sz = " + eduCourses.size()
                     + " teachers.sz = " + eduTeachers.size() + ", teacher-course.sz = " + lst.size());


            if (choice.equals("UPLOAD_COURSE")) {
                // check and store courses
                for (EduCourse c : eduCourses) {

                    EduCourse eduCourse = eduCourseRepo.findById(c.getId()).orElse(null);
                    if (eduCourse != null) {
                        // EXISTS, do nothing
                        log.info("extractExcelAndStoreDBTeacherCourse, course " + c.getId() + " EXISTS");
                    } else {
                        c = eduCourseRepo.save(c);
                        log.info("extractExcelAndStoreDBTeacherCourse, course " + c.getId() + " -> INSERTED");
                    }
                }
            } else if (choice.equals("UPLOAD_TEACHER")) {

                // check and store teachers
                for (EduTeacher t : eduTeachers) {
                    EduTeacher teacher = eduTeacherRepo.findById(t.getTeacherId()).orElse(null);
                    if (teacher != null) {
                        // EXISTS do nothing
                        log.info("extractExcelAndStoreDBTeacherCourse, teacher " + t.getTeacherId() + " EXISTS");
                    } else {
                        t = eduTeacherRepo.save(t);
                        log.info("extractExcelAndStoreDBTeacherCourse, teacher " + t.getTeacherId() + " INSERTED");
                    }
                }
            } else if (choice.equals("UPLOAD_TEACHER_COURSE")) {
                log.info("extractExcelAndStoreDBTeacherCourse, saveAll teacher-course");
                teacherCourseRepo.saveAll(lst);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    /**
     * Code da duoc refactor. Done
     *
     * @param im
     * @return
     */
    @Transactional
    @Override
    public boolean autoAssignTeacher2Class(RunAutoAssignTeacher2ClassInputModel im) {
        UUID planId = im.getPlanId();
        List<ClassTeacherAssignmentClassInfo> classes = classTeacherAssignmentClassInfoRepo.findAllByPlanId(planId);

        log.info("autoAssignTeacher2Class, classes.sz = " + classes.size());

        // Preprocessing
        List<EduTeacher> allTeachers = eduTeacherRepo.findAll();
        HashMap<String, EduTeacher> mId2Teacher = new HashMap<>();
        for (EduTeacher t : allTeachers) {
            mId2Teacher.put(t.getTeacherId(), t);
        }

        //// Todo: Xem xet Course4Teacher, thay bang TeacherCourseForAssignmentPlan
        HashMap<String, EduCourse> mId2Course = new HashMap<>();
        HashMap<String, List<Course4Teacher>> mTeacher2CoursesInPlan = new HashMap<>();
        List<EduCourse> allCourses = eduCourseRepo.findAll();
        List<TeacherForAssignmentPlan> teachersInPlan = teacherForAssignmentPlanRepo.findAllByPlanId(planId);
        List<TeacherCourseForAssignmentPlan> teacherCoursesInPlan = teacherCourseForAssignmentPlanRepo.findAllByPlanId(
            planId);

        for (EduCourse course : allCourses) {
            mId2Course.put(course.getId(), course);
        }

        for (TeacherCourseForAssignmentPlan tc : teacherCoursesInPlan) {
            mTeacher2CoursesInPlan.computeIfAbsent(tc.getTeacherId(), k -> new ArrayList<>()); // init

            EduCourse course = mId2Course.get(tc.getCourseId());
            if (null != course) { // Todo: reconsider this logic
                Course4Teacher c4t = new Course4Teacher(course.getId(), course.getName(), tc.getPriority(), null);
                mTeacher2CoursesInPlan.get(tc.getTeacherId()).add(c4t);
            }
        }

        // Encode data.
        AlgoClassIM[] algoClasses = new AlgoClassIM[classes.size()];
        AlgoTeacherIM[] algoTeachers = new AlgoTeacherIM[teachersInPlan.size()];

        //// TODO: reduces size of: mClassId2AlgoClass, mTeacherId2AlgoTeacher
        HashMap<String, AlgoClassIM> mClassId2AlgoClass = new HashMap<>();
        for (int i = 0; i < classes.size(); i++) {
            ClassTeacherAssignmentClassInfo clazz = classes.get(i);

            AlgoClassIM algoClass = new AlgoClassIM(
                clazz.getClassId(),
                clazz.getClassType(),
                clazz.getCourseId(),
                clazz.getCourseId(), // ClassTeacherAssignmentClassInfo khong co thong tin courseName
                clazz.getLesson(),
                clazz.getHourLoad());// TOBE UPGRADED

            mClassId2AlgoClass.put(clazz.getClassId(), algoClass);
            algoClasses[i] = algoClass;
        }

        HashMap<String, AlgoTeacherIM> mTeacherId2AlgoTeacher = new HashMap<>();
        for (int i = 0; i < teachersInPlan.size(); i++) {
            TeacherForAssignmentPlan t = teachersInPlan.get(i);
            EduTeacher teacher = mId2Teacher.get(t.getTeacherId());

            AlgoTeacherIM algoTeacher = new AlgoTeacherIM(
                t.getTeacherId(),
                teacher.getTeacherName(),
                mTeacher2CoursesInPlan.get(t.getTeacherId()),
                t.getMaxHourLoad(),// TOBE UPGRADED, tai sao lai dung maxHourLoad?
                "Y".equalsIgnoreCase(t.getMinimizeNumberWorkingDays()));

            mTeacherId2AlgoTeacher.put(t.getTeacherId(), algoTeacher);
            algoTeachers[i] = algoTeacher;
        }

        //// Load existing solution/assignment
        List<TeacherClassAssignmentSolution> preAssignedSolutions = teacherClassAssignmentSolutionRepo.findAllByPlanId(
            planId);
        TeacherClassAssignmentModel[] preAssignments = new TeacherClassAssignmentModel[preAssignedSolutions.size()];

        for (int i = 0; i < preAssignedSolutions.size(); i++) {
            TeacherClassAssignmentSolution solution = preAssignedSolutions.get(i);
            AlgoClassIM algoClass = mClassId2AlgoClass.get(solution.getClassId());
            AlgoTeacherIM algoTeacher = mTeacherId2AlgoTeacher.get(solution.getTeacherId());

            preAssignments[i] = new TeacherClassAssignmentModel(algoClass, algoTeacher);
        }

        AlgoTeacherAssignmentIM input = new AlgoTeacherAssignmentIM(
            algoTeachers,
            algoClasses,
            preAssignments,
            im.getSolver());

        // Testing and debugging only: save input json to file
//        Gson gson = new Gson();
//        String jsonInput = gson.toJson(input);
//        try {
//            PrintWriter out = new PrintWriter("teachingAssignment.json");
//            out.write(jsonInput);
//            out.close();
//        } catch (Exception e) {
//            e.printStackTrace();
//        }

        // Solve
        TeacherClassAssignmentOM solution = teacherClassAssignmentAlgoService.computeTeacherClassAssignment(input);
        if (null == solution) {
            return false;
        }

        // Post-processing
        //// Remove all existing solution items of planId
        teacherClassAssignmentSolutionRepo.deleteAllByPlanId(planId);

        //// Store solution to DB
        log.info("autoAssignTeacher2Class, START storing solution to DB");

        TeacherClassAssignmentModel[] assignments = solution.getAssignments();
        for (int i = 0; i < assignments.length; i++) {
            TeacherClassAssignmentModel assignment = assignments[i];

            if (null == assignment) {
                log.info("autoAssignTeacher2Class, found assignment " + i + " NULL, class is not assigned");
                continue;
            }

            if (null == assignment.getAlgoClassIM()) {
                log.info("autoAssignTeacher2Class, found assignment " + i + " with class NULL");
                continue;
            }

            log.info("autoAssignTeacher2Class, assign class "
                     + assignment.getAlgoClassIM().getClassId()
                     + " (algoClassId = "
                     + assignment.getAlgoClassIM().getId()
                     + ") of course "
                     + assignment.getAlgoClassIM().getCourseId()
                     + " to teacher " + assignment.getAlgoTeacherIM().getId());

            TeacherClassAssignmentSolution item = new TeacherClassAssignmentSolution();
            item.setClassId(assignment.getAlgoClassIM().getClassId());
            item.setTeacherId(assignment.getAlgoTeacherIM().getId());
            item.setPlanId(planId);
            item.setCreatedStamp(new Date());

            teacherClassAssignmentSolutionRepo.save(item);

//            log.info("autoAssignTeacher2Class, save solution " + item.getClassId() + " --> " + item.getTeacherId());
        }

        // TODO: why return false?
        return false;
    }

    @Override
    public List<ClassTeacherAssignmentSolutionModel> getNotAssignedClassSolution(UUID planId) {
        List<EduCourse> eduCourses = eduCourseRepo.findAll();

        HashMap<String, EduCourse> mID2Course = new HashMap();
        for (EduCourse c : eduCourses) {
            mID2Course.put(c.getId(), c);
        }

        List<ClassTeacherAssignmentClassInfo> allClasses =
            classTeacherAssignmentClassInfoRepo.findAllByPlanId(planId);
        List<TeacherClassAssignmentSolution> teacherClassAssignmentSolutions =
            teacherClassAssignmentSolutionRepo.findAllByPlanId(planId);
        HashSet<String> assignedClassIds = new HashSet();
        for (TeacherClassAssignmentSolution s : teacherClassAssignmentSolutions) {
            assignedClassIds.add(s.getClassId());
        }

        List<ClassTeacherAssignmentSolutionModel> notAssignedClass = new ArrayList();
        for (ClassTeacherAssignmentClassInfo c : allClasses) {
            if (!assignedClassIds.contains(c.getClassId())) {
                ClassTeacherAssignmentSolutionModel ns = new ClassTeacherAssignmentSolutionModel();
                ns.setClassCode(c.getClassId());
                ns.setCourseId(c.getCourseId());
                ns.setTimetable(c.getLesson());
                EduCourse course = mID2Course.get(c.getCourseId());
                if (course != null) {
                    ns.setCourseName(course.getName());
                } else {
                    log.info("getNotAssignedClassSolution, courseId = " + c.getCourseId()
                             + " has not name???");
                }
                notAssignedClass.add(ns);
            }
        }

        return notAssignedClass;
    }

    @Override
    public List<SuggestedTeacherForClass> getSuggestedTeacherForClass(String classId, UUID planId) {
        List<ClassTeacherAssignmentClassInfo> cls = classTeacherAssignmentClassInfoRepo.findByClassId(classId);
        String courseId = null;
        double hourLoad = 0;
        String timetable = "";
        List<TeacherForAssignmentPlan> teachersInPlan = teacherForAssignmentPlanRepo.findAllByPlanId(planId);

        for (ClassTeacherAssignmentClassInfo cti : cls) {
            courseId = cti.getCourseId();
            hourLoad = cti.getHourLoad();
            timetable = cti.getLesson();
            break;
        }
        List<SuggestedTeacherForClass> lst = new ArrayList<SuggestedTeacherForClass>();

        log.info("getSuggestedTeacherForClass, courseId = " + courseId + ", planId = " + planId);
        // TOBE improved
        //List<TeacherCourse> teacherCourses = teacherCourseRepo.findAll();
        List<TeacherCourseForAssignmentPlan> teacherCourses = teacherCourseForAssignmentPlanRepo.findAllByPlanId(planId);// consider only item in the plan

        //for (TeacherCourse tc : teacherCourses) {
        for (TeacherCourseForAssignmentPlan tc : teacherCourses) {
            if (tc.getCourseId().equals(courseId)) {
                SuggestedTeacherForClass t = new SuggestedTeacherForClass();
                t.setTeacherId(tc.getTeacherId());
                t.setTeacherName(tc.getTeacherId());
                //t.setHourLoad(0.0);// TOBE upgrade

                String info = tc.getTeacherId() + ": ";

                // get list of classes assigned to teacherId for more detail about suggestion
                List<TeacherClassAssignmentSolution> teacherClassAssignmentSolutions =
                    teacherClassAssignmentSolutionRepo.findAllByPlanIdAndTeacherId(planId, tc.getTeacherId());

                double hourLoadOfTeacher = 0;

                for (TeacherClassAssignmentSolution tcs : teacherClassAssignmentSolutions) {
                    List<ClassTeacherAssignmentClassInfo> ctai = classTeacherAssignmentClassInfoRepo.findByClassId(tcs.getClassId());
                    ClassTeacherAssignmentClassInfo c = null;
                    if (ctai != null && ctai.size() > 0) {
                        c = ctai.get(0);
                    } else {
                        continue;
                    }
                    hourLoadOfTeacher += c.getHourLoad();
                    boolean conflict = TimetableConflictChecker.conflict(c.getLesson(), timetable);
                    if (conflict) {
                        info = info + " [Conflict: Class " + c.getClassId() + ", TimeTable " + c.getLesson() + "] ";
                    }
                }
                info = info + " hour = " + hourLoadOfTeacher;
                t.setInfo(info);
                lst.add(t);
            }
        }


        return lst;
    }

    private boolean checkCanAssign(
        ClassTeacherAssignmentClassInfo selectedClass,
        ClassTeacherAssignmentClassInfo c, TeacherCourseForAssignmentPlan t,
        HashMap<String, List<TeacherClassAssignmentSolution>> mTeacherToAssignedClass,
        HashMap<String, ClassTeacherAssignmentClassInfo> mClassIdToClassInfo,
        HashMap<String, TeacherClassAssignmentSolution> mClassIdToAssignedTeacher
    ) {
        String t1 = mClassIdToAssignedTeacher.get(selectedClass.getClassId()).getTeacherId();
        /*
            t1: current teacher assigned to the selectedClass
            selectedClass and c conflicting classes
            CHECK if the selectedClass can be removed from t1, and assigned to teacher tc (of c)
                                        then c is removed from tc and reassigned to teacher t
         */


        List<TeacherClassAssignmentSolution> cls = mTeacherToAssignedClass.get(t.getTeacherId());
        if (cls != null) {
            for (TeacherClassAssignmentSolution s : cls) {
                ClassTeacherAssignmentClassInfo ci = mClassIdToClassInfo.get(s.getClassId());
                if (ci == selectedClass) {
                    // IGNORE
                    // This case: t is equal t1 which is the current teacher assign to selectedClass
                    // selectedClass will be removed from t1 (which is t), thus ci will no longer to be in t-> no need to check conflict
                } else {
                    if (TimetableConflictChecker.conflictMultiTimeTable(ci.getLesson(), c.getLesson())) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    @Override
    public List<SuggestedTeacherAndActionForClass> getSuggestedTeacherAndActionForClass(String classId, UUID planId) {
        List<ClassTeacherAssignmentClassInfo> cls = classTeacherAssignmentClassInfoRepo.findByClassId(classId);

        String courseId = null;
        double hourLoad = 0;
        String timetable = "";
        ClassTeacherAssignmentClassInfo selectedClass = null;
        for (ClassTeacherAssignmentClassInfo cti : cls) {
            courseId = cti.getCourseId();
            hourLoad = cti.getHourLoad();
            timetable = cti.getLesson();
            selectedClass = cti;
            break;
        }
        List<TeacherForAssignmentPlan> teachersInPlan = teacherForAssignmentPlanRepo.findAllByPlanId(planId);
        HashSet<String> teacherIdsInPlan = new HashSet<String>();
        for (TeacherForAssignmentPlan t : teachersInPlan) {
            teacherIdsInPlan.add(t.getTeacherId());
        }

        List<ClassTeacherAssignmentClassInfo> listClass = classTeacherAssignmentClassInfoRepo.findAllByPlanId(planId);
        HashMap<String, ClassTeacherAssignmentClassInfo> mClassIdToClassInfo = new HashMap();
        for (ClassTeacherAssignmentClassInfo c : listClass) {
            mClassIdToClassInfo.put(c.getClassId(), c);
        }

        List<SuggestedTeacherAndActionForClass> lst = new ArrayList();

        log.info("getSuggestedTeacherAndActionForClass, courseId = " + courseId + ", planId = " + planId);
        // TOBE improved
        //List<TeacherCourse> teacherCourses = teacherCourseRepo.findAll();
        List<TeacherCourseForAssignmentPlan> teacherCourses = teacherCourseForAssignmentPlanRepo.findAllByPlanId(planId);// consider only item in the plan

        List<TeacherClassAssignmentSolution> teacherClassAssignmentSolutions =
            teacherClassAssignmentSolutionRepo.findAllByPlanId(planId);
        HashMap<String, List<TeacherClassAssignmentSolution>> mTeacherToAssignedClass = new HashMap();
        HashMap<String, TeacherClassAssignmentSolution> mClassIdToAssignedTeacher = new HashMap();
        for (TeacherClassAssignmentSolution s : teacherClassAssignmentSolutions) {
            if (mTeacherToAssignedClass.get(s.getTeacherId()) == null) {
                mTeacherToAssignedClass.put(s.getTeacherId(), new ArrayList());
            }
            mTeacherToAssignedClass.get(s.getTeacherId()).add(s);

            mClassIdToAssignedTeacher.put(s.getClassId(), s);
        }
        String assignedTeacherId = mClassIdToAssignedTeacher.get(selectedClass.getClassId()).getTeacherId();

        // explore possibilities for new teachers
        for (TeacherCourseForAssignmentPlan tc : teacherCourses) {
            //if (tc.getCourseId().equals(courseId))
            //    log.info("getSuggestedTeacherAndActionForClass, consider teacher " + tc.getTeacherId() + " for course " +
            //             courseId + " for class " + classId + " InPlan = " + teacherIdsInPlan.contains(tc.getTeacherId()));

            if (tc.getCourseId().equals(courseId) && !tc.getTeacherId().equals(assignedTeacherId)
                && teacherIdsInPlan.contains(tc.getTeacherId())) {

                log.info("getSuggestedTeacherAndActionForClass, consider teacher " +
                         tc.getTeacherId() +
                         " for class " +
                         classId);

                List<TeacherClassAssignmentSolution> L = mTeacherToAssignedClass.get(tc.getTeacherId());
                List<ClassTeacherAssignmentClassInfo> listConflictClass = new ArrayList();
                if (L != null) {
                    log.info("getSuggestedTeacherAndActionForClass, consider teacher " + tc.getTeacherId()
                             + " HAS " + L.size());
                    for (TeacherClassAssignmentSolution s : L) {
                        ClassTeacherAssignmentClassInfo ci = mClassIdToClassInfo.get(s.getClassId());
                        //if (true) {// FOR TESTING
                        if (TimetableConflictChecker.conflictMultiTimeTable(
                            selectedClass.getLesson(),
                            ci.getLesson())) {
                            listConflictClass.add(ci);

                            log.info("getSuggestedTeacherAndActionForClass, consider teacher " +
                                     tc.getTeacherId() +
                                     " for class "
                                     +
                                     classId +
                                     " FOUND conflict class " +
                                     ci.getClassId() +
                                     " timetable " +
                                     ci.getLesson());
                        }
                    }
                }

                boolean okTeacher = true;
                // find other teachers for each conflicting class in listConflictClass with selectedClass
                HashMap<String, List> mClassIdToNewTeacher = new HashMap();
                for (ClassTeacherAssignmentClassInfo c : listConflictClass) {
                    // consider a conflicting class c, try to find other teachers for this class

                    for (TeacherCourseForAssignmentPlan tci : teacherCourses) {
                        if (!tci.getTeacherId().equals(tc.getTeacherId())
                            && c.getCourseId().equals(tci.getCourseId())
                            && teacherIdsInPlan.contains(tci.getTeacherId())
                        ) {
                            if (checkCanAssign(selectedClass,
                                               c, tci,
                                               mTeacherToAssignedClass,
                                               mClassIdToClassInfo,
                                               mClassIdToAssignedTeacher)) {
                                if (mClassIdToNewTeacher.get(c.getClassId()) == null) {
                                    mClassIdToNewTeacher.put(c.getClassId(), new ArrayList());
                                }
                                mClassIdToNewTeacher.get(c.getClassId()).add(tci);
                            }
                        }
                        /*
                        if(!tci.getTeacherId().equals(assignedTeacherId)
                           && ! tci.getTeacherId().equals(tc.getTeacherId())
                        && c.getCourseId().equals(tci.getCourseId())
                        && teacherIdsInPlan.contains(tci.getTeacherId())
                        ){
                            boolean ok = true;
                            List<TeacherClassAssignmentSolution> Li = mTeacherToAssignedClass.get(tci.getTeacherId());
                            if(Li != null)
                                for(TeacherClassAssignmentSolution si: Li){
                                ClassTeacherAssignmentClassInfo ci = mClassIdToClassInfo.get(si.getClassId());
                                if(TimetableConflictChecker.conflictMultiTimeTable(ci.getLesson(),c.getLesson())){
                                    ok = false; break;
                                }
                            }
                            if(ok){
                                if(mClassIdToNewTeacher.get(c.getClassId())== null){
                                    mClassIdToNewTeacher.put(c.getClassId(), new ArrayList());
                                }
                                mClassIdToNewTeacher.get(c.getClassId()).add(tci);
                            }
                        }
                        */
                    }
                    if (mClassIdToNewTeacher.get(c.getClassId()) == null) {
                        okTeacher = false;
                        //break;
                    }
                }

                if (okTeacher) {
                    //if(true){
                    SuggestedTeacherAndActionForClass t = new SuggestedTeacherAndActionForClass();
                    t.setTeacherId(tc.getTeacherId());
                    t.setTeacherName(tc.getTeacherId());
                    //t.setHourLoad(0.0);// TOBE upgrade

                    String info = tc.getTeacherId() + ": ";
                    List<ClassToListTeacher> moveClass = new ArrayList();
                    for (ClassTeacherAssignmentClassInfo c : listConflictClass) {
                        List<TeacherCourseForAssignmentPlan> Lc = mClassIdToNewTeacher.get(c.getClassId());
                        List<TeacherCandidate> teachers = new ArrayList();
                        String inforNewTeachers = "";
                        if (Lc != null) {
                            for (TeacherCourseForAssignmentPlan tci : Lc) {
                                TeacherCandidate o =
                                    new TeacherCandidate();
                                o.setTeacherId(tci.getTeacherId());
                                teachers.add(o);
                                inforNewTeachers += tci.getTeacherId() + "; ";
                            }
                        } else {
                            log.info("getSuggestedTeacherAndActionForClass, class " +
                                     c.getClassId() +
                                     " DOES NOT has new teachers");
                        }
                        ClassToListTeacher o = new ClassToListTeacher();
                        o.setClassCode(c.getClassId());
                        o.setTeachers(teachers);
                        o.setInfoNewTeachers(inforNewTeachers);
                        moveClass.add(o);
                    }
                    t.setMoveClass(moveClass);

                    lst.add(t);
                }
            }
        }


        return lst;
    }

    @Override
    public List<ClassesAssignedToATeacherModel> getClassesAssignedToATeacherSolutionDuplicateWhenMultipleFragmentTimeTable(
        UUID planId
    ) {
        List<ClassesAssignedToATeacherModel> lst = new ArrayList();
        List<EduTeacher> teachers = eduTeacherRepo.findAll();
        List<TeacherForAssignmentPlan> teachersInPlan = teacherForAssignmentPlanRepo.findAllByPlanId(planId);
        HashMap<String, EduTeacher> mId2Teacher = new HashMap();
        for (EduTeacher t : teachers) {
            mId2Teacher.put(t.getTeacherId(), t);
        }
        HashSet<String> teacherHasClasses = new HashSet<String>();
        HashMap<String, List> mTeacherId2Classes = new HashMap();
        List<ClassTeacherAssignmentSolutionModel> sol = getClassTeacherAssignmentSolution(planId);
        for (ClassTeacherAssignmentSolutionModel s : sol) {
            if (mTeacherId2Classes.get(s.getTeacherId()) == null) {
                mTeacherId2Classes.put(s.getTeacherId(), new ArrayList());
            }
            teacherHasClasses.add(s.getTeacherId());
            // if the class s has two or more fragments, then duplicate multiple fragments
            if (s.checkMultipleFragments()) {
                ClassTeacherAssignmentSolutionModel[] ss = s.checkMultipleFragmentsAndDuplicate();
                log.info("getClassesAssignedToATeacherSolutionDuplicateWhenMultipleFragmentTimeTable, class " +
                         s.getClassCode()
                         +
                         " has multiple timetable ss.length = " +
                         ss.length);
                if (ss != null) {
                    for (int i = 0; i < ss.length; i++) {
                        mTeacherId2Classes.get(s.getTeacherId()).add(ss[i]);
                        log.info("getClassesAssignedToATeacherSolutionDuplicateWhenMultipleFragmentTimeTable, class " +
                                 s.getClassCode()
                                 +
                                 " has multiple timetable ss.length = " +
                                 ss.length +
                                 " ADD fragment " +
                                 ss[i].getTimetable());
                    }
                }
            } else {
                log.info("getClassesAssignedToATeacherSolutionDuplicateWhenMultipleFragmentTimeTable, class " +
                         s.getClassCode()
                         +
                         " has ONLY ONE timetable");

                mTeacherId2Classes.get(s.getTeacherId()).add(s);
            }
        }
        for (TeacherForAssignmentPlan t : teachersInPlan) {
            log.info("getClassesAssignedToATeacherSolutionDuplicateWhenMultipleFragmentTimeTable, consider teacher " +
                     t.getTeacherId());
            if (!teacherHasClasses.contains(t.getTeacherId())) {
                log.info("getClassesAssignedToATeacherSolutionDuplicateWhenMultipleFragmentTimeTable, consider teacher " +
                         t.getTeacherId()
                         +
                         " DOES NOT have classes assigned");

                mTeacherId2Classes.put(t.getTeacherId(), new ArrayList());
            }
        }
        for (String teacherId : mTeacherId2Classes.keySet()) {
            ClassesAssignedToATeacherModel c = new ClassesAssignedToATeacherModel();
            c.setTeacherId(teacherId);
            String teacherName = "";
            if (mId2Teacher.get(teacherId) != null) {
                teacherName = mId2Teacher.get(teacherId).getTeacherName();
            }
            c.setTeacherName(teacherName);

            c.setClassList(mTeacherId2Classes.get(teacherId));
            c.setNumberOfClass(c.getClassList().size());
            double hourLoad = 0;
            for (ClassTeacherAssignmentSolutionModel i : c.getClassList()) {
                hourLoad += i.getHourLoad();
            }
            c.setHourLoad(hourLoad);

            //if(c.getClassList().size() == 0) continue;

            if (c.getClassList().size() > 0) {
                // sort classes assigned to current teacher in an increasing order of time-table
                ClassTeacherAssignmentSolutionModel[] arr = new ClassTeacherAssignmentSolutionModel[c
                    .getClassList()
                    .size()];
                for (int i = 0; i < arr.length; i++) {
                    arr[i] = c.getClassList().get(i);
                    TimeTableStartAndDuration ttsd = TimetableConflictChecker.extractFromString(arr[i].getTimetable());
                    if (ttsd == null) {
                        log.info("getSuggestedTeacherAndActionForClass, TimeTableStartAndDuration NULL for "
                                 +
                                 arr[i].getTimetable() +
                                 " class " +
                                 arr[i].getClassCode() +
                                 ", " +
                                 arr[i].getCourseName() +
                                 " courseId = " +
                                 arr[i].getCourseId());
                        arr[i].setStartSlot(0);
                        arr[i].setEndSlot(0);
                        arr[i].setDuration(0);
                    } else {
                        arr[i].setStartSlot(ttsd.getStartSlot());
                        arr[i].setEndSlot(ttsd.getEndSlot());
                        arr[i].setDuration(ttsd.getDuration());
                    }
                }
                for (int i = 0; i < arr.length; i++) {
                    for (int j = i + 1; j < arr.length; j++) {
                        if (arr[i].getStartSlot() > arr[j].getStartSlot()) {
                            ClassTeacherAssignmentSolutionModel tmp = arr[i];
                            arr[i] = arr[j];
                            arr[j] = tmp;
                        }
                    }
                }
                int previousSlot = arr[0].getStartSlot() - 1;
                arr[0].setStartIndexFromPrevious(previousSlot);
                for (int i = 1; i < arr.length; i++) {
                    arr[i].setStartIndexFromPrevious(arr[i].getStartSlot() - arr[i - 1].getEndSlot() - 1);
                }
                c.getClassList().clear();
                for (int i = 0; i < arr.length; i++) {
                    c.getClassList().add(arr[i]);
                }
                c.setRemainEmptySlots(72 - arr[arr.length - 1].getEndSlot());

            }
            if (c.getClassList().size() > 0) {
                lst.add(c);
            }
        }


        return lst;
    }

    @Override
    public TeacherClassAssignmentSolution assignTeacherToClass(UserLogin u, AssignTeacherToClassInputModel input) {
        TeacherClassAssignmentSolution teacherClassAssignmentSolution = new TeacherClassAssignmentSolution();
        teacherClassAssignmentSolution.setTeacherId(input.getTeacherId());
        teacherClassAssignmentSolution.setClassId(input.getClassId());
        teacherClassAssignmentSolution.setPlanId(input.getPlanId());
        teacherClassAssignmentSolution.setCreatedByUserLoginId(u.getUserLoginId());
        teacherClassAssignmentSolution.setCreatedStamp(new Date());

        teacherClassAssignmentSolution = teacherClassAssignmentSolutionRepo.save(teacherClassAssignmentSolution);

        return teacherClassAssignmentSolution;
    }

    @Override
    public TeacherClassAssignmentSolution reAssignTeacherToClass(UserLogin u, AssignTeacherToClassInputModel input) {
        List<TeacherClassAssignmentSolution> L = teacherClassAssignmentSolutionRepo
            .findAllByPlanIdAndClassId(input.getPlanId(), input.getClassId());
        for (TeacherClassAssignmentSolution s : L) {
            // remove class s.getClassId() from current solution
            log.info("reAssignTeacherToClass, REMOVE assignment (" +
                     s.getClassId() +
                     " - " +
                     s.getTeacherId() +
                     ") in plan " +
                     s.getPlanId());
            teacherClassAssignmentSolutionRepo.delete(s);
        }

        TeacherClassAssignmentSolution teacherClassAssignmentSolution = new TeacherClassAssignmentSolution();
        teacherClassAssignmentSolution.setTeacherId(input.getTeacherId());
        teacherClassAssignmentSolution.setClassId(input.getClassId());
        teacherClassAssignmentSolution.setPlanId(input.getPlanId());
        teacherClassAssignmentSolution.setCreatedByUserLoginId(u.getUserLoginId());
        teacherClassAssignmentSolution.setCreatedStamp(new Date());

        teacherClassAssignmentSolution = teacherClassAssignmentSolutionRepo.save(teacherClassAssignmentSolution);

        log.info("reAssignTeacherToClass, ADD and SAVE assignemnt (" + input.getClassId() + " - " + input.getTeacherId()
                 + ") in plan " + input.getPlanId());
        return teacherClassAssignmentSolution;
    }

    @Override
    public boolean removeClassTeacherAssignmentSolution(
        UserLogin u,
        RemoveClassTeacherAssignmentSolutionInputModel input
    ) {
        TeacherClassAssignmentSolution teacherClassAssignmentSolution
            = teacherClassAssignmentSolutionRepo.findById(input.getSolutionItemId()).orElse(null);
        if (teacherClassAssignmentSolution == null) {
            return false;
        } else {
            teacherClassAssignmentSolutionRepo.delete(teacherClassAssignmentSolution);
        }
        return true;
    }

    @Override
    public boolean removeClassTeacherAssignmentSolutionList(UUID planId, String solutionItemList) {
        String[] lst = solutionItemList.split(";");
        Gson gson = new Gson();
        for (String t : lst) {
            RemoveClassTeacherAssignmentSolutionInputModel cm = gson.fromJson(
                t,
                RemoveClassTeacherAssignmentSolutionInputModel.class);
            TeacherClassAssignmentSolution s = teacherClassAssignmentSolutionRepo
                .findById(cm.getSolutionItemId())
                .orElse(null);
            if (s != null) {
                teacherClassAssignmentSolutionRepo.delete(s);
                log.info("removeClassTeacherAssignmentSolutionList, delete " + s.getSolutionItemId());
            }
        }
        return true;
    }

    @Override
    public List<ClassesAssignedToATeacherModel> getClassesAssignedToATeacherSolution(UUID planId) {
        List<ClassesAssignedToATeacherModel> lst = new ArrayList();
        List<EduTeacher> teachers = eduTeacherRepo.findAll();
        HashMap<String, EduTeacher> mId2Teacher = new HashMap();
        for (EduTeacher t : teachers) {
            mId2Teacher.put(t.getTeacherId(), t);
        }

        HashMap<String, List> mTeacherId2Classes = new HashMap();
        List<ClassTeacherAssignmentSolutionModel> sol = getClassTeacherAssignmentSolution(planId);
        for (ClassTeacherAssignmentSolutionModel s : sol) {
            if (mTeacherId2Classes.get(s.getTeacherId()) == null) {
                mTeacherId2Classes.put(s.getTeacherId(), new ArrayList());
            }
            mTeacherId2Classes.get(s.getTeacherId()).add(s);
        }
        for (String teacherId : mTeacherId2Classes.keySet()) {
            ClassesAssignedToATeacherModel c = new ClassesAssignedToATeacherModel();
            c.setTeacherId(teacherId);
            String teacherName = "";
            if (mId2Teacher.get(teacherId) != null) {
                teacherName = mId2Teacher.get(teacherId).getTeacherName();
            }
            c.setTeacherName(teacherName);

            c.setClassList(mTeacherId2Classes.get(teacherId));
            c.setNumberOfClass(c.getClassList().size());
            double hourLoad = 0;
            HashSet<Integer> D = new HashSet<Integer>();
            for (ClassTeacherAssignmentSolutionModel i : c.getClassList()) {
                hourLoad += i.getHourLoad();
                HashSet<Integer> Di = TimetableConflictChecker.extractDayOfTimeTable(i.getTimetable());
                for (int d : Di) {
                    D.add(d);
                }
            }
            c.setHourLoad(hourLoad);
            c.setNumberOfWorkingDays(D.size());

            lst.add(c);
        }
        return lst;
    }

    @Override
    public List<ClassTeacherAssignmentSolutionModel> getClassTeacherAssignmentSolution(UUID planId) {
        List<TeacherClassAssignmentSolution> teacherClassAssignmentSolutions =
            teacherClassAssignmentSolutionRepo.findAllByPlanId(planId);
        List<ClassTeacherAssignmentSolutionModel> m = new ArrayList();
        List<EduCourse> eduCourses = eduCourseRepo.findAll();
        List<EduTeacher> eduTeachers = eduTeacherRepo.findAll();
        List<ClassTeacherAssignmentClassInfo> classTeacherAssignmentClassInfos = classTeacherAssignmentClassInfoRepo.findAllByPlanId(
            planId);

        HashMap<String, EduCourse> mID2Course = new HashMap();
        HashMap<String, EduTeacher> mID2Teacher = new HashMap();
        HashMap<String, ClassTeacherAssignmentClassInfo> mClass2Info = new HashMap();
        for (ClassTeacherAssignmentClassInfo i : classTeacherAssignmentClassInfos) {
            mClass2Info.put(i.getClassId(), i);
        }
        for (EduCourse c : eduCourses) {
            mID2Course.put(c.getId(), c);
        }
        for (EduTeacher t : eduTeachers) {
            mID2Teacher.put(t.getTeacherId(), t);
        }
        List<ClassTeacherAssignmentSolutionModel> classTeacherAssignmentSolutionModels = new ArrayList<>();
        for (TeacherClassAssignmentSolution s : teacherClassAssignmentSolutions) {
            String classId = s.getClassId();
            ClassTeacherAssignmentClassInfo info = mClass2Info.get(classId);
            if (info == null) {
                continue;
            }
            ClassTeacherAssignmentSolutionModel classTeacherAssignmentSolutionModel = new ClassTeacherAssignmentSolutionModel();

            classTeacherAssignmentSolutionModel.setSolutionItemId(s.getSolutionItemId());
            classTeacherAssignmentSolutionModel.setClassCode(s.getClassId());
            classTeacherAssignmentSolutionModel.setCourseId(info.getCourseId());
            EduCourse course = mID2Course.get(info.getCourseId());
            if (course == null) {
                log.info("getClassTeacherAssignmentSolution, courseId " + info.getCourseId() + " null");
            } else {
                classTeacherAssignmentSolutionModel.setCourseName(course.getName());
            }
            classTeacherAssignmentSolutionModel.setTeacherId(s.getTeacherId());
            EduTeacher teacher = mID2Teacher.get(s.getTeacherId());
            classTeacherAssignmentSolutionModel.setTeacherName(teacher.getTeacherName());
            classTeacherAssignmentSolutionModel.setTimetable(info.getLesson());
            classTeacherAssignmentSolutionModel.setHourLoad(info.getHourLoad());

            classTeacherAssignmentSolutionModels.add(classTeacherAssignmentSolutionModel);
        }
        return classTeacherAssignmentSolutionModels;
    }

    @Transactional
    @Override
    public boolean addTeacherCourseToAssignmentPlan(UUID planId, String teacherCourseList) {
        String[] lst = teacherCourseList.split(";");
        log.info("addTeacherCourseToAssignmentPlan, planId = " + planId + ", teacherCourseList = " + teacherCourseList);
        Gson gson = new Gson();
        if (lst != null && lst.length > 0) {
            for (int i = 0; i < lst.length; i++) {
                TeacherCoursePriority tcp = gson.fromJson(lst[i], TeacherCoursePriority.class);
                TeacherCourseForAssignmentPlan teacherCourseForAssignmentPlan = new TeacherCourseForAssignmentPlan();
                teacherCourseForAssignmentPlan.setCourseId(tcp.getCourseId());
                teacherCourseForAssignmentPlan.setTeacherId(tcp.getTeacherId());
                teacherCourseForAssignmentPlan.setPriority(tcp.getPriority());
                teacherCourseForAssignmentPlan.setPlanId(planId);

                teacherCourseForAssignmentPlan = teacherCourseForAssignmentPlanRepo
                    .save(teacherCourseForAssignmentPlan);
            }
        }
        return true;
    }

    @Transactional
    @Override
    public boolean removeTeacherCourseFromAssignmentPlan(UUID planId, String teacherCourseList) {
        String[] lst = teacherCourseList.split(";");
        log.info("removeTeacherCourseFromAssignmentPlan, planId = " +
                 planId +
                 ", teacherCourseList = " +
                 teacherCourseList);
        Gson gson = new Gson();
        if (lst != null && lst.length > 0) {
            List<ClassTeacherAssignmentClassInfo> classTeacherAssignmentClassInfos = classTeacherAssignmentClassInfoRepo
                .findAllByPlanId(planId);
            HashMap<String, ClassTeacherAssignmentClassInfo> mClassId2ClassTeacherAssignmentInfo = new HashMap();
            for (ClassTeacherAssignmentClassInfo c : classTeacherAssignmentClassInfos) {
                mClassId2ClassTeacherAssignmentInfo.put(c.getClassId(), c);
            }

            for (int i = 0; i < lst.length; i++) {
                TeacherCoursePriority tcp = gson.fromJson(lst[i], TeacherCoursePriority.class);
                TeacherCourseForAssignmentPlan teacherCourseForAssignmentPlan
                    = teacherCourseForAssignmentPlanRepo.findByTeacherIdAndCourseIdAndPlanId(
                    tcp.getTeacherId(),
                    tcp.getCourseId(),
                    planId);

                // remove related items in solution
                List<TeacherClassAssignmentSolution> sol = teacherClassAssignmentSolutionRepo
                    .findAllByPlanIdAndTeacherId(planId, tcp.getTeacherId());
                for (TeacherClassAssignmentSolution s : sol) {
                    String classId = s.getClassId();
                    ClassTeacherAssignmentClassInfo c = mClassId2ClassTeacherAssignmentInfo.get(classId);
                    if (c != null) {
                        if (c.getCourseId().equals(tcp.getCourseId())) {
                            // remove s (solution for classId with tcp.getCourseId())
                            teacherClassAssignmentSolutionRepo.delete(s);
                            log.info("removeTeacherCourseFromAssignmentPlan, remove assignment(" +
                                     classId +
                                     "[" +
                                     c.getCourseId()
                                     +
                                     "] - " +
                                     tcp.getTeacherId() +
                                     ") in plan " +
                                     planId);
                        }
                    }
                }

                if (teacherCourseForAssignmentPlan != null) {
                    teacherCourseForAssignmentPlanRepo
                        .delete(teacherCourseForAssignmentPlan);
                    log.info("removeTeacherCourseFromAssignmentPlan, remove (" +
                             tcp.getTeacherId() +
                             "," +
                             tcp.getCourseId() +
                             "," +
                             planId +
                             ")");

                }
            }
        }
        return true;
    }

    @Override
    public List<PairOfConflictTimetableClassModel> getPairOfConflictTimetableClass(UUID planId) {
        List<ClassTeacherAssignmentClassInfo> classes =
            classTeacherAssignmentClassInfoRepo.findAllByPlanId(planId);

        AlgoClassIM[] inputClass = new AlgoClassIM[classes.size()];

        for (int i = 0; i < classes.size(); i++) {
            ClassTeacherAssignmentClassInfo c = classes.get(i);
            AlgoClassIM ci = new AlgoClassIM();
            ci.setClassId(c.getClassId());
            ci.setTimetable(c.getLesson());
            ci.setClassType(c.getClassType());
            ci.setCourseId(c.getCourseId());
            ci.setCourseName(c.getCourseId());
            ci.setHourLoad(1);// TOBE UPGRADED
            inputClass[i] = ci;
        }
        CheckConflict checker = new CheckConflict();

        List<PairOfConflictTimetableClassModel> lst = new ArrayList<>();
        for (int i = 0; i < inputClass.length; i++) {
            for (int j = i + 1; j < inputClass.length; j++) {
                //if(checker.isConflict(inputClass[i],inputClass[j])){
                ClassTeacherAssignmentClassInfo ci = classes.get(i);
                ClassTeacherAssignmentClassInfo cj = classes.get(j);
                if (TimetableConflictChecker.conflict(ci.getLesson(), cj.getLesson())) {
                    PairOfConflictTimetableClassModel p = new PairOfConflictTimetableClassModel();
                    p.setClassId1(ci.getClassId());
                    p.setCourseId1(ci.getCourseId());
                    p.setTimetable1(ci.getTimeTable());
                    p.setTimetableCode1(ci.getLesson());

                    p.setClassId2(cj.getClassId());
                    p.setCourseId2(cj.getCourseId());
                    p.setTimetable2(cj.getTimeTable());
                    p.setTimetableCode2(cj.getLesson());

                    lst.add(p);
                }
            }
        }

        return lst;
    }

    @Override
    public ClassTeacherAssignmentClassInfo updateClassForAssignment(
        UserLogin u,
        UpdateClassForAssignmentInputModel input
    ) {
        ClassTeacherAssignmentClassInfo classTeacherAssignmentClassInfo =
            classTeacherAssignmentClassInfoRepo.findById(input.getClassId()).orElse(null);
        if (classTeacherAssignmentClassInfo != null) {
            classTeacherAssignmentClassInfo.setHourLoad(input.getHourLoad());
            classTeacherAssignmentClassInfo = classTeacherAssignmentClassInfoRepo.save(classTeacherAssignmentClassInfo);
        }
        return classTeacherAssignmentClassInfo;
    }

    @Override
    public TeacherForAssignmentPlan updateTeacherForAssignment(
        UserLogin u,
        UpdateTeacherForAssignmentInputModel input
    ) {
        TeacherForAssignmentPlan teacherForAssignmentPlan =
            teacherForAssignmentPlanRepo.findByTeacherIdAndPlanId(input.getTeacherId(), input.getPlanId());
        if (teacherForAssignmentPlan != null) {
            teacherForAssignmentPlan.setMaxHourLoad(input.getHourLoad());
            teacherForAssignmentPlan.setMinimizeNumberWorkingDays(input.getMinimizeNumberWorkingDays());
            teacherForAssignmentPlan = teacherForAssignmentPlanRepo.save(teacherForAssignmentPlan);
        }
        return teacherForAssignmentPlan;
    }

    @Override
    public TeacherCourseForAssignmentPlan updateTeacherCourseForAssignmentPlan(
        UserLogin u,
        UpdateTeacherCoursePriorityForAssignmentPlanInputModel input
    ) {
        TeacherCourseForAssignmentPlan teacherCourseForAssignmentPlan = teacherCourseForAssignmentPlanRepo
            .findByTeacherIdAndCourseIdAndPlanId(input.getTeacherId(), input.getCourseId(), input.getPlanId());
        if (teacherCourseForAssignmentPlan != null) {
            teacherCourseForAssignmentPlan.setPriority(input.getPriority());
            teacherCourseForAssignmentPlan = teacherCourseForAssignmentPlanRepo.save(teacherCourseForAssignmentPlan);
            log.info("updateTeacherCourseForAssignmentPlan, update OK!!");

        }
        return null;
    }
}
