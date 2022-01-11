package com.hust.baseweb.applications.programmingcontest.repo;

import com.hust.baseweb.applications.programmingcontest.entity.ContestEntity;
import com.hust.baseweb.entity.UserLogin;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface ContestPagingAndSortingRepo extends PagingAndSortingRepository<ContestEntity, String> {
    Page<ContestEntity> findAll(Pageable pageable);
    Page<ContestEntity> findAllByUserCreatedContest(Pageable pageable, UserLogin userLogin);
}
