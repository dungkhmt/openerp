package com.hust.baseweb.applications.chat.chatvoice.controller;

import com.hust.baseweb.applications.chat.chatvoice.model.Room;
import com.hust.baseweb.applications.chat.chatvoice.service.RoomParticipantService;
import com.hust.baseweb.applications.chat.chatvoice.service.RoomService;
import com.hust.baseweb.entity.UserLogin;
import com.hust.baseweb.service.UserService;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WebSocketController {

  private final RoomService roomService;
  private final RoomParticipantService roomParticipantService;
  private final UserService userService;

  @Autowired
  public WebSocketController(RoomParticipantService roomParticipantService, UserService userService,
      RoomService roomService) {
    this.roomParticipantService = roomParticipantService;
    this.userService = userService;
    this.roomService = roomService;
  }

  @Transactional
  @MessageMapping("/{roomId}")
  @SendTo("/topic/chat/{roomId}")
  public Map<String, String> handleMessage(@Payload Map<String, String> message, @DestinationVariable UUID roomId) {
    HashMap<String, String> response = new HashMap<>();
    response.put("time", Long.toString(System.currentTimeMillis()));
    UserLogin participant = userService.findById(message.get("name"));
    Room room = roomService.findByRoomId(roomId);
    switch (message.get("type")) {
      case "chat": {
        response.put("id", message.get("id"));
        response.put("name", message.get("name"));
        response.put("content", message.get("content"));
        return response;
      }
      case "file": {
        response.put("id", message.get("id"));
        response.put("name", message.get("name"));
        response.put("fileUrl", message.get("url"));
        response.put("fileType", message.get("fileType"));
        return response;
      }
      case "join": {
        roomParticipantService.addOrUpdateParticipant(room, participant, message.get("content"));
        response.put("id", "0");
        response.put("content", "{ \"id\": \"" + message.get("id") + "\", \"name\": \"" + message.get("name")
            + "\", \"type\": \"" + message.get("type") + "\", \"peerId\": \"" + message.get("content") + "\" }");
        return response;
      }
      case "leave": {
        roomParticipantService.outMeet(room, participant);
        response.put("id", "0");
        response.put("content", "{ \"id\": \"" + message.get("id") + "\", \"name\": \"" + message.get("name")
            + "\", \"type\": \"" + message.get("type") + "\" }");
        return response;
      }
      default:
        break;
    }
    return message;
  }
}
