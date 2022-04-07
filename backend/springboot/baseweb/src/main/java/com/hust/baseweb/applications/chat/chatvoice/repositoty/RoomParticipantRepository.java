package com.hust.baseweb.applications.chat.chatvoice.repositoty;


import java.util.List;
import java.util.Optional;

import com.hust.baseweb.applications.chat.chatvoice.model.Room;
import com.hust.baseweb.applications.chat.chatvoice.model.RoomParticipant;
import com.hust.baseweb.entity.UserLogin;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface RoomParticipantRepository extends JpaRepository<RoomParticipant, Long> {

  @Query("SELECT r.participant, r.peerId FROM RoomParticipant r WHERE r.room = ?1")
  List<Object[]> getAllParticipantInThisRoom(Room room);

  @Transactional
  @Modifying
  @Query("DELETE FROM RoomParticipant r WHERE r.room = ?1 AND r.participant = ?2")
  void outMeet(Room room, UserLogin participant);
}
