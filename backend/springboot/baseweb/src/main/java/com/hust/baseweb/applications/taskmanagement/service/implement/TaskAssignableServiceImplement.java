package com.hust.baseweb.applications.taskmanagement.service.implement;

import com.hust.baseweb.applications.taskmanagement.entity.TaskAssignable;
import com.hust.baseweb.applications.taskmanagement.repository.TaskAssignableRepository;
import com.hust.baseweb.applications.taskmanagement.service.TaskAssignableService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class TaskAssignableServiceImplement implements TaskAssignableService {

    private final TaskAssignableRepository taskAssignableRepository;
    @Override
    public TaskAssignable create(TaskAssignable taskAssignable) {
        return taskAssignableRepository.save(taskAssignable);
    }

    @Override
    public List<TaskAssignable> getByPartyId(UUID partyId) {
        return taskAssignableRepository.getByPartyId(partyId);
    }

    @Override
    public TaskAssignable getByTaskId(UUID taskId) {
        return taskAssignableRepository.getByTaskId(taskId);
    }
}
