package com.hust.baseweb.applications.taskmanagement.service.implement;

import com.hust.baseweb.applications.taskmanagement.entity.Task;
import com.hust.baseweb.applications.taskmanagement.repository.TaskRepository;
import com.hust.baseweb.applications.taskmanagement.service.TaskService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class TaskServiceImplement implements TaskService {

    private final TaskRepository taskRepository;

    @Override
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    public List<Task> getAllTaskInProject(UUID projectId) {
        return taskRepository.findAllTasksByProjectId(projectId);
    }

}
