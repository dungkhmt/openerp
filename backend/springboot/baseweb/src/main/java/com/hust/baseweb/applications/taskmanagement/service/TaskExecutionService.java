package com.hust.baseweb.applications.taskmanagement.service;

import com.hust.baseweb.applications.taskmanagement.entity.TaskExecution;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public interface TaskExecutionService {
    TaskExecution create(TaskExecution taskExecution);

    boolean delete(UUID taskExecutionId);

    TaskExecution findById(UUID taskExecutionId);

    TaskExecution save(TaskExecution taskExecution);

    List<TaskExecution> findByTaskId(UUID taskId);

    List<Object[]> getAllDistinctDay(UUID projectId);

    public List<TaskExecution> getAllTaskExecutionByDate(Date date, UUID projectId);
}
