package com.hust.baseweb.applications.whiteboard.controller;

import com.hust.baseweb.applications.whiteboard.entity.WhiteBoardData;
import com.hust.baseweb.applications.whiteboard.entity.Whiteboard;
import com.hust.baseweb.applications.whiteboard.model.CreateWhiteboardModel;
import com.hust.baseweb.applications.whiteboard.model.GetListWhiteboard;
import com.hust.baseweb.applications.whiteboard.model.SaveWhiteboardDataModel;
import com.hust.baseweb.applications.whiteboard.model.WhiteboardDetailModel;
import com.hust.baseweb.applications.whiteboard.service.WhiteboardServiceImpl;
import com.hust.baseweb.entity.UserLogin;
import com.hust.baseweb.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

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
        whiteboardService.createWhiteboard(u.getUserLoginId(), input.getWhiteboardId());
    }

    @GetMapping("/whiteboards")
    public ResponseEntity<List<GetListWhiteboard>> getWhiteboards(
        Principal principal){

        UserLogin u = userService.findById(principal.getName());
        List<GetListWhiteboard> getListWhiteboards = whiteboardService.getWhiteboards(u);

        return ResponseEntity.ok().body(getListWhiteboards);
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
