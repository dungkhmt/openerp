package com.hust.baseweb.applications.taskmanagement.service;

import com.hust.baseweb.applications.taskmanagement.entity.Project;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public interface ProjectService {

    List<Project> getListProject();

    Project getProjectById(UUID id);

    Project createProject(Project project);

    void deleteProjectById(Integer id);
}