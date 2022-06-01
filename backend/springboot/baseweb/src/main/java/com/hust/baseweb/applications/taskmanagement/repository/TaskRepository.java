package com.hust.baseweb.applications.taskmanagement.repository;

import com.hust.baseweb.applications.taskmanagement.entity.Task;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID>, CrudRepository<Task, UUID> {
    @Query(value = "SELECT e.* FROM backlog_task e WHERE e.backlog_project_id = :projectId", nativeQuery = true)
    List<Task> findAllTasksByProjectId(@Param("projectId") UUID projectId);

    Task save(Task task);

    @Query(value = "Select c.backlog_task_category_id, c.backlog_task_category_name, count(e.backlog_task_id)\\:\\:int \n" +
                   "from backlog_task_category c \n" +
                   "left join backlog_task e on e.backlog_task_category_id = c.backlog_task_category_id\n" +
                   "where e.backlog_project_id = :projectId or e.backlog_project_id is null \n" +
                   "group by c.backlog_task_category_id",
           nativeQuery = true)
    List<Object[]> getTaskStaticsInProject(@Param("projectId") UUID projectId);
}