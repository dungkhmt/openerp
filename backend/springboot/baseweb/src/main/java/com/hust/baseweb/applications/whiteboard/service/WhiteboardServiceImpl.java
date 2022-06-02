package com.hust.baseweb.applications.whiteboard.service;

import com.hust.baseweb.applications.whiteboard.entity.UserWhiteboard;
import com.hust.baseweb.applications.whiteboard.entity.Whiteboard;
import com.hust.baseweb.applications.whiteboard.model.GetListWhiteboardModel;
import com.hust.baseweb.applications.whiteboard.model.SaveWhiteboardDataModel;
import com.hust.baseweb.applications.whiteboard.model.WhiteboardDetailModel;
import com.hust.baseweb.applications.whiteboard.repo.UserWhiteboardRepo;
import com.hust.baseweb.applications.whiteboard.repo.WhiteboardDataRepo;
import com.hust.baseweb.applications.whiteboard.repo.WhiteboardRepo;
import com.hust.baseweb.entity.UserLogin;
import com.hust.baseweb.repo.UserLoginRepo;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Log4j2
@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class WhiteboardServiceImpl implements  WhiteboardService {
    private WhiteboardRepo whiteboardRepo;
    private WhiteboardDataRepo whiteboardDataRepo;
    private UserWhiteboardRepo userWhiteboardRepo;
    private UserLoginRepo userLoginRepo;

    @Override
    public void createWhiteboard(String userId, String whiteboardId) {
        Whiteboard whiteboard = new Whiteboard();
        whiteboard.setId(whiteboardId);
        whiteboard.setName("Whiteboard" + whiteboardId);
        whiteboard.setTotalPage(1);
        whiteboard.setCreatedBy(userId);
        whiteboard.setCreatedDate(new Date());
        whiteboardRepo.save(whiteboard);
    }

    @Override
    public List<GetListWhiteboardModel> getWhiteboards(UserLogin userLogin) {
        List<UserWhiteboard> userWhiteboardList = userWhiteboardRepo.findAllByUserLogin(userLogin);
        List<GetListWhiteboardModel> getListWhiteboardModels = new ArrayList<>();
        for (UserWhiteboard userWhiteboard: userWhiteboardList) {
            Whiteboard whiteboard = userWhiteboard.getWhiteboard();
            if (whiteboard != null) {
                GetListWhiteboardModel getListWhiteboardModel = new GetListWhiteboardModel();
                getListWhiteboardModel.setId(whiteboard.getId());
                getListWhiteboardModel.setName(whiteboard.getName());
                getListWhiteboardModel.setTotalPage(whiteboard.getTotalPage());
                getListWhiteboardModel.setCreatedBy(whiteboard.getCreatedBy());
                getListWhiteboardModel.setCreatedDate(whiteboard.getCreatedDate());

                getListWhiteboardModels.add(getListWhiteboardModel);
            }
        }

        return getListWhiteboardModels;
    }

    @Override
    public void saveWhiteboardData(SaveWhiteboardDataModel input, String userId) {
        Whiteboard whiteboard = whiteboardRepo.findWhiteboardById(input.getWhiteboardId());
        whiteboard.setLastModifiedDate(new Date());
        whiteboard.setLastModifiedBy(userId);
        whiteboard.setData(input.getData());
        whiteboard.setTotalPage(input.getTotalPage());

        whiteboardRepo.save(whiteboard);
    }

    @Override
    public WhiteboardDetailModel getWhiteboardDetail(String id) {
        WhiteboardDetailModel whiteboardDetailModel = new WhiteboardDetailModel();
        Whiteboard whiteboard = whiteboardRepo.findWhiteboardById(id);
        whiteboardDetailModel.setId(id);
        if (whiteboard == null) {
            return null;
        }
        whiteboardDetailModel.setName(whiteboard.getName());
        whiteboardDetailModel.setTotalPage(whiteboard.getTotalPage());
        whiteboardDetailModel.setData((whiteboard.getData()));

        return whiteboardDetailModel;
    }

    @Override
    public void addUserToWhiteboard(String whiteboardId, UserLogin userLogin) {
        UserWhiteboard userWhiteboard = new UserWhiteboard();
        List<UserWhiteboard> userWhiteboardList = userWhiteboardRepo.findAllByUserLogin(userLogin);
        boolean found = false;
        for(UserWhiteboard x : userWhiteboardList){
            log.info("x: whiteboardId = " + x.getWhiteboard().getId());
            if(x.getWhiteboard().getId().equals(whiteboardId)){
                found = true;
                break;
            }
        }

        if (userWhiteboardList.size() == 0 || !found) {
            UserLogin userLoginTest = userLoginRepo.findByUserLoginId(userLogin.getUserLoginId());
            Whiteboard whiteboard = whiteboardRepo.findWhiteboardById(whiteboardId);
            userWhiteboard.setUserLogin(userLoginTest);
            userWhiteboard.setWhiteboard(whiteboard);

            userWhiteboardRepo.save(userWhiteboard);
        } else {
            return;
        }
    }
}
