package com.resume.builder.dto;

import lombok.Data;

@Data
public class ExperienceDto {
    private Long id;
    private String company;
    private String role;
    private String startDate;
    private String endDate;
    private String description;
}
