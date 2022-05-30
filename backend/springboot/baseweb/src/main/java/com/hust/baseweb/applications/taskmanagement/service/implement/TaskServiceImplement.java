package com.hust.baseweb.applications.taskmanagement.service.implement;

import com.hust.baseweb.applications.taskmanagement.entity.Task;
import com.hust.baseweb.applications.taskmanagement.repository.TaskRepository;
import com.hust.baseweb.applications.taskmanagement.service.TaskService;
import com.hust.baseweb.entity.StatusItem;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.hust.baseweb.repo.StatusItemRepo;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class TaskServiceImplement implements TaskService {

    private final TaskRepository taskRepository;

    private final StatusItemRepo statusItemRepo;

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
    @Override
    public List<Object[]> getTaskStaticsInProject(UUID projectId) {
        return taskRepository.getTaskStaticsInProject(projectId);
    }

    @Override
    public StatusItem getStatusItemByStatusId(String statusId) {
        return statusItemRepo.findByStatusId(statusId);
    }
}
