package com.hust.baseweb.applications.chat.chatvoice.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.hust.baseweb.applications.chat.chatvoice.model.Room;
import com.hust.baseweb.applications.chat.chatvoice.service.RoomParticipantService;
import com.hust.baseweb.applications.chat.chatvoice.service.RoomService;
import com.hust.baseweb.entity.UserLogin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("roomParticipant")
public class RoomParticipantController {
  
  private final RoomParticipantService roomParticipantService;
  private final RoomService roomService;

  @Autowired
  public RoomParticipantController(RoomParticipantService roomParticipantService, RoomService roomService) {
    this.roomParticipantService = roomParticipantService;
    this.roomService = roomService;
  }

  @GetMapping("/getParticipants")
  public ResponseEntity<?> getAllParticipantsInThisRoom(@RequestParam String roomId) {
    Room room = roomService.findByRoomId(UUID.fromString(roomId));
    List<Map<String, String>>listParticipant = roomParticipantService.getAllParticipantInThisRoom(room);
    return ResponseEntity.ok().body(listParticipant);
  }
}
