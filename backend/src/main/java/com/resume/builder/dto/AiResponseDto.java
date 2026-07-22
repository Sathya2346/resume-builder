package com.resume.builder.dto;

import lombok.Data;
import java.util.List;

@Data
public class AiResponseDto {
    private String status; // "complete" or "incomplete"
    private ResumeDto data;
    private List<String> followUpQuestions;
}
