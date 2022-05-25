package com.hust.baseweb.applications.taskmanagement.controller;

import com.hust.baseweb.applications.taskmanagement.dto.form.ProjectMemberForm;
import com.hust.baseweb.applications.taskmanagement.dto.form.TaskForm;
import com.hust.baseweb.applications.taskmanagement.entity.*;
import com.hust.baseweb.applications.taskmanagement.repository.ProjectMemberRepository;
import com.hust.baseweb.applications.taskmanagement.service.*;
import com.hust.baseweb.entity.Party;
import com.hust.baseweb.entity.Person;
import com.hust.baseweb.service.PartyService;
import com.hust.baseweb.service.PersonService;
import lombok.AllArgsConstructor;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class NghiaLMController {

    private final ProjectService projectService;

    private final ProjectMemberService projectMemberService;

    private final ProjectMemberRepository projectMemberRepository;

    private final PartyService partyService;

    private final PersonService personService;

    private final TaskService taskService;

    private final TaskCategoryService taskCategoryService;

    private final TaskPriorityService taskPriorityService;

    private final TaskAssignableService taskAssignableService;

    @GetMapping("/nghialm")
    public ResponseEntity<?> testController() {
        String bodyResponse = "Hello Nghia Le Minh, test spring boot api";
        return ResponseEntity.ok().body(bodyResponse);
    }

    @GetMapping("/projects")
    public ResponseEntity<Object> getListProjects() {
        List<Project> listProject = projectService.getListProject();
        return ResponseEntity.ok().body(listProject);
    }

    @PostMapping("/projects")
    public ResponseEntity<Object> postProjects(@RequestBody Project project) {
        return ResponseEntity.ok().body(projectService.createProject(project));
    }

    @GetMapping("/projects/{projectId}/members")
    public ResponseEntity<Object> getMembersJoinedProject(@PathVariable("projectId") UUID projectId) {
        List<Person> persons = projectMemberService.getMemberIdJoinedProject(projectId);
        return ResponseEntity.ok(persons);
    }

    @PostMapping("/projects/{projectId}/members")
    public ResponseEntity<Object> addMemberToProject(
        @PathVariable("projectId") UUID projectId, @RequestBody
        ProjectMemberForm projectMemberForm
    ) {
        ProjectMember projectMember = new ProjectMember();
        ProjectMemberId projectMemberId = new ProjectMemberId();
        projectMemberId.setProjectId(UUID.fromString(projectMemberForm.getProjectId()));
        projectMemberId.setPartyID((UUID.fromString(projectMemberForm.getPartyId())));
        projectMember.setId(projectMemberId);

        return ResponseEntity.ok(projectMemberRepository.save(projectMember));
    }


    @GetMapping("/tasks")
    public ResponseEntity<Object> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();

        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/projects/{projectId}/tasks")
    public ResponseEntity<Object> getAllTasksInProject(@PathVariable("projectId") UUID projectId) {
        List<Task> tasks = taskService.getAllTaskInProject(projectId);

        return ResponseEntity.ok(tasks);
    }

    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<Object> createNewTask(
        @RequestBody TaskForm taskForm,
        @PathVariable("projectId") UUID projectId
    ) throws ParseException {
        Task task = new Task();
        task.setName(taskForm.getName());
        task.setDescription(taskForm.getDescription());
        task.setAttachmentPaths(taskForm.getAttachmentPaths());
        task.setDueDate(new SimpleDateFormat("yyyy-MM-dd").parse(taskForm.getDueDate()));
        task.setProject(projectService.getProjectById(projectId));
        task.setTaskCategory(taskCategoryService.getTaskCategory(taskForm.getCategoryId()));
        task.setTaskPriority(taskPriorityService.getTaskPriorityById(taskForm.getPriorityId()));
        Task taskRes = taskService.createTask(task);

        TaskAssignable taskAssignable = new TaskAssignable();
        taskAssignable.setTask(task);
        taskAssignable.setPartyId(UUID.fromString(taskForm.getPartyId()));
        taskAssignableService.create(taskAssignable);

        return ResponseEntity.ok(taskRes);
    }

    @GetMapping("/task-categories")
    public ResponseEntity<Object> getListCategories(){
        return ResponseEntity.ok(taskCategoryService.getAllTaskCategory());
    }

    @GetMapping("/task-priorities")
    public ResponseEntity<Object> getListPriorities(){
        return ResponseEntity.ok(taskPriorityService.getAll());
    }

    @GetMapping("/task-persons")
    public ResponseEntity<Object> getListPersons(){
        return ResponseEntity.ok(personService.getALL());
    }
}
