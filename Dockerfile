# Stage 1: Build React Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Spring Boot Backend
FROM maven:3.8.5-openjdk-17 AS backend-builder
WORKDIR /app
COPY backend/pom.xml ./backend/
RUN mvn -f backend/pom.xml dependency:go-offline
COPY backend/src ./backend/src
# Copy built frontend assets to Spring Boot static resources folder
COPY --from=frontend-builder /app/frontend/dist ./backend/src/main/resources/static
RUN mvn -f backend/pom.xml clean package -DskipTests

# Stage 3: Run the Unified Application
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=backend-builder /app/backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
