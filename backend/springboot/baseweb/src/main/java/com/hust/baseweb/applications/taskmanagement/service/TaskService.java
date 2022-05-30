package com.hust.baseweb.applications.taskmanagement.service;

import com.hust.baseweb.applications.taskmanagement.entity.Task;
import com.hust.baseweb.entity.StatusItem;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface TaskService {
    Task createTask(Task task);

    List<Task> getAllTasks();

    List<Task> getAllTaskInProject(UUID projectId);

    List<Object[]> getTaskStaticsInProject(UUID projectId);

    StatusItem getStatusItemByStatusId(String statusId);
}
