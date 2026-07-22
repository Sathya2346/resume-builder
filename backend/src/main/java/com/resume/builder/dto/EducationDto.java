package com.resume.builder.dto;

import lombok.Data;

@Data
public class EducationDto {
    private Long id;
    private String institution;
    private String degree;
    private String fieldOfStudy;
    private String startDate;
    private String endDate;
}
