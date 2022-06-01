package com.hust.baseweb.applications.education.thesisdefensejury.service;


import com.hust.baseweb.applications.education.entity.mongodb.Teacher;
import com.hust.baseweb.applications.education.teacherclassassignment.entity.EduTeacher;
import com.hust.baseweb.applications.education.teacherclassassignment.repo.EduTeacherRepo;
import com.hust.baseweb.applications.education.thesisdefensejury.entity.DefenseJury;
import com.hust.baseweb.applications.education.thesisdefensejury.entity.Thesis;
import com.hust.baseweb.applications.education.thesisdefensejury.entity.ThesisDefensePlan;
import com.hust.baseweb.applications.education.thesisdefensejury.entity.TraningProgram;
import com.hust.baseweb.applications.education.thesisdefensejury.models.DefenseJuryIM;
import com.hust.baseweb.applications.education.thesisdefensejury.models.Response;
import com.hust.baseweb.applications.education.thesisdefensejury.models.ThesisIM;
import com.hust.baseweb.applications.education.thesisdefensejury.models.ThesisOM;
import com.hust.baseweb.applications.education.thesisdefensejury.repo.DefenseJuryRepo;
import com.hust.baseweb.applications.education.thesisdefensejury.repo.ThesisDefensePlanRepo;
import com.hust.baseweb.applications.education.thesisdefensejury.repo.ThesisRepo;
import com.hust.baseweb.applications.education.thesisdefensejury.repo.TranningProgramRepo;
import com.hust.baseweb.entity.UserLogin;
import com.hust.baseweb.repo.UserLoginRepo;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor(onConstructor = @__(@Autowired))
@Service
@Transactional
@Slf4j
public class ThesisImpl implements ThesisService {
    private final ThesisRepo thesisRepo;
    private final TranningProgramRepo tranningProgramRepo;
    private final ThesisDefensePlanRepo thesisDefensePlanRepo;
    private final EduTeacherRepo eduTeacherRepo;
    private final DefenseJuryRepo defenseJuryRepo;
    private final UserLoginRepo userLoginRepo;

    @Override
    public Thesis createThesis(ThesisIM thesis) {
        // check request

        if( thesis.getName()==""||thesis.getProgram_name()==""||thesis.getThesisPlanName()==""
            || thesis.getStudent_name()==""||thesis.getSupervisor_name()==""||thesis.getDefense_jury_name()==""
            ||thesis.getUserLoginID()==""||thesis.getKeyword()=="" ){
            log.info("invalid request");
            return null;
        }
        // TODO: program, thesis_defense_plan_name,supervisor,jury,reviewer
        Optional<TraningProgram> traningProgram = tranningProgramRepo.findByName(thesis.getProgram_name());
        if(!traningProgram.isPresent()){
            log.info("not found tranning program name");
            return null;
        }
        Optional<ThesisDefensePlan> thesisDefensePlan = thesisDefensePlanRepo.findByName(thesis.getThesisPlanName());
        if (!thesisDefensePlan.isPresent()){
            log.info("not found thesis defense plan name");
            return null;
        }
        Optional<EduTeacher> eduTeacher = eduTeacherRepo.findByTeacherName(thesis.getSupervisor_name());
        if (!eduTeacher.isPresent()){
            log.info("not found supervisor teacher name");
            return null;
        }
        List<DefenseJury> defenseJury  = defenseJuryRepo.findByName(thesis.getDefense_jury_name());
        if (defenseJury.size() == 0) {
            log.info("not found defense jury name");
            return null;
        }
        // if reviewer name exist
        Optional<EduTeacher> reviewer = Optional.of(new EduTeacher());
        if (thesis.getReviewer_name() != ""){
            reviewer = eduTeacherRepo.findByTeacherName(thesis.getReviewer_name());
            if (!reviewer.isPresent()){
                log.info("not found reviewer teacher name");
                return null;
            }
        }

        // maping fields and
        // insert or update thesis to db
        Thesis rs = new Thesis();
        rs.setThesisName(thesis.getName());
        rs.setThesisAbstract(thesis.getThesis_abstract());
        rs.setProgramId(traningProgram.get().getId());
        rs.setDefensePlanId(thesisDefensePlan.get().getId());
        rs.setStudentName(thesis.getStudent_name());
        rs.setSupervisor(eduTeacher.get().getTeacherId());
        rs.setUserLogin(thesis.getUserLoginID());
        rs.setDefenseJury(defenseJury.get(0).getId());
        rs.setScheduled_reviewer_id(reviewer.get().getTeacherId());
        rs.setThesisKeyword(thesis.getKeyword());
        thesisRepo.save(rs);

        // get just created thesis detail
        Optional<Thesis> createdThesis = thesisRepo.findByThesisName(thesis.getName());
        return createdThesis.get();
    }

    @Override
    public ThesisOM findById(UUID id) {
        Optional<Thesis> thesis = thesisRepo.findById(id);
        ThesisOM ele = new ThesisOM();
        ele.setId(thesis.get().getId());
        ele.setName(thesis.get().getThesisName());
        ele.setThesis_abstract(thesis.get().getThesisAbstract());
        // TODO: program, thesis_defense_plan_name,supervisor,jury,reviewer
        Optional<TraningProgram> program = tranningProgramRepo.findById(thesis.get().getProgramId());
        Optional<ThesisDefensePlan> defensePlan = thesisDefensePlanRepo.findById(thesis.get().getDefensePlanId());
        Optional<EduTeacher> supervisor = eduTeacherRepo.findById(thesis.get().getSupervisor());
        Optional<EduTeacher> reviewer = eduTeacherRepo.findById(thesis.get().getScheduled_reviewer_id());
        Optional<DefenseJury> jury = defenseJuryRepo.findById(thesis.get().getDefenseJury());

        ele.setProgram_name(program.get().getName());
        ele.setThesisPlanName(defensePlan.get().getName());
        ele.setSupervisor_name(supervisor.get().getTeacherName());
        ele.setDefense_jury_name(jury.get().getName());
        ele.setReviewer_name(reviewer.get().getTeacherName());
        ele.setStudent_name(thesis.get().getStudentName());
        ele.setUserLoginID(thesis.get().getUserLogin());
        ele.setName(thesis.get().getThesisName());
        ele.setKeyword(thesis.get().getThesisKeyword());
        ele.setUpdatedDateTime(thesis.get().getUpdatedDateTime());
        ele.setCreatedTime(thesis.get().getCreatedTime());
        return ele;
    }


    @Override
    public Page<ThesisOM> findAll(Pageable pageable) {
        Page<Thesis> thesiss =  thesisRepo.findAll(pageable);
        List<Thesis> thesisList = thesiss.getContent();
        System.out.println(thesisList);
        List<ThesisOM> output = new ArrayList<ThesisOM>();
        for (int i=0;i<thesisList.size();i++) {
            ThesisOM ele = new ThesisOM();
            String juryName = "";
            ele.setId(thesisList.get(i).getId());
            ele.setName(thesisList.get(i).getThesisName());
            ele.setThesis_abstract(thesisList.get(i).getThesisAbstract());
            // TODO: program, thesis_defense_plan_name,supervisor,jury,reviewer
            Optional<TraningProgram> program = tranningProgramRepo.findById(thesisList.get(i).getProgramId());
            Optional<ThesisDefensePlan> defensePlan = thesisDefensePlanRepo.findById(thesisList.get(i).getDefensePlanId());
            Optional<EduTeacher> supervisor = eduTeacherRepo.findById(thesisList.get(i).getSupervisor());
            Optional<EduTeacher> reviewer = eduTeacherRepo.findById(thesisList.get(i).getScheduled_reviewer_id());
            if (thesisList.get(i).getDefenseJury() != null){
                Optional<DefenseJury> jury = defenseJuryRepo.findById(thesisList.get(i).getDefenseJury());
                juryName = jury.get().getName();
            }


            ele.setProgram_name(program.get().getName());
            ele.setThesisPlanName(defensePlan.get().getName());
            ele.setSupervisor_name(supervisor.get().getTeacherName());
            ele.setDefense_jury_name(juryName);
            ele.setReviewer_name(reviewer.get().getTeacherName());
            ele.setStudent_name(thesisList.get(i).getStudentName());
            ele.setUserLoginID(thesisList.get(i).getUserLogin());
            ele.setName(thesisList.get(i).getThesisName());
            ele.setKeyword(thesisList.get(i).getThesisKeyword());
            ele.setUpdatedDateTime(thesisList.get(i).getUpdatedDateTime());
            ele.setCreatedTime(thesisList.get(i).getCreatedTime());

            output.add(ele);

        }
        Page<ThesisOM> pagesThesiss = new PageImpl<ThesisOM>(output, pageable, output.size());
        return pagesThesiss;
    }

    @Override
    public List<ThesisOM> searchByThesisName(String name) {
        // check name
//        if (name == ""){
//            return null;
//        }
        // get list theis
        List<Thesis> thesisList = thesisRepo.findAllByThesisName(name);
        if (thesisList.size() == 0){
            return null;
        }
        // mapping thesis to thesisOM
        List<ThesisOM> output = new ArrayList<ThesisOM>();
        for (int i=0;i<thesisList.size();i++){
            ThesisOM ele = new ThesisOM();
            ele.setId(thesisList.get(i).getId());
            ele.setName(thesisList.get(i).getThesisName());
            ele.setThesis_abstract(thesisList.get(i).getThesisAbstract());
            // TODO: program, thesis_defense_plan_name,supervisor,jury,reviewer
            Optional<TraningProgram> program = tranningProgramRepo.findById(thesisList.get(i).getProgramId());
            Optional<ThesisDefensePlan> defensePlan = thesisDefensePlanRepo.findById(thesisList.get(i).getDefensePlanId());
            Optional<EduTeacher> supervisor = eduTeacherRepo.findById(thesisList.get(i).getSupervisor());
            Optional<EduTeacher> reviewer = eduTeacherRepo.findById(thesisList.get(i).getScheduled_reviewer_id());
            Optional<DefenseJury> jury = defenseJuryRepo.findById(thesisList.get(i).getDefenseJury());

            ele.setProgram_name(program.get().getName());
            ele.setThesisPlanName(defensePlan.get().getName());
            ele.setSupervisor_name(supervisor.get().getTeacherName());
            ele.setDefense_jury_name(jury.get().getName());
            ele.setReviewer_name(reviewer.get().getTeacherName());
            ele.setStudent_name(thesisList.get(i).getStudentName());
            ele.setUserLoginID(thesisList.get(i).getUserLogin());
            ele.setName(thesisList.get(i).getThesisName());
            ele.setKeyword(thesisList.get(i).getThesisKeyword());
            ele.setUpdatedDateTime(thesisList.get(i).getUpdatedDateTime());
            ele.setCreatedTime(thesisList.get(i).getCreatedTime());

            output.add(ele);
        }
        return output;
    }

    @Override
    public Response deleteThesis(UUID id, String UserId) {
        Response res = new Response();
        if (id == null || UserId == ""){
            res.setOk(false);
            res.setErr("TheisId or UserLogin ID invalid");
            return res;
        }
        // check UserId exist
        UserLogin userLogin = userLoginRepo.findByUserLoginId(UserId);
        if (userLogin == null){
            res.setOk(false);
            res.setErr("User Login Id isnt existed");
            return  res;
        }

        thesisRepo.deleteByIdAndUserLogin(id,UserId);
        res.setOk(true);
        return res;
    }

    @Override
    public Response editThesis(ThesisIM thesis) {
        Response res = new Response();
        // check request

        if( thesis.getName()==""||thesis.getProgram_name()==""||thesis.getThesisPlanName()==""
            || thesis.getStudent_name()==""||thesis.getSupervisor_name()==""||thesis.getDefense_jury_name()==""
            ||thesis.getUserLoginID()==""||thesis.getKeyword()=="" ){
            log.info("invalid request");
            res.setErr("invalid request");
            res.setOk(false);
            return res;
        }
        // TODO: program, thesis_defense_plan_name,supervisor,jury,reviewer
        Optional<TraningProgram> traningProgram = tranningProgramRepo.findByName(thesis.getProgram_name());
        if(!traningProgram.isPresent()){
            log.info("not found tranning program name");
            res.setOk(false);
            res.setErr("not found tranning program name");
            return res;
        }
        Optional<ThesisDefensePlan> thesisDefensePlan = thesisDefensePlanRepo.findByName(thesis.getThesisPlanName());
        if (!thesisDefensePlan.isPresent()){
            log.info("not found thesis defense plan name");
            res.setOk(false);
            res.setErr("not found thesis defense plan name");
            return res;
        }
        Optional<EduTeacher> eduTeacher = eduTeacherRepo.findByTeacherName(thesis.getSupervisor_name());
        if (!eduTeacher.isPresent()){
            log.info("not found supervisor teacher name");
            res.setOk(false);
            res.setErr("not found supervisor teacher name");
            return null;
        }
        List<DefenseJury> defenseJury  = defenseJuryRepo.findByName(thesis.getDefense_jury_name());
        if (defenseJury.size() == 0) {
            log.info("not found defense jury name");
            res.setOk(false);
            res.setErr("not found defense jury name");
            return res;
        }
        // if reviewer name exist
        Optional<EduTeacher> reviewer = Optional.of(new EduTeacher());
        if (thesis.getReviewer_name() != ""){
            reviewer = eduTeacherRepo.findByTeacherName(thesis.getReviewer_name());
            if (!reviewer.isPresent()){
                log.info("not found reviewer teacher name");
                res.setOk(false);
                res.setErr("not found reviewer teacher name");
                return res;
            }
        }

        // maping fields and
        // insert or update thesis to db
        Optional<Thesis> found = thesisRepo.findById(thesis.getId());
        Thesis rs = found.get();
        rs.setThesisName(thesis.getName());
        rs.setThesisAbstract(thesis.getThesis_abstract());
        rs.setProgramId(traningProgram.get().getId());
        rs.setDefensePlanId(thesisDefensePlan.get().getId());
        rs.setStudentName(thesis.getStudent_name());
        rs.setSupervisor(eduTeacher.get().getTeacherId());
        rs.setUserLogin(thesis.getUserLoginID());
        rs.setDefenseJury(defenseJury.get(0).getId());
        rs.setScheduled_reviewer_id(reviewer.get().getTeacherId());
        rs.setThesisKeyword(thesis.getKeyword());
        thesisRepo.save(rs);

        // get just created thesis detail
        Optional<Thesis> editedThesis = thesisRepo.findById(thesis.getId());
        res.setOk(true);
        res.setResult(editedThesis.get());
        return res;
    }

    @Override
    public Response disableThesisWithDefenseJury(UUID id, UUID defenseJuryId) {
        Response res = new Response();
        if(id == null || defenseJuryId == null){
            res.setOk(false);
            res.setErr("Invalid thesisId or DefenseJuryId");
            return res;
        }
        // check defense jury id exist ?
        Optional<DefenseJury> df = defenseJuryRepo.findById(defenseJuryId);
        if (!df.isPresent()){
            res.setOk(false);
            res.setErr("DefenseJuryId isnt existed");
            return  res;
        }
        // disable

        return null;
    }
}
