package com.hust.baseweb.applications.education.content;

import com.hust.baseweb.applications.contentmanager.repo.MongoContentService;
import lombok.AllArgsConstructor;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.ws.rs.POST;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@RestController
@AllArgsConstructor
public class FileContentController {

    private VideoService videoService;
    @Autowired
    MongoContentService mongoContentService;

    @PostMapping("/files")
    public ResponseEntity<?> create(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED).body(videoService.create(file));
    }

    @PutMapping("/files/{id}")
    public ResponseEntity<?> update(@PathVariable UUID id, @RequestParam("file") MultipartFile file)
        throws IOException {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(videoService.update(id, file));
        } catch (NoSuchElementException e) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/files/{id}")
    public ResponseEntity delete(@PathVariable UUID id) {
        videoService.delete(id);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/files/{id}/undelete")
    public ResponseEntity<?> undelete(@PathVariable UUID id) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(videoService.undelete(id));
        } catch (NoSuchElementException e) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping(value = "/file", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getFilesFromMongoById(@RequestBody Map<String, String> fileId) {
        String[] fileIds = fileId.get("fileId").split(";");
        List<byte[]> files = new ArrayList<>();
        if (fileIds.length != 0) {
            for (String s : fileIds) {
                try {
                    GridFsResource content = mongoContentService.getById(s);
                    if (content != null) {
                        InputStream inputStream = content.getInputStream();
                        files.add(IOUtils.toByteArray(inputStream));
                    }
                } catch (IOException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            }
        }
        return ResponseEntity.status(HttpStatus.OK).body(files);
    }
}
