package com.hust.baseweb.applications.taskmanagement.service;

import com.hust.baseweb.applications.taskmanagement.entity.TaskAssignable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface TaskAssignableService {
    TaskAssignable create(TaskAssignable taskAssignable);

    List<TaskAssignable> getByPartyId(UUID partyId);
}
