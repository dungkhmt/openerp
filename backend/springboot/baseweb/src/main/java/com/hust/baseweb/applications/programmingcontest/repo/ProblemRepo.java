package com.hust.baseweb.applications.programmingcontest.repo;

import com.hust.baseweb.applications.programmingcontest.entity.ProblemEntity;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.ArrayList;
import java.util.List;

public interface ProblemRepo extends JpaRepository<ProblemEntity, String> {
    ProblemEntity findByProblemId(String problemId);

    @Query("SELECT p FROM ProblemEntity p LEFT JOIN FETCH p.tags WHERE p.problemId = (:problemId)")
    ProblemEntity findByProblemIdWithTagFetched(@Param("problemId") String problemId);    

    @Query("select p.problemName from ProblemEntity p")
    ArrayList<String> findAllProblemName();

    void deleteByProblemIdAndUserId(String problemId, String userId);

    @Query("select p from ProblemEntity p where p.problemId in :problemIds")
    List<ProblemEntity> getAllProblemWithArray(@Param("problemIds") List<String> problemIds);

//    void deleteByProblemId(String problemId);

    void deleteProblemEntityByProblemId(String problemId);


}
