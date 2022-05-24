package com.hust.baseweb.applications.taskmanagement.entity;

import com.hust.baseweb.entity.Party;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "backlog_project_member")
public class ProjectMember {

    @EmbeddedId
    private ProjectMemberId id;

//    @ManyToOne
//    @JoinColumn(name = "backlog_project_id")
//    private Project project;
//
//    @ManyToOne
//    @JoinColumn(name = "member_party_id")
//    private Party partyMember;

    @CreationTimestamp
    @Column(name = "created_stamp")
    private Date createdStamp;
}
