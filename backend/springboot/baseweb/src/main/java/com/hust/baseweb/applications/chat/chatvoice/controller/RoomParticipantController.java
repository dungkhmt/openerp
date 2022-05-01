package com.hust.baseweb.applications.chat.chatvoice.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.hust.baseweb.applications.chat.chatvoice.model.Room;
import com.hust.baseweb.applications.chat.chatvoice.service.RoomParticipantService;
import com.hust.baseweb.applications.chat.chatvoice.service.RoomService;
import com.hust.baseweb.entity.UserLogin;
import com.hust.baseweb.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("roomParticipant")
public class RoomParticipantController {

  private final RoomParticipantService roomParticipantService;
  private final RoomService roomService;
  private final UserService userService;

  @Autowired
  public RoomParticipantController(RoomParticipantService roomParticipantService, RoomService roomService,
      UserService userService) {
    this.roomParticipantService = roomParticipantService;
    this.roomService = roomService;
    this.userService = userService;
  }

  @GetMapping("/getParticipants")
  public ResponseEntity<?> getAllParticipantsInThisRoom(@RequestParam String roomId) {
    Room room = roomService.findByRoomId(UUID.fromString(roomId));
    List<Map<String, String>> listParticipant = roomParticipantService.getAllParticipantInThisRoom(room);
    return ResponseEntity.ok().body(listParticipant);
  }

  @PostMapping("/invite")
  public ResponseEntity<?> inviteParticipant(@RequestBody HashMap<String, String> roomParticipant) {
    UUID roomId = UUID.fromString(roomParticipant.get("roomId"));
    String userLoginId = roomParticipant.get("userLoginId");
    Room r = roomService.findByRoomId(roomId);
    UserLogin userLogin = userService.findById(userLoginId);
    roomParticipantService.inviteParticipant(r, userLogin);
    return ResponseEntity.ok().build();
  }

  @GetMapping(path = "/searchToInviteById")
  public ResponseEntity<?> searchUsersById(Pageable page, @RequestParam String searchString,
      @RequestParam String roomId) {
    Room room = roomService.findByRoomId(UUID.fromString(roomId));
    return ResponseEntity.ok().body(
        roomParticipantService.searchUsersById(page, searchString, room));
  }

  @GetMapping(path = "/getListInvitedRoom")
  public ResponseEntity<?> getListInvitedRoom(Principal principal, Pageable page) {
    UserLogin u = userService.findById(principal.getName());
    return ResponseEntity.ok().body(roomParticipantService.getListInvitedRoom(page, u));
  }
}
