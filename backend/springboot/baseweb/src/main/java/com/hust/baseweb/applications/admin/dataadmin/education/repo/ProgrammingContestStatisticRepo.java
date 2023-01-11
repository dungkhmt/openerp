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
    List<CodeSubmissionTimeModel> findLatestTimeSubmittingCode(@Param("statisticFrom") Date statisticFrom);

    @Query(
        "SELECT tmp.userId as loginId, COUNT(*) as totalSubmissionsAcceptedOnTheFirstSubmit " +
        "FROM ( " +
                "SELECT TOP 1 old_cs.userId, old_cs.problemId, old_cs.status " +
                "FROM ContestSubmissionEntity old_cs " +
                "WHERE old_cs.createdAt > :statisticFrom " +
                    "AND CONCAT(new_cs.userId, '_', new_cs.problemId) NOT IN ( " +
                        "SELECT DISTINCT CONCAT(new_cs.userId, '_', new_cs.problemId) " +
                        "FROM ContestSubmissionEntity new_cs " +
                        "WHERE new_cs.createdAt <= :statisticFrom " +
                    ") " +
                "GROUP BY old_cs.userId, old_cs.problemId " +
                "ORDER BY old_cs.createdAt ASC " +
            ") tmp " +
        "WHERE tmp.status IN :statuses " +
        "GROUP BY tmp.userId"
    )
    List<Object> countSubmissionsHasFirstSubmitStatusIn(@Param("statisticFrom") Date statisticFrom,
                                                        @Param("statuses")Collection<String> statuses);
}
