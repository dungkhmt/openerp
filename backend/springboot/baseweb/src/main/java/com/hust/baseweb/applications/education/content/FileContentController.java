package com.hust.baseweb.applications.education.content;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.NoSuchElementException;
import java.util.UUID;

@RestController
@AllArgsConstructor
public class FileContentController {

    private VideoService videoService;

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
}
