package com.hust.baseweb.applications.chat.chatvoice.model;

import java.util.Date;
import java.util.UUID;

import javax.persistence.*;

import com.hust.baseweb.entity.UserLogin;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "room")
public class Room {
  @Id
  private UUID id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "host_id", referencedColumnName = "user_login_id")
  private UserLogin host;
  
  @Column(name = "room_name")
  private String roomName;

  @Column(name = "open_in")
  private Date openIn;

  @Column(name = "close_in")
  private Date closeIn;

  public Room() {

  }

  public Room(String roomName) {
    this.roomName = roomName;
  }

  public Room(UUID id, UserLogin host, String roomName) {
    this.id = id;
    this.host = host;
    this.roomName = roomName;
  }

  public Room(UUID id, UserLogin host, String roomName, Date openIn, Date closeIn) {
    this.id = id;
    this.host = host;
    this.roomName = roomName;
    this.openIn = openIn;
    this.closeIn = closeIn;
  } 
}
