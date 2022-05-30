package com.hust.baseweb.applications.taskmanagement.repository;

import com.hust.baseweb.applications.taskmanagement.entity.TaskAssignable;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface TaskAssignableRepository
    extends JpaRepository<TaskAssignable, UUID>, CrudRepository<TaskAssignable, UUID> {

    @Query(value = "SELECT e.* FROM backlog_task_assignable e WHERE e.assigned_to_party_id = :partyId",
           nativeQuery = true)
    List<TaskAssignable> getByPartyId(@Param("partyId") UUID partyId);
}
