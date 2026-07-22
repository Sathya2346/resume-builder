package com.resume.builder.dto;

import lombok.Data;
import java.util.List;

@Data
public class ResumeDto {
    private Long id;
    private Long userId;
    private String title;
    private String summary;
    private String theme;
    private String font;
    private String colors;
    private List<ExperienceDto> experiences;
    private List<ProjectDto> projects;
    private List<EducationDto> educations;
}
