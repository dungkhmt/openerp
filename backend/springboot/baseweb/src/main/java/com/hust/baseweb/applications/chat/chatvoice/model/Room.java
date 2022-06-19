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

  @Column(name = "room_name", columnDefinition = "TEXT default 'Unnamed'")
  private String roomName = "Unnamed";

  @Column(name = "open_in")
  private Date openIn;

  @Column(name = "close_in")
  private Date closeIn;

  @Column(name = "is_deleted", columnDefinition = "BOOLEAN default false")
  private Boolean isDeleted = false;

  public Room() {

  }

  public Room(String roomName) {
    this.roomName = roomName;
  }

  public Room(UUID id) {
    this.id = id;
  }

  public Room(UUID id, UserLogin host, String roomName) {
    this.id = id;
    this.host = host;
    this.roomName = roomName;
  }

  public Room(UUID id, UserLogin host) {
    this.id = id;
    this.host = host;
  }

  public Room(UUID id, String roomName, Date openIn, Date closeIn) {
    this.id = id;
    this.roomName = roomName;
    this.openIn = openIn;
    this.closeIn = closeIn;
  }

  public Room(UUID id, UserLogin host, String roomName, Date openIn, Date closeIn) {
    this.id = id;
    this.host = host;
    this.roomName = roomName;
    this.openIn = openIn;
    this.closeIn = closeIn;
  }

  @Override
  public String toString() {
    return this.roomName + "     " + this.closeIn + "     " + this.openIn;
  }
}
