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

@Service
public class RoomService {
  private String unnamedRoom = "Unnamedaaaa";

  private final RoomRepository roomRepository;

  @Autowired
  public RoomService(RoomRepository roomRepository) {
    this.roomRepository = roomRepository;
  }

  public Room findByRoomId(UUID id) {
    return roomRepository.findById(id);
  }

  public Page<Room> getAllRoomsOfThisUser(Pageable page, UserLogin host) {
    return roomRepository.findAllRoomsOfThisUser(page, host, unnamedRoom);
  }

  public String addNewRoom(UserLogin host, Room room) {
    UUID id = UUID.randomUUID();
    room.setHost(host);
    room.setId(id);
    roomRepository.save(room);
    return id.toString();
  }

  public void deleteRoom(UserLogin host, Room room) {
    UUID id = room.getId();
    Room r = roomRepository.findById(id);
    if (r.getHost() == host) {
      r.setIsDeleted(true);
      roomRepository.save(r);
    }
  }

  public void updateRoom(UserLogin host, Room room) {
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
