
package com.hust.baseweb.applications.contentmanager.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;

@Configuration
class MongoConfiguration extends AbstractMongoClientConfiguration {
  @Autowired
    private Environment env;

  @Autowired
  private MongoConfigurationProperties properties;

    @Override
    protected String getDatabaseName() {
    //return env.getProperty("MONGO_DB");
      //return env.getProperty("baseweb");
      //return "basewed";
      return properties.getDatabase();
  }


  @Override
  public MongoClient mongoClient() {
    //return MongoClients.create("mongodb://"+env.getProperty("MONGO_HOST")+":"+env.getProperty("MONGO_PORT")+"/");
      //return MongoClients.create("mongodb://localhost:27017,localhost:27018,localhost:27019");
      return MongoClients.create(properties.getUri());
  }

}

