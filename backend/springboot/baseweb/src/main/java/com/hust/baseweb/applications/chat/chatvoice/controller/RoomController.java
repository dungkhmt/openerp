package com.hust.baseweb.applications.chat.chatvoice.controller;

import java.security.Principal;
import java.util.Date;
import java.util.HashMap;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hust.baseweb.applications.chat.chatvoice.model.Room;
import com.hust.baseweb.applications.chat.chatvoice.service.RoomService;
import com.hust.baseweb.entity.UserLogin;
import com.hust.baseweb.service.UserService;

@RestController
@RequestMapping("room")
public class RoomController {
  
  private final RoomService roomService;
  private final UserService userService;

  @Autowired
  public RoomController(RoomService roomService, UserService userService) {
    this.roomService = roomService;
    this.userService = userService;
  }

  @GetMapping("/all")
  public ResponseEntity<?> getAllRoomsOfThisUser(Principal principal) {
    Optional<?> listRoom = roomService.getAllRoomsOfThisUser(principal.getName());
    return ResponseEntity.ok().body(listRoom);
  }

  @PostMapping("/create")
  public ResponseEntity<?> createRoom(Principal principal, @RequestBody Room room) {
    UserLogin host = userService.findById(principal.getName());
    String roomId = roomService.addNewRoom(host, room.getRoomName());
    HashMap<String, String> res = new HashMap<>();
    res.put("success", "true");
    res.put("roomId", roomId);
    return ResponseEntity.ok().body(res);
  }

  @GetMapping("/name")
  public ResponseEntity<?> getNameOfThisUser(Principal principal) {
    return ResponseEntity.ok().body(principal.getName());
  }
}
