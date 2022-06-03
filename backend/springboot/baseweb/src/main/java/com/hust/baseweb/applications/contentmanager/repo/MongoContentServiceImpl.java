package com.hust.baseweb.applications.contentmanager.repo;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import com.hust.baseweb.applications.contentmanager.model.ContentModel;
import com.mongodb.client.gridfs.model.GridFSFile;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.stereotype.Service;

@Service
public class MongoContentServiceImpl implements MongoContentService {
  @Autowired
  GridFsOperations operations;

  public ObjectId storeFileToGridFs(ContentModel contentModel) throws IOException {
    Map<String, String> metadata = new HashMap<>();
    metadata.put("upload_file_name", contentModel.getFile().getOriginalFilename());
    return operations.store(contentModel.getFile().getInputStream(), contentModel.getId(),contentModel.getFile().getContentType(), metadata);
  }

  public GridFsResource getById(String id) {
    GridFSFile fID = operations.findOne(Query.query(Criteria.where("_id").is(id)));
    if (fID == null)
      return null;
    return operations.getResource(fID);
  }

  public  void deleteFilesById(String id){
      operations.delete(Query.query(Criteria.where("_id").is(id)));
  }

}
