package com.hust.baseweb.applications.chat.chatvoice.service;

import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.hust.baseweb.applications.chat.chatvoice.model.Room;
import com.hust.baseweb.applications.chat.chatvoice.repositoty.RoomRepository;
import com.hust.baseweb.entity.UserLogin;
import com.hust.baseweb.service.UserService;

@Service
public class RoomService {
  private String unnamedRoom = "Unnamed";

  private final RoomRepository roomRepository;
  private final UserService userService;

  @Autowired
  public RoomService(RoomRepository roomRepository, UserService userService) {
    this.roomRepository = roomRepository;
    this.userService = userService;
  }

  public Room findByRoomId(UUID id) {
    return roomRepository.findById(id);
  }

  public Page<Room> getAllRoomsOfThisUser(Pageable page, String hostId) {
    UserLogin host = userService.findById(hostId);
    return roomRepository.findAllRoomsOfThisUser(page, host, unnamedRoom);
  }

  public String addNewRoom(String hostId, Room room) {
    UUID id = UUID.randomUUID();
    UserLogin host = userService.findById(hostId);
    room.setHost(host);
    room.setId(id);
    roomRepository.save(room);
    return id.toString();
  }

  public void deleteRoom(String hostId, Room room) {
    UserLogin host = userService.findById(hostId);
    UUID id = room.getId();
    Room r = roomRepository.findById(id);
    if (r.getHost() == host) {
      r.setIsDeleted(true);
      roomRepository.save(r);
    }
  }

  public void updateRoom(String hostId, Room room) {
    UserLogin host = userService.findById(hostId);
    UUID id = room.getId();
    Room r = roomRepository.findById(id);
    if (r.getHost() == host) {
      Date newOpenIn = room.getOpenIn();
      Date newCloseIn = room.getCloseIn();
      String newRoomName = room.getRoomName();
      if (newOpenIn != null) {
        r.setOpenIn(newOpenIn);
      }
      if (newCloseIn != null) {
        r.setCloseIn(newCloseIn);
      }
      if (newRoomName != null) {
        r.setRoomName(newRoomName);
      }
      roomRepository.save(r);
    }
  }
}
