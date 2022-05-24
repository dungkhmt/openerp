package com.hust.baseweb.applications.taskmanagement.service;

import com.hust.baseweb.applications.taskmanagement.entity.Task;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface TaskService {
    Task createTask(Task task);

    List<Task> getAllTasks();

    List<Task> getAllTaskInProject(UUID projectId);
}
