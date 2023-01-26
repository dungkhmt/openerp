package com.hust.baseweb.applications.programmingcontest.service;

import com.hust.baseweb.applications.programmingcontest.entity.ProblemEntity;
import com.hust.baseweb.applications.programmingcontest.repo.ProblemRepo;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class ProblemService {

    private ProblemRepo problemRepo;

    private static final String HASH = "PROBLEM";

    @Cacheable(value = HASH, key = "#problemId")
    public ProblemEntity findProblemWithCache(String problemId) {
        return problemRepo.findByProblemIdWithTagFetched(problemId);
    }

    @CachePut(value = HASH, key = "#problem.problemId")
    public ProblemEntity updateProblemWithCache(ProblemEntity problem) {
        return problemRepo.save(problem);
    }

    public ProblemEntity saveProblem(ProblemEntity problem) {
        return problemRepo.save(problem);
    }
}
