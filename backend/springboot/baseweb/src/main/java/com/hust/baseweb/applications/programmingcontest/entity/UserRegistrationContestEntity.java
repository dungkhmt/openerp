package com.hust.baseweb.applications.programmingcontest.entity;

import lombok.*;

import javax.persistence.*;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
//@Table(name = "user_registration_contest")
@Table(name = "user_registration_contest_new")
public class UserRegistrationContestEntity {
    public static final String ROLE_MANAGER = "MANAGER";
    public static final String ROLE_PARTICIPANT = "PARTICIPANT";
    public static final String ROLE_OWNER = "OWNER";

    @Id
    @Column(name = "user_registration_contest_id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

//    @JoinColumn(name = "user_id", referencedColumnName = "user_login_id")
//    @ManyToOne(fetch = FetchType.LAZY)
//    private UserLogin userLogin;

    @Column(name = "user_id")
    private String userId;

//    @JoinColumn(name = "contest_id", referencedColumnName = "contest_id")
//    @ManyToOne(fetch = FetchType.LAZY)
//    private ContestEntity contest;

    @Column(name = "contest_id")
    private String contestId;

    @Column(name = "status")
    private String status;

    @Column(name="role_id")
    private String roleId;
}
