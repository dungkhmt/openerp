package com.hust.baseweb.applications.taskmanagement.service;

import com.hust.baseweb.applications.taskmanagement.entity.ProjectMember;
import com.hust.baseweb.entity.Person;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface ProjectMemberService {

    boolean addMemberToProject();

    List<Person> getMemberIdJoinedProject(UUID projectId);

    ProjectMember setProjectMember(ProjectMember projectMember);
}
