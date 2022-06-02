package com.hust.baseweb.applications.whiteboard.service;

import com.hust.baseweb.applications.whiteboard.model.GetListWhiteboardModel;
import com.hust.baseweb.applications.whiteboard.model.SaveWhiteboardDataModel;
import com.hust.baseweb.applications.whiteboard.model.WhiteboardDetailModel;
import com.hust.baseweb.entity.UserLogin;

import java.util.List;

public interface WhiteboardService {
    void createWhiteboard(String userId, String whiteboardId);
    List<GetListWhiteboardModel> getWhiteboards(UserLogin userLogin);

    void saveWhiteboardData(SaveWhiteboardDataModel input, String userId);

    WhiteboardDetailModel getWhiteboardDetail(String id);

    void addUserToWhiteboard(String whiteboardId, UserLogin userLogin);
}
