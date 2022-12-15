package com.hust.baseweb.controller;

import com.hust.baseweb.applications.education.exception.SimpleResponse;
import com.hust.baseweb.entity.RegisteredAffiliation;
import com.hust.baseweb.model.ApproveRegistrationIM;
import com.hust.baseweb.model.DisableUserRegistrationIM;
import com.hust.baseweb.model.PersonModel;
import com.hust.baseweb.model.RegisterIM;
import com.hust.baseweb.service.RegisteredAffiliationService;
import com.hust.baseweb.service.UserService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;
import java.util.UUID;

/**
 * @author Hien Hoang (hienhoang2702@gmail.com)
 */
@RestController
@CrossOrigin
@Log4j2
public class UserRegisterController {

    private UserService userService;

    @Autowired
    private RegisteredAffiliationService registeredAffiliationService;

    public UserRegisterController(UserService userService) {
        this.userService = userService;
    }


    /*@PostMapping("/user/register")
    public ResponseEntity<UserRegister.OutputModel> registerUser(@RequestBody UserRegister.InputModel inputModel) {
        return ResponseEntity.ok(userService.registerUser(inputModel));
    }

    @GetMapping("/user/get-all-register-user")
    public ResponseEntity<List<UserRegister.OutputModel>> findAllRegisterUser() {
        return ResponseEntity.ok(userService.findAllRegisterUser());
    }

    @GetMapping("/user/approve-register/{userLoginId}")
    public ResponseEntity<Boolean> approveRegisterUser(@PathVariable String userLoginId) {
        return ResponseEntity.ok(userService.approveRegisterUser(userLoginId));
    }*/

    @GetMapping("/public/get-registered-affiliations")
    public ResponseEntity<?> getRegisteredAffiliations(){
        List<RegisteredAffiliation> affiliations = registeredAffiliationService.findAll();

        return ResponseEntity.ok().body(affiliations);

    }
    @PostMapping("/user/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterIM im) {
        SimpleResponse res = userService.register(im);
        return ResponseEntity.status(res.getStatus()).body(res);
    }

    @GetMapping("/public/user/resetpassword/{userLoginId}")
    public ResponseEntity<?> resetPassword(@PathVariable String userLoginId){
        log.info("resetPassword, userLoginId = " + userLoginId);
        SimpleResponse res = userService.resetPassword(userLoginId);
        return ResponseEntity.ok().body(res);
    }
    @GetMapping("/user/registration-list")
    public ResponseEntity<?> getAllRegists() {
        return ResponseEntity.ok().body(userService.getAllRegists());
    }

    @PostMapping("/user/approve-registration")
    public ResponseEntity<?> approve(@RequestBody ApproveRegistrationIM im) {
        SimpleResponse res = userService.approve(im);
        return ResponseEntity.status(res.getStatus()).body(res);
    }

    @PostMapping("/user/approve-registration-send-email-for-activation")
    public ResponseEntity<?> approveRegistrationSendEmailForAccountActivation(@RequestBody ApproveRegistrationIM im){
        SimpleResponse res = userService.approveCreateAccountActivationSendEmail(im);
        return ResponseEntity.status(res.getStatus()).body(res);
    }

    @GetMapping("/public/activate-account/{activattionId}")
    public ResponseEntity<?> activateAccount(@PathVariable UUID activattionId){
        log.info("activateAccount, activationId = " + activattionId);
        SimpleResponse res = userService.activateAccount(activattionId);
        return ResponseEntity.ok().body("OK");
    }


    @PostMapping("/user/disable-registration")
    public ResponseEntity<?> disableUserRegistration(Principal principal, @RequestBody DisableUserRegistrationIM input){
        SimpleResponse res = userService.disableUserRegistration(input);
        return ResponseEntity.status(res.getStatus()).body(res);
    }
    @GetMapping("/get-user-detail/{userId}")
    public ResponseEntity<?> getUserDetail(@PathVariable String userId){
        log.info("getUserDetail userId = " + userId);
        PersonModel p = userService.findPersonByUserLoginId(userId);
        log.info("getUserDetail, found personModel {}",p);
        return ResponseEntity.ok().body(p);
    }

}
