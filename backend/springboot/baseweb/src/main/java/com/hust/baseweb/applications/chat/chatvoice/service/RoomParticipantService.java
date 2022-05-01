package com.hust.baseweb.applications.chat.chatvoice.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import com.hust.baseweb.applications.chat.chatvoice.model.Room;
import com.hust.baseweb.applications.chat.chatvoice.model.RoomParticipant;
import com.hust.baseweb.applications.chat.chatvoice.repositoty.RoomParticipantRepository;
import com.hust.baseweb.applications.chat.chatvoice.repositoty.RoomRepository;
import com.hust.baseweb.entity.UserLogin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class RoomParticipantService {

  private final RoomParticipantRepository roomParticipantRepository;
  private final RoomRepository roomRepository;

  @Autowired
  public RoomParticipantService(RoomParticipantRepository roomParticipantRepository, RoomRepository roomRepository) {
    this.roomParticipantRepository = roomParticipantRepository;
    this.roomRepository = roomRepository;
  }

  public String addOrUpdateParticipant(Room room, UserLogin participant, String peerId) {
    Optional<RoomParticipant> rParticipant = roomParticipantRepository.findByParticipantAndRoom(participant, room);
    if (rParticipant.isPresent()) {
      RoomParticipant p = rParticipant.get();
      p.setPeerId(peerId);
      roomParticipantRepository.save(p);
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

  public List<Map<String, String>> getAllParticipantInThisRoom(Room room) {
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

  public void inviteParticipant(Room r, UserLogin userLogin) {
    Optional<RoomParticipant> rParticipant = roomParticipantRepository.findByParticipantAndRoom(userLogin, r);
    if (rParticipant.isPresent()) {
      rParticipant.get().setIsInvited(true);
      roomParticipantRepository.save(rParticipant.get());
    } else {
      UUID uuid = UUID.randomUUID();
      System.out.println(userLogin.getUserLoginId());
      RoomParticipant roomParticipant = new RoomParticipant(uuid, userLogin, r);
      roomParticipant.setIsInvited(true);
      roomParticipantRepository.save(roomParticipant);
    }
  }

  public Page<String> searchUsersById(Pageable page, String searchString, Room room) {
    return roomParticipantRepository.searchUsersById(page, searchString, room);
  }

  public Page<Room> getListInvitedRoom(Pageable page, UserLogin u) {
    return roomParticipantRepository.getListInvitedRoom(page, u);
  }
}
