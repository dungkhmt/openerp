package com.hust.baseweb.applications.chat.chatvoice.model;

import java.util.UUID;

import javax.persistence.*;

import com.hust.baseweb.entity.UserLogin;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "room_participant")
@Getter
@Setter
public class RoomParticipant {
  @Id
  private UUID id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "room_id", referencedColumnName = "id")
  private Room room;

  @ManyToOne(optional = false)
  @JoinColumn(name = "participant_id", referencedColumnName = "user_login_id")
  private UserLogin participant;

  @Column(name = "peer_id", nullable = true)
  private String peerId;

  @Column(name = "is_active")
  private String isActive;

  @Column(name = "is_invited")
  private Boolean isInvited;

  public RoomParticipant() {

  }

  public RoomParticipant(UUID id, Room room, UserLogin participant, String peerId) {
    this.id = id;
    this.room = room;
    this.participant = participant;
    this.peerId = peerId;
    this.isActive = "1";
    this.isInvited = false;
  }

  public RoomParticipant(UUID id, UserLogin participant, Room room) {
    this.id = id;
    this.room = room;
    this.participant = participant;
    this.isActive = "0";
  }

  public RoomParticipant(UserLogin participant, Room room) {
    this.room = room;
    this.participant = participant;
    this.isActive = "0";
  }

  @Override
  public String toString() {
    return room.getId() + "    " + participant.getUserLoginId();
  }
}
