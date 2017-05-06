FROM openjdk:8-jre
MAINTAINER Jocelyn NTAKPE <https://github.com/jntakpe/mockpi>

ARG PROFILE
ARG MONGODB_USERNAME
ARG MONGODB_PASSWORD
ENV SPRING_PROFILES_ACTIVE ${PROFILE}
ENV SPRING_DATA_MONGODB_USERNAME ${MONGODB_USERNAME}
ENV SPRING_DATA_MONGODB_PASSWORD ${MONGODB_PASSWORD}

VOLUME /tmp
ADD build/libs/backend-0.0.1-SNAPSHOT.jar app.jar
RUN bash -c 'touch /app.jar'

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "/app.jar"]

EXPOSE 8080
