package com.hust.baseweb.applications.chat.chatvoice.repositoty;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hust.baseweb.applications.chat.chatvoice.model.Room;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

  public Room findById(UUID id);
  
  @Query("SELECT r FROM Room r WHERE r.host = ?1")
  Optional<Room> findAllRoomsOfThisUser(String userId);
}

