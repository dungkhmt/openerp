package com.hust.baseweb.applications.whiteboard.service;

import com.hust.baseweb.applications.whiteboard.model.GetListWhiteboardModel;
import com.hust.baseweb.applications.whiteboard.model.SaveWhiteboardDataModel;
import com.hust.baseweb.applications.whiteboard.model.WhiteboardDetailModel;
import com.hust.baseweb.entity.UserLogin;

import java.util.List;
import java.util.UUID;

public interface WhiteboardService {
    void createWhiteboard(String userId, String whiteboardId, UUID classSessionId);
    List<GetListWhiteboardModel> getWhiteboards(UUID sessionId);

    void saveWhiteboardData(SaveWhiteboardDataModel input, String userId);

    WhiteboardDetailModel getWhiteboardDetail(String id);

    void addUserToWhiteboard(String whiteboardId, UserLogin userLogin);
}
