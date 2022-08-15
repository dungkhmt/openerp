package com.hust.baseweb.applications.chat.chatvoice.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.hust.baseweb.applications.chat.chatvoice.service.RoomParticipantService;

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

  @Autowired
  public RoomParticipantController(RoomParticipantService roomParticipantService) {
    this.roomParticipantService = roomParticipantService;
  }

  @GetMapping("/getParticipants")
  public ResponseEntity<?> getAllParticipantsInThisRoom(@RequestParam String roomId) {
    List<Map<String, String>> listParticipant = roomParticipantService.getAllParticipantInThisRoom(roomId);
    return ResponseEntity.ok().body(listParticipant);
  }

  @PostMapping("/invite")
  public ResponseEntity<?> inviteParticipant(@RequestBody HashMap<String, String> roomParticipant) {
    UUID roomId = UUID.fromString(roomParticipant.get("roomId"));
    String userId = roomParticipant.get("userLoginId");
    roomParticipantService.inviteParticipant(roomId, userId);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/invitedFriends")
  public ResponseEntity<?> getInvitedFriends(Pageable page, @RequestParam String roomId) {
    return ResponseEntity.ok().body(roomParticipantService.getInvitedFriends(page, roomId));
  }

  @GetMapping(path = "/searchToInviteById")
  public ResponseEntity<?> searchUsersById(Pageable page, @RequestParam String searchString,
      @RequestParam String roomId) {
    return ResponseEntity.ok().body(
        roomParticipantService.searchUsersById(page, searchString, roomId));
  }

  @GetMapping(path = "/getListInvitedRoom")
  public ResponseEntity<?> getListInvitedRoom(Principal principal, Pageable page) {
    String userId = principal.getName();
    return ResponseEntity.ok().body(roomParticipantService.getListInvitedRoom(page, userId));
  }

  @GetMapping(path = "/getListPresentMeet")
  public ResponseEntity<?> getListPresentRoom(Principal principal, Pageable page) {
    String userId = principal.getName();
    return ResponseEntity.ok().body(roomParticipantService.getListPresentRoom(page, userId));
  }
}
