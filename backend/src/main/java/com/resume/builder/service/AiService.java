package com.resume.builder.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resume.builder.dto.AiResponseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiService {

    @Value("${ai.groq.api.key}")
    private String apiKey;

    @Value("${ai.groq.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    private static final String SYSTEM_PROMPT = """
        You are an elite Executive Resume Writer and AI Career Coach. Your goal is to help the user build a highly professional, ATS-optimized resume. 

        You operate in a strict two-phase process:

        ### PHASE 1: Information Gathering
        When the user provides their initial prompt or career history, you must evaluate if you have enough information to generate a complete resume. 

        A "Complete" resume requires AT LEAST:
        1. Contact Info (Name, basic contact details)
        2. Professional Title & Target Role
        3. At least 1-2 past work experiences with dates and specific achievements
        4. Education background
        5. Core Skills

        If any of these critical pieces are missing, DO NOT generate the resume yet. Instead:
        - Set your output status to "incomplete".
        - Ask 1 to 3 highly targeted, conversational follow-up questions to extract the missing information. 

        ### PHASE 2: Resume Generation
        Once you determine you have sufficient information:
        - Set your output status to "complete".
        - Generate the full, professional resume.
        - Transform the user's raw input into strong, action-oriented bullet points.

        ### OUTPUT FORMAT (STRICT JSON)
        You must ALWAYS respond in valid JSON matching the exact schema below. Do not include markdown formatting or outside text.

        {
          "status": "incomplete", // Use "incomplete" if you need more info, or "complete" if generating the resume.
          "followUpQuestions": [
            // If status is "incomplete", list 1-3 conversational questions here. If "complete", leave this array empty.
          ],
          "data": {
            // If status is "incomplete", leave these fields null. If "complete", fill them out entirely.
            "title": "Senior Frontend Engineer",
            "summary": "Professional summary...",
            "experiences": [
              {
                "company": "Company Name",
                "role": "Job Title",
                "startDate": "Month Year",
                "endDate": "Month Year / Present",
                "description": "• Action point 1\\n• Action point 2"
              }
            ],
            "projects": [
              {
                "name": "Project Name",
                "url": "Project URL",
                "description": "Short description"
              }
            ],
            "educations": [
              {
                "institution": "University Name",
                "degree": "Degree Name",
                "fieldOfStudy": "Major/Field",
                "startDate": "Year",
                "endDate": "Year"
              }
            ]
          }
        }
        """;

    public AiService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public AiResponseDto generateResume(String userPrompt) {
        if (apiKey == null || apiKey.equals("YOUR_API_KEY_HERE")) {
            throw new RuntimeException("API key is not configured");
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> systemMessage = new HashMap<>();
            systemMessage.put("role", "system");
            systemMessage.put("content", SYSTEM_PROMPT);

            Map<String, Object> userMessage = new HashMap<>();
            userMessage.put("role", "user");
            userMessage.put("content", userPrompt);

            Map<String, Object> responseFormat = new HashMap<>();
            responseFormat.put("type", "json_object");

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "llama-3.3-70b-versatile");
            requestBody.put("messages", List.of(systemMessage, userMessage));
            requestBody.put("response_format", responseFormat);

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, requestEntity, Map.class);
            
            if (response.getBody() != null && response.getBody().containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    String textResponse = (String) message.get("content");
                    return objectMapper.readValue(textResponse, AiResponseDto.class);
                }
            }
            throw new RuntimeException("Failed to parse Groq response");
        } catch (Exception e) {
            e.printStackTrace();
            AiResponseDto errorResponse = new AiResponseDto();
            errorResponse.setStatus("error");
            String errorMessage = e.getMessage() != null ? e.getMessage() : e.getClass().getName();
            
            // If it's a RestClientException, we can try to extract the response body
            if (e instanceof org.springframework.web.client.HttpStatusCodeException) {
                org.springframework.web.client.HttpStatusCodeException httpException = (org.springframework.web.client.HttpStatusCodeException) e;
                errorMessage += " | Response: " + httpException.getResponseBodyAsString();
            }

            errorResponse.setFollowUpQuestions(List.of("An error occurred: " + errorMessage));
            return errorResponse;
        }
    }
}
