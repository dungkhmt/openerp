
get user_login info

select p.party_id,u.user_login_id, ps.first_name, ps.middle_name, ps.last_name from party as p, user_login as u, person as ps 
where p.party_id = u.party_id and ps.party_id = p.party_id;
-------------
