package com.resume.builder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import java.net.URI;

// Exclude SecurityAutoConfiguration temporarily for development ease
@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class ResumeBuilderApplication {

	public static void main(String[] args) {
		String databaseUrl = System.getenv("DATABASE_URL");
		if (databaseUrl != null && databaseUrl.startsWith("postgres://")) {
			try {
				URI dbUri = new URI(databaseUrl);
				String username = dbUri.getUserInfo().split(":")[0];
				String password = dbUri.getUserInfo().split(":")[1];
				// Construct JDBC URL: jdbc:postgresql://host:port/database
				String dbUrl = "jdbc:postgresql://" + dbUri.getHost() + ':' + dbUri.getPort() + dbUri.getPath();
				
				System.setProperty("spring.datasource.url", dbUrl);
				System.setProperty("spring.datasource.username", username);
				System.setProperty("spring.datasource.password", password);
			} catch (Exception e) {
				System.err.println("Failed to parse DATABASE_URL: " + e.getMessage());
			}
		}
		SpringApplication.run(ResumeBuilderApplication.class, args);
	}
}
