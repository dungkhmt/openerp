package com.hust.baseweb.service;

import com.hust.baseweb.entity.Person;

import java.util.UUID;

public interface PersonService {

    Person findByPartyId(UUID partyId);
}
