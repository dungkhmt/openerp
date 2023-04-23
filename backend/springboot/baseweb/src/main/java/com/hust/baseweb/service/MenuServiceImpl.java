//package com.hust.baseweb.service;
//
//import com.hust.baseweb.entity.Menu;
//import com.hust.baseweb.entity.SecurityPermission;
//import com.hust.baseweb.repo.MenuRepo;
//import lombok.AllArgsConstructor;
//import lombok.extern.log4j.Log4j2;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.Collections;
//import java.util.List;
//import java.util.Set;
//import java.util.stream.Collectors;
//
//@Deprecated
//@Log4j2
//@AllArgsConstructor(onConstructor_ = @Autowired)
//@Service
//public class MenuServiceImpl implements MenuService {
//
//    private MenuRepo menuRepo;
//
//    @Override
//    public Set<String> getMenu(List<SecurityPermission> permissions) {
//        List<String> permissionIds = permissions
//            .stream()
//            .map(SecurityPermission::getPermissionId)
//            .collect(Collectors.toList());
//        List<Menu> menus = menuRepo.findAllByPermissionIn(permissionIds);
//
//        return menus != null ? menus.stream().map(Menu::getId).collect(Collectors.toSet()) : Collections.emptySet();
//    }
//}
