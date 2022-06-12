package com.hust.baseweb.repo;

import com.hust.baseweb.entity.Party;
import com.hust.baseweb.entity.UserLogin;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;
import java.util.UUID;

@RepositoryRestResource(exported = false)
public interface UserLoginRepo extends JpaRepository<UserLogin, String> {

    UserLogin findByUserLoginId(String userLoginId);

    List<UserLogin> findByParty(Party party);

    @Query(value = "select ul.*\n" +
                   "from user_login ul inner join public.user_login_security_group ulsg\n" +
                   "on ul.user_login_id = ulsg.user_login_id\n" +
                   "where ulsg.group_id = ?1",
           nativeQuery = true)
    List<UserLogin> findAllUserLoginsByGroupId(String groupId);

    @Query(value = "select group_id\n" +
                   "from user_login_security_group\n" +
                   "where user_login_id = ?1",
           nativeQuery = true)
    List<String> findGroupPermsByUserLoginId(String userLoginId);

    @Query(value = "select\n" +
                   "\tur.email\n" +
                   "from\n" +
                   "\tuser_login ul\n" +
                   "inner join user_register ur on\n" +
                   "\tul.user_login_id = ur.user_login_id and ur.status_id != 'USER_DISABLED'\n",
           nativeQuery = true)
    List<String> findAllUserEmail();

    @Query(value = "select u.user_login_id from user_login u inner join user_login_security_group ug \n" +
                   " on u.user_login_id = ug.user_login_id \n" +
                   "where ug.group_id = ?1", nativeQuery = true)
    List<String> findAllUserLoginOfGroup(String groupId);

    @Query(value = "SELECT ul.* FROM user_login ul WHERE ul.party_id = :partyId", nativeQuery = true)
    UserLogin finByPartyId(@Param("partyId") UUID partyId);
}
