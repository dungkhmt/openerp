package com.hust.baseweb.applications.chat.chatvoice.repositoty;


import java.util.List;
import java.util.Optional;

import com.hust.baseweb.applications.chat.chatvoice.model.Room;
import com.hust.baseweb.applications.chat.chatvoice.model.RoomParticipant;
import com.hust.baseweb.entity.UserLogin;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomParticipantRepository extends JpaRepository<RoomParticipant, Long> {

  @Query("SELECT r.participant, r.peerId FROM RoomParticipant r WHERE r.room = ?1")
  List<Object[]> getAllParticipantInThisRoom(Room room);

  @Query("UPDATE RoomParticipant r SET r.isActive = '0' WHERE r.room = ?1 AND r.participant = ?2")
  Optional<RoomParticipant> outMeet(Room room, UserLogin participant);
}
