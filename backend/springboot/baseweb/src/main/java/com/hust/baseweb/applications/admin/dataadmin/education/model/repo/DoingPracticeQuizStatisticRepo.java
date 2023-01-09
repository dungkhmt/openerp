package com.hust.baseweb.applications.admin.dataadmin.education.model.repo;

import com.hust.baseweb.applications.admin.dataadmin.education.model.statistic.QuizDoingTimeModel;
import com.hust.baseweb.applications.admin.dataadmin.education.model.statistic.TotalQuizDoingTimeModel;
import com.hust.baseweb.applications.education.entity.LogUserLoginQuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.*;

@Repository
public interface DoingPracticeQuizStatisticRepo extends JpaRepository<LogUserLoginQuizQuestion, UUID> {

    @Query(
        "SELECT COUNT (*) FROM LogUserLoginQuizQuestion lg " +
        "WHERE (:classId IS NULL OR lg.classId = :classId) AND lg.userLoginId = :loginId"
    )
    long countTotalQuizDoingTimes(@Param("loginId") String loginId, @Param("classId") UUID classId);

    @Query(
        "SELECT MAX (lg.createStamp) FROM LogUserLoginQuizQuestion lg " +
        "WHERE (:classId IS NULL OR lg.classId = :classId) AND lg.userLoginId = :loginId"
    )
    Date findLatestTimeDoingQuiz(@Param("loginId") String loginId, @Param("classId") UUID classId);

    @Query(
        "SELECT lg.createStamp FROM LogUserLoginQuizQuestion lg " +
        "WHERE (:classId IS NULL OR lg.classId = :classId) AND lg.userLoginId = :loginId " +
        "ORDER BY lg.createStamp ASC"
    )
    ArrayList<LocalDateTime> findAllDoingTimesSortAsc(@Param("loginId") String loginId, @Param("classId") UUID classId);

    @Query(
        "SELECT lg.userLoginId, COUNT(*) FROM LogUserLoginQuizQuestion lg " +
        "WHERE :statisticFrom IS NULL OR lg.createStamp > :statisticFrom " +
        "GROUP BY lg.userLoginId"
    )
    List<TotalQuizDoingTimeModel> countTotalQuizDoingTimes(@Param("statisticFrom") Date statisticFrom);

    @Query(
        "SELECT lg.userLoginId, MAX(lg.createStamp) FROM LogUserLoginQuizQuestion lg " +
        "WHERE :statisticFrom IS NULL OR lg.createStamp > :statisticFrom " +
        "GROUP BY lg.userLoginId"
    )
    List<QuizDoingTimeModel> findLatestTimesDoingQuiz(@Param("statisticFrom") Date statisticFrom);

    @Query(
        "SELECT lg.userLoginId, lg.createStamp FROM LogUserLoginQuizQuestion lg " +
        "WHERE :statisticFrom IS NULL OR lg.createStamp > :statisticFrom " +
        "ORDER BY lg.createStamp ASC"
    )
    List<QuizDoingTimeModel> findDoingTimesSortAsc(@Param("statisticFrom") Date statisticFrom);

    @Query(
        "SELECT lg.userLoginId, MAX(lg.createStamp) FROM LogUserLoginQuizQuestion lg " +
        "WHERE lg.userLoginId IN :loginIds AND lg.createStamp < :maxDoingTime " +
        "GROUP BY lg.userLoginId"
    )
    List<QuizDoingTimeModel> findLatestDoingTimesBefore(@Param("maxDoingTime") Date maxDoingTime,
                                                        @Param("loginIds") Set<String> loginIds);
}
