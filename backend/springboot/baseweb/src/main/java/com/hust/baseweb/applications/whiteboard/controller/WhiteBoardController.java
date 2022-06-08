package com.hust.baseweb.applications.whiteboard.controller;

import com.hust.baseweb.applications.whiteboard.model.*;
import com.hust.baseweb.applications.whiteboard.service.WhiteboardServiceImpl;
import com.hust.baseweb.entity.UserLogin;
import com.hust.baseweb.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class WhiteBoardController {
    private UserService userService;
    private WhiteboardServiceImpl whiteboardService;

    @PostMapping("/whiteboards")
    public void createWhiteboard(
        Principal principal,
        @RequestBody CreateWhiteboardModel input){

        UserLogin u = userService.findById(principal.getName());
        whiteboardService.createWhiteboard(u.getUserLoginId(), input.getWhiteboardId(), input.getClassSessionId());
    }

    @GetMapping("/whiteboards/{sessionId}")
    public ResponseEntity<List<GetListWhiteboardModel>> getWhiteboards(
        @PathVariable UUID sessionId){

        List<GetListWhiteboardModel> getListWhiteboardModels = whiteboardService.getWhiteboards(sessionId);

        return ResponseEntity.ok().body(getListWhiteboardModels);
    }

    @PostMapping("/whiteboards/save")
    public void saveWhiteboardsData(
        @RequestBody SaveWhiteboardDataModel input,
        Principal principal){

        UserLogin u = userService.findById(principal.getName());
        whiteboardService.saveWhiteboardData(input, u.getUserLoginId());
    }

    @GetMapping("/whiteboards/detail/{whiteboardId}")
    public ResponseEntity<WhiteboardDetailModel> getWhiteboardDetail(
        @PathVariable String whiteboardId){

        WhiteboardDetailModel whiteboardDetail = whiteboardService.getWhiteboardDetail(whiteboardId);
        return ResponseEntity.ok().body(whiteboardDetail);
    }

    @PutMapping("/whiteboards/add-user/{whiteboardId}")
    public void addUserToWhiteboard(
        @PathVariable String whiteboardId, Principal principal){

        UserLogin userLogin = userService.findById(principal.getName());
        whiteboardService.addUserToWhiteboard(whiteboardId, userLogin);
    }

}
