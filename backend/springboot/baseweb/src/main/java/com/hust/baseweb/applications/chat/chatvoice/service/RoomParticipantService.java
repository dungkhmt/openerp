package com.hust.baseweb.applications.chat.chatvoice.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import com.hust.baseweb.applications.chat.chatvoice.model.Room;
import com.hust.baseweb.applications.chat.chatvoice.model.RoomParticipant;
import com.hust.baseweb.applications.chat.chatvoice.repositoty.RoomParticipantRepository;
import com.hust.baseweb.entity.UserLogin;
import com.hust.baseweb.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class RoomParticipantService {

  private String unnamedRoom = "Unnamed";
  private final RoomParticipantRepository roomParticipantRepository;
  private final RoomService roomService;
  private final UserService userService;

  @Autowired
  public RoomParticipantService(RoomParticipantRepository roomParticipantRepository, RoomService roomService,
      UserService userService) {
    this.roomParticipantRepository = roomParticipantRepository;
    this.roomService = roomService;
    this.userService = userService;
  }

  public String addOrUpdateParticipant(Room room, UserLogin participant, String peerId) {
    Optional<RoomParticipant> rParticipant = roomParticipantRepository.findByParticipantAndRoom(participant, room);
    if (rParticipant.isPresent()) {
      RoomParticipant p = rParticipant.get();
      roomParticipantRepository.updatePeer(p, peerId);
      return p.getId().toString();
    } else {
      UUID id = UUID.randomUUID();
      RoomParticipant roomParticipant = new RoomParticipant(id, room, participant, peerId);
      roomParticipantRepository.saveAndFlush(roomParticipant);
      return id.toString();
    }
  }

  public void outMeet(Room room, UserLogin participant) {
    roomParticipantRepository.outMeet(room, participant);
  }

  public List<Map<String, String>> getAllParticipantInThisRoom(String roomId) {
    Room room = roomService.findByRoomId(UUID.fromString(roomId));
    List<Object[]> listParticipant = roomParticipantRepository.getAllParticipantInThisRoom(room);
    List<Map<String, String>> res = new ArrayList<>();
    for (Object[] obj : listParticipant) {
      Map<String, String> map = new HashMap<>();
      map.put("peerId", (String) obj[1]);
      UserLogin participant = UserLogin.class.cast(obj[0]);
      map.put("participantId", participant.getUserLoginId());
      res.add(map);
    }
    return res;
  }

  public void inviteParticipant(UUID roomId, String userId) {
    Room r = roomService.findByRoomId(roomId);
    UserLogin userLogin = userService.findById(userId);
    Optional<RoomParticipant> rParticipant = roomParticipantRepository.findByParticipantAndRoom(userLogin, r);
    if (rParticipant.isPresent()) {
      rParticipant.get().setIsInvited(true);
      roomParticipantRepository.save(rParticipant.get());
    } else {
      UUID uuid = UUID.randomUUID();
      RoomParticipant roomParticipant = new RoomParticipant(uuid, userLogin, r);
      roomParticipant.setIsInvited(true);
      roomParticipantRepository.save(roomParticipant);
    }
  }

  public Page<String> searchUsersById(Pageable page, String searchString, String roomId) {
    Room room = roomService.findByRoomId(UUID.fromString(roomId));
    return roomParticipantRepository.searchUsersById(page, searchString, room);
  }

  public Page<Room> getListInvitedRoom(Pageable page, String userId) {
    UserLogin u = userService.findById(userId);
    Page<Room> pageRoom = roomParticipantRepository.getListInvitedRoom(page, u, unnamedRoom);
    pageRoom.forEach((room) -> {
      room.setHost(null);
    });
    return pageRoom;
  }

  public Page<Room> getListPresentRoom(Pageable page, String userId) {
    UserLogin u = userService.findById(userId);
    LocalDateTime currentTime = LocalDateTime.now();
    Date now = Date.from(currentTime.atZone(ZoneId.systemDefault()).toInstant());
    Page<Room> pageRoom = roomParticipantRepository.getListPresentRoom(page, u, now, unnamedRoom);
    pageRoom.forEach((room) -> {
      room.setHost(null);
    });
    return pageRoom;
  }

  public Page<String> getInvitedFriends(Pageable page, String roomId) {
    UUID _roomId = UUID.fromString(roomId);
    Room r = roomService.findByRoomId(_roomId);
    return roomParticipantRepository.getInvitedFriends(page, r);
  }
}
