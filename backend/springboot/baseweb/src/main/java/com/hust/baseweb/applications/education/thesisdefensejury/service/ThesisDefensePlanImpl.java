package com.hust.baseweb.applications.education.thesisdefensejury.service;

import com.hust.baseweb.applications.education.thesisdefensejury.entity.ThesisDefensePlan;
import com.hust.baseweb.applications.education.thesisdefensejury.repo.ThesisDefensePlanRepo;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@AllArgsConstructor(onConstructor = @__(@Autowired))
@Service
@Transactional
@Slf4j
public class ThesisDefensePlanImpl implements ThesisDefensePlanService{
    private final ThesisDefensePlanRepo thesisDefensePlanRepo;
    @Override
    public List<ThesisDefensePlan> getAllThesisDefensePlan() {
        return thesisDefensePlanRepo.findAll();
    }
}
