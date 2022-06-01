package com.hust.baseweb.applications.programmingcontest.repo;

import com.hust.baseweb.applications.programmingcontest.entity.ContestEntity;
import com.hust.baseweb.entity.UserLogin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContestRepo extends JpaRepository<ContestEntity, String> {
    ContestEntity findContestByContestId(String contestId);

    ContestEntity findContestEntityByContestIdAndUserId(String contestId, String userId);

    void deleteByContestIdAndUserId(String contestId, String userId);


}
