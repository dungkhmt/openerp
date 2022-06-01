package com.hust.baseweb.applications.taskmanagement.service.implement;

import com.hust.baseweb.applications.taskmanagement.entity.ProjectMember;
import com.hust.baseweb.applications.taskmanagement.repository.ProjectMemberRepository;
import com.hust.baseweb.applications.taskmanagement.service.ProjectMemberService;
import com.hust.baseweb.entity.Person;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.hust.baseweb.repo.PersonRepo;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class ProjectMemberServiceImplement implements ProjectMemberService {

    private final ProjectMemberRepository projectMemberRepository;

    private final PersonRepo personRepo;

    @Override
    public boolean addMemberToProject() {
        return false;
    }

    @Override
    public List<Person> getMemberIdJoinedProject(UUID projectId) {
        List<ProjectMember> projectMembers = projectMemberRepository.findAllProjectMemberByProjectId(projectId);
        List<Person> persons = new ArrayList<Person>();
        for (ProjectMember projectMember : projectMembers) {
            Person person = personRepo.findByPartyId(projectMember.getId().getPartyID());
            persons.add(person);
        }
        return persons;
    }

    @Override
    public ProjectMember setProjectMember(ProjectMember projectMember) {
        return projectMemberRepository.save(projectMember);
    }

}
