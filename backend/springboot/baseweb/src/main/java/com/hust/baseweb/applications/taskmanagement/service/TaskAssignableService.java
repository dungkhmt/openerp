package com.hust.baseweb.applications.taskmanagement.service;

import com.hust.baseweb.applications.taskmanagement.entity.TaskAssignable;
import org.springframework.stereotype.Service;

@Service
public interface TaskAssignableService {
    TaskAssignable create(TaskAssignable taskAssignable);
}
