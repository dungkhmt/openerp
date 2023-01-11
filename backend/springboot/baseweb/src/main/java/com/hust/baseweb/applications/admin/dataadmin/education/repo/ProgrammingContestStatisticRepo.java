package com.hust.baseweb.applications.admin.dataadmin.education.repo;

import com.hust.baseweb.applications.admin.dataadmin.education.model.statistic.CodeSubmissionTimeModel;
import com.hust.baseweb.applications.admin.dataadmin.education.model.statistic.TotalCodeSubmissionModel;
import com.hust.baseweb.applications.programmingcontest.entity.ContestSubmissionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.UUID;

public interface ProgrammingContestStatisticRepo extends JpaRepository<ContestSubmissionEntity, UUID> {

    @Query(
        "SELECT cs.userId AS loginId, COUNT(*) AS totalCodeSubmissions " +
        "FROM ContestSubmissionEntity cs " +
        "WHERE :statisticFrom IS NULL OR cs.createdAt > :statisticFrom " +
        "GROUP BY cs.userId"
    )
    List<TotalCodeSubmissionModel> countTotalCodeSubmissions(@Param("statisticFrom") Date statisticFrom);

    @Query(
        "SELECT cs.userId as loginId, MAX(cs.createdAt) as submitTime " +
        "FROM ContestSubmissionEntity cs " +
        "WHERE :statisticFrom IS NULL OR cs.createdAt > :statisticFrom " +
        "GROUP BY cs.userId"
    )
    List<CodeSubmissionTimeModel> findLatestTimesSubmittingCode(@Param("statisticFrom") Date statisticFrom);

//    @Query(
//        "SELECT tmp.userId as loginId, COUNT(*) as totalSubmissionsAcceptedOnTheFirstSubmit " +
//        "FROM ( " +
//                "SELECT TOP 1 old_cs.userId, old_cs.problemId, old_cs.status " +
//                "FROM ContestSubmissionEntity old_cs " +
//                "WHERE old_cs.createdAt > :statisticFrom " +
//                    "AND CONCAT(new_cs.userId, '_', new_cs.problemId) NOT IN ( " +
//                        "SELECT DISTINCT CONCAT(new_cs.userId, '_', new_cs.problemId) " +
//                        "FROM ContestSubmissionEntity new_cs " +
//                        "WHERE new_cs.createdAt <= :statisticFrom " +
//                    ") " +
//                "GROUP BY old_cs.userId, old_cs.problemId " +
//                "ORDER BY old_cs.createdAt ASC " +
//            ") tmp " +
//        "WHERE tmp.status IN :statuses " +
//        "GROUP BY tmp.userId"
//    )
//    List<TotalCodeSubmissionModel> countSubmissionsHasFirstSubmitStatusIn(@Param("statisticFrom") Date statisticFrom,
//                                                        @Param("statuses") Collection<String> statuses);

    @Query(
        nativeQuery = true,
        value = "SELECT tmp.user_id as loginId, COUNT(*) as totalSubmissionsAcceptedOnTheFirstSubmit " +
                "FROM ( " +
                     "SELECT old_cs.user_submission_id AS user_id, " +
                           "old_cs.problem_id AS problem_id, " +
                           "old_cs.status AS status, " +
                           "row_number() OVER ( " +
                               "PARTITION BY old_cs.user_submission_id, old_cs.problem_id " +
                               "ORDER BY old_cs.created_stamp ASC " +
                               ") AS rn " +
                      "FROM contest_submission_new old_cs " +
                      "WHERE old_cs.created_stamp > :statisticFrom " +
                        "AND CONCAT(old_cs.user_submission_id, '_', old_cs.problem_id) NOT IN " +
                            "(SELECT DISTINCT CONCAT(new_cs.user_submission_id, '_', new_cs.problem_id) " +
                             "FROM contest_submission_new new_cs " +
                             "WHERE new_cs.created_stamp <= :statisticFrom) " +
                      ") tmp " +
                "WHERE tmp.rn = 1 AND tmp.status IN :statuses " +
                "GROUP BY tmp.user_id;"
    )
    List<TotalCodeSubmissionModel> countSubmissionsHasFirstSubmitStatusIn(@Param("statisticFrom") Date statisticFrom,
                                                                          @Param("statuses") Collection<String> statuses);
}
