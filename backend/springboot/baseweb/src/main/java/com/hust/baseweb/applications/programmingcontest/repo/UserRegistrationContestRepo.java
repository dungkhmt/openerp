package com.hust.baseweb.applications.programmingcontest.repo;

import com.hust.baseweb.applications.programmingcontest.entity.UserRegistrationContestEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserRegistrationContestRepo extends JpaRepository<UserRegistrationContestEntity, UUID> {
//    UserRegistrationContestEntity findUserRegistrationContestByContestAndUserLogin(ContestEntity contest, UserLogin userLogin);

    UserRegistrationContestEntity findUserRegistrationContestEntityByContestIdAndUserId(String contestId, String userId);

//    UserRegistrationContestEntity findUserRegistrationContestEntityByContestAndUserLoginAndStatus(ContestEntity contest, UserLogin userLogin, String status);

    List<UserRegistrationContestEntity> findUserRegistrationContestEntityByContestIdAndUserIdAndStatus(String contestId, String userId, String status);
//    List<ModelUserRegisteredClassInfo> getAllUserRegisteredContestInfo()

    List<UserRegistrationContestEntity> findAllByUserIdAndRoleId(String userId, String roleId);

    List<UserRegistrationContestEntity> findAllByRoleIdAndContestIdAndStatus(String roleId, String contestId, String status);

    List<UserRegistrationContestEntity> findAllByContestIdAndStatus(String contestId, String status);

    void deleteAllByContestId(String contestId);
}
