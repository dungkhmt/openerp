package com.hust.baseweb.applications.taskmanagement.entity;

import com.hust.baseweb.entity.UserLogin;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.util.Date;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "backlog_task_execution")
public class TaskExecution {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "task_execution_id")
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;

    @Column(name = "created_by_user_login_id")
    private String createdByUserLoginId;

    @Column(name = "execution_tags")
    private String executionTags;

    @Column(name = "execution_changed_fields")
    private String executionChangedFields;

    @Column(name = "comment")
    private String comment;

    @CreationTimestamp
    @Column(name = "created_stamp")
    private Date createdStamp;

    @Column(name = "project_id")
    private UUID projectId;
}
