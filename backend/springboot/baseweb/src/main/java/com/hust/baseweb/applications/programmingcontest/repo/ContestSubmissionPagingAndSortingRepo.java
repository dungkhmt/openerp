package com.hust.baseweb.applications.programmingcontest.repo;

import com.hust.baseweb.applications.programmingcontest.entity.ContestSubmissionEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;
import java.util.UUID;

public interface ContestSubmissionPagingAndSortingRepo extends PagingAndSortingRepository<ContestSubmissionEntity, UUID> {
    Page<ContestSubmissionEntity> findAllByContestId(Pageable pageable, String contestId);
    Page<ContestSubmissionEntity> findAllByUserId(Pageable pageable, String userId);

    @Query(value = "select * from contest_submission_new where user_submission_id = ?1 order by created_stamp desc "
        ,
           nativeQuery = true
    )
    List<ContestSubmissionEntity> findAllByUserId(String userId);
}
