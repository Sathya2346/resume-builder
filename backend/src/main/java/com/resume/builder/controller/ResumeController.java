package com.resume.builder.controller;

import com.resume.builder.dto.ResumeDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ResumeDto>> getAllResumes(@PathVariable Long userId) {
        // Implementation omitted for brevity, would call ResumeService
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResumeDto> getResumeById(@PathVariable Long id) {
        // Implementation omitted
        return ResponseEntity.ok(new ResumeDto());
    }

    @PostMapping
    public ResponseEntity<ResumeDto> createResume(@RequestBody ResumeDto resumeDto) {
        // Implementation omitted
        return ResponseEntity.ok(resumeDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResumeDto> updateResume(@PathVariable Long id, @RequestBody ResumeDto resumeDto) {
        // Implementation omitted
        return ResponseEntity.ok(resumeDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResume(@PathVariable Long id) {
        // Implementation omitted
        return ResponseEntity.noContent().build();
    }
}
