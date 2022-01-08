package com.hust.baseweb.applications.programmingcontest.repo;

import com.hust.baseweb.applications.programmingcontest.entity.ContestSubmissionEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.UUID;

public interface ContestSubmissionPagingAndSortingRepo extends PagingAndSortingRepository<ContestSubmissionEntity, UUID> {
    Page<ContestSubmissionEntity> findAllByContestId(Pageable pageable, String contestId);
}
