package com.hust.baseweb.applications.education.thesisdefensejury.service;

import com.hust.baseweb.applications.education.thesisdefensejury.entity.TraningProgram;
import com.hust.baseweb.applications.education.thesisdefensejury.repo.TranningProgramRepo;
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
public class TranningProgramImpl implements TranningProgramService{
    private final TranningProgramRepo tranningProgramRepo;

    @Override
    public List<TraningProgram> getAllTranningProgram() {
        return tranningProgramRepo.findAll();
    }
}
