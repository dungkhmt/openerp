package com.hust.baseweb.applications.chat.chatvoice.repositoty;

import java.util.List;
import java.util.Optional;

import com.hust.baseweb.applications.chat.chatvoice.model.Room;
import com.hust.baseweb.applications.chat.chatvoice.model.RoomParticipant;
import com.hust.baseweb.entity.UserLogin;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface RoomParticipantRepository extends JpaRepository<RoomParticipant, Long> {

  @Query("SELECT r.participant, r.peerId FROM RoomParticipant r WHERE r.room = ?1 AND r.isActive = '1'")
  List<Object[]> getAllParticipantInThisRoom(Room room);

  @Transactional
  @Modifying
  @Query("UPDATE RoomParticipant r SET r.isActive = '0' WHERE r.room = ?1 AND r.participant = ?2")
  void outMeet(Room room, UserLogin participant);

  @Transactional
  @Modifying
  @Query("UPDATE RoomParticipant r SET r.isActive = '1', r.peerId = ?2 WHERE r = ?1")
  void updatePeer(RoomParticipant p, String peerId);

  @Query("SELECT r from RoomParticipant r WHERE r.participant = :participant AND r.room = :room")
  Optional<RoomParticipant> findByParticipantAndRoom(UserLogin participant, Room room);

  @Query("SELECT u.userLoginId from UserLogin u WHERE u.userLoginId LIKE concat('%', :searchString, '%') AND u NOT IN (SELECT r.participant FROM RoomParticipant r WHERE r.isInvited = false AND r.room = :room)")
  Page<String> searchUsersById(Pageable page, String searchString, Room room);

  @Query("SELECT p.room.id, p.room.roomName, p.room.openIn, p.room.closeIn FROM RoomParticipant p WHERE p.participant = :u AND p.isInvited = true")
  Page<Room> getListInvitedRoom(Pageable page, UserLogin u);

  @Query("SELECT r.participant.userLoginId FROM RoomParticipant r WHERE r.room = :r AND isInvited = true")
  Page<String> getInvitedFriends(Pageable page, Room r);
}
