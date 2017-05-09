FROM openjdk:8-jre
MAINTAINER Jocelyn NTAKPE <https://github.com/jntakpe/mockpi>

ARG PROFILE
ARG MONGODB_USERNAME
ARG MONGODB_PASSWORD

VOLUME /tmp
ADD build/libs/backend-0.1.0.jar app.jar
RUN bash -c 'touch /app.jar'

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "/app.jar"]

EXPOSE 8049