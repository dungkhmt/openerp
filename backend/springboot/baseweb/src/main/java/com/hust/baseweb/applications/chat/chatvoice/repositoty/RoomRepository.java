package com.hust.baseweb.applications.chat.chatvoice.repositoty;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hust.baseweb.applications.chat.chatvoice.model.Room;
import com.hust.baseweb.entity.UserLogin;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

  public Room findById(UUID id);
  
  @Query("SELECT r.roomName, r.openIn, r.closeIn FROM Room r WHERE r.host = ?1 AND r.isDeleted = false AND r.roomName != ?2")
  List<?> findAllRoomsOfThisUser(UserLogin host, String unnamedRoom);
}

