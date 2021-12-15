package com.hust.baseweb.applications.contentmanager.repo;

import java.io.IOException;


import com.hust.baseweb.applications.contentmanager.model.ContentModel;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.gridfs.GridFsResource;

public interface MongoContentService {
    public ObjectId storeFileToGridFs(ContentModel contentModel) throws IOException;

    public GridFsResource getById(String id);
}
