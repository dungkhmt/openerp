package com.hust.baseweb.applications.cache;

import com.hust.baseweb.applications.education.classmanagement.controller.ClassController;
import com.hust.baseweb.entity.UserLogin;
import com.hust.baseweb.model.PersonModel;
import com.hust.baseweb.service.UserService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Log4j2
public class UserCache {
    private UserService userService;

    private HashMap<String, PersonModel> mUserLoginId2PersonModel;
    public UserCache(){
        mUserLoginId2PersonModel = new HashMap<String, PersonModel>();

        List<UserLogin> userLoginList = userService.getAllUserLogins();
        log.info("UserCache, got list " + userLoginList.size() + " users");
        for(UserLogin u: userLoginList){
            PersonModel pm = userService.findPersonByUserLoginId(u.getUserLoginId());
            mUserLoginId2PersonModel.put(u.getUserLoginId(),pm);
        }


    }
    public PersonModel getPersonModel(String u){
        return mUserLoginId2PersonModel.get(u);
    }

}
