package com.hust.baseweb.applications.chat.chatvoice.controller;

import java.security.Principal;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hust.baseweb.applications.chat.chatvoice.model.Room;
import com.hust.baseweb.applications.chat.chatvoice.service.RoomService;

@RestController
@RequestMapping("room")
public class RoomController {

  private final RoomService roomService;

  @Autowired
  public RoomController(RoomService roomService) {
    this.roomService = roomService;
  }

  @GetMapping("/name")
  public ResponseEntity<?> getNameOfThisUser(Principal principal) {
    return ResponseEntity.ok().body(principal.getName());
  }

  @GetMapping(path = "/all")
  public ResponseEntity<?> getAllRoomsOfThisUser(Principal principal, Pageable page) {
    String hostId = principal.getName();
    return ResponseEntity.ok().body(roomService.getAllRoomsOfThisUser(page, hostId));
  }

  @PostMapping("/create")
  public ResponseEntity<?> createRoom(Principal principal, @RequestBody Room room) {
    String hostId = principal.getName();
    String roomId = roomService.addNewRoom(hostId, room);
    HashMap<String, String> res = new HashMap<>();
    res.put("success", "true");
    res.put("roomId", roomId);
    return ResponseEntity.ok().body(res);
  }

  @DeleteMapping("")
  public ResponseEntity<?> deleteRoom(Principal principal, @RequestBody Room room) {
    String hostId = principal.getName();
    roomService.deleteRoom(hostId, room);
    return ResponseEntity.ok().build();
  }

  @PutMapping("")
  public ResponseEntity<?> updateRoom(Principal principal, @RequestBody Room room) {
    String hostId = principal.getName();
    roomService.updateRoom(hostId, room);
    return ResponseEntity.ok().build();
  }
}
