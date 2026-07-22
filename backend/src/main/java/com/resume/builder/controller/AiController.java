package com.resume.builder.controller;

import com.resume.builder.dto.AiResponseDto;
import com.resume.builder.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/generate")
    public ResponseEntity<AiResponseDto> generateResume(@RequestBody Map<String, Object> requestBody) {
        String prompt = (String) requestBody.get("prompt");
        
        if (prompt == null || prompt.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        AiResponseDto response = aiService.generateResume(prompt);
        return ResponseEntity.ok(response);
    }
}
