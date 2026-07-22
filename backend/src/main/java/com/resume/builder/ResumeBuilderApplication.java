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
		if (databaseUrl == null) {
			databaseUrl = System.getenv("SPRING_DATASOURCE_URL");
		}
		
		if (databaseUrl != null && (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://"))) {
			try {
				// Normalize to postgres:// for URI parser compatibility
				String normalizedUrl = databaseUrl.replaceFirst("^postgresql://", "postgres://");
				URI dbUri = new URI(normalizedUrl);
				String username = dbUri.getUserInfo().split(":")[0];
				String password = dbUri.getUserInfo().split(":")[1];
				
				// Handle optional port
				int port = dbUri.getPort();
				String hostAndPort = dbUri.getHost() + (port == -1 ? "" : ":" + port);
				String dbUrl = "jdbc:postgresql://" + hostAndPort + dbUri.getPath();
				
				System.setProperty("spring.datasource.url", dbUrl);
				System.setProperty("spring.datasource.username", username);
				System.setProperty("spring.datasource.password", password);
			} catch (Exception e) {
				System.err.println("Failed to parse database URL: " + e.getMessage());
			}
		}
		SpringApplication.run(ResumeBuilderApplication.class, args);
	}
}
