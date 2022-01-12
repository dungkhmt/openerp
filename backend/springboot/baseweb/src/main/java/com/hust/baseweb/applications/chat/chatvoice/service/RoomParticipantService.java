package com.hust.baseweb.applications.chat.chatvoice.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.hust.baseweb.applications.chat.chatvoice.model.Room;
import com.hust.baseweb.applications.chat.chatvoice.model.RoomParticipant;
import com.hust.baseweb.applications.chat.chatvoice.repositoty.RoomParticipantRepository;
import com.hust.baseweb.entity.UserLogin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoomParticipantService {
  
  private final RoomParticipantRepository roomParticipantRepository;

  @Autowired
  public RoomParticipantService(RoomParticipantRepository roomParticipantRepository) {
    this.roomParticipantRepository = roomParticipantRepository;
  }
  
  public String addParticipant(Room room, UserLogin participant, String peerId) {
    UUID id = UUID.randomUUID();
    RoomParticipant roomParticipant = new RoomParticipant(id, room, participant, peerId);
    roomParticipantRepository.saveAndFlush(roomParticipant);
    return id.toString();
  }

  public void outMeet(Room room, UserLogin participant) {
    roomParticipantRepository.outMeet(room, participant);
  }

  public List<Map<String, String>> getAllParticipantInThisRoom(Room room) {
    List<Object[]> listParticipant = roomParticipantRepository.getAllParticipantInThisRoom(room);
    List<Map<String, String>> res = new ArrayList<>();
    for(Object[] obj: listParticipant) {
      Map<String, String> map = new HashMap<>();
      map.put("peerId", (String) obj[1]);
      UserLogin participant = UserLogin.class.cast(obj[0]);
      map.put("participantId", participant.getUserLoginId());
      res.add(map);
    }
    return res;
  }
}
