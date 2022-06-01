package com.hust.baseweb.applications.whiteboard.entity;

import com.hust.baseweb.entity.UserLogin;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "user_whiteboard")
public class UserWhiteboard {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserLogin userLogin;

    @ManyToOne
    @JoinColumn(name = "whiteboard_id")
    private Whiteboard whiteboard;
}
