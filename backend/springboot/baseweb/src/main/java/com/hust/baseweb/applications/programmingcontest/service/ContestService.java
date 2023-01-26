package com.hust.baseweb.applications.programmingcontest.service;

import com.hust.baseweb.applications.programmingcontest.entity.ContestEntity;
import com.hust.baseweb.applications.programmingcontest.repo.ContestRepo;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class ContestService {

    private ContestRepo contestRepo;

    private static final String HASH = "CONTEST";

    @Cacheable(value = HASH, key = "#contestId")
    public ContestEntity findContestWithCache(String contestId) {
        return contestRepo.findContestByContestId(contestId);
    }

    @CachePut(value = HASH, key = "#contest.contestId")
    public ContestEntity updateContestWithCache(ContestEntity contest) {
        return contestRepo.save(contest);
    }

    public ContestEntity saveContest(ContestEntity contest) {
        return contestRepo.save(contest);
    }

}
