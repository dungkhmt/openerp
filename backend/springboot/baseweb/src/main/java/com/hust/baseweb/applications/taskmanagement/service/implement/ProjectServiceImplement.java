package com.hust.baseweb.applications.taskmanagement.service.implement;

import com.hust.baseweb.applications.taskmanagement.entity.Project;
import com.hust.baseweb.applications.taskmanagement.repository.ProjectRepository;
import com.hust.baseweb.applications.taskmanagement.service.ProjectService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class ProjectServiceImplement implements ProjectService {

    private final ProjectRepository projectRepository;

    @Override
    public List<Project> getListProject() {
        return projectRepository.findAll();
    }

    @Override
    public Project getProjectById(UUID id) {
        return projectRepository.findById(id);
    }

    @Override
    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    @Override
    public void deleteProjectById(UUID id) {
        projectRepository.deleteByProjectId(id);
    }

    @Override
    public Project save(Project project) {
        return projectRepository.save(project);
    }
}
