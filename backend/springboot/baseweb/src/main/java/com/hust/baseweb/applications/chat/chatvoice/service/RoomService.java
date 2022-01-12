package com.hust.baseweb.applications.chat.chatvoice.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hust.baseweb.applications.chat.chatvoice.model.Room;
import com.hust.baseweb.applications.chat.chatvoice.repositoty.RoomRepository;
import com.hust.baseweb.entity.UserLogin;

@Service
public class RoomService {
  
  private final RoomRepository roomRepository;

  @Autowired
  public RoomService(RoomRepository roomRepository) {
    this.roomRepository = roomRepository;
  }

  public Room findByRoomId(UUID id) {
    return roomRepository.findById(id);
  }

  public Optional<Room> getAllRoomsOfThisUser(String userId) {
    return roomRepository.findAllRoomsOfThisUser(userId);
  }

  public String addNewRoom(UserLogin host, String roomName) {
    UUID id = UUID.randomUUID();
    Room room = new Room(id, host, roomName);
    roomRepository.save(room);
    return id.toString();
  }
}
