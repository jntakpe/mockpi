# MockPI

[![Build Status](https://travis-ci.org/jntakpe/mockpi.svg?branch=master)](https://travis-ci.org/jntakpe/mockpi)
![license](https://img.shields.io/badge/license-MIT-blue.svg)

Reactive REST API mocking

## Installation

This is the home repository for Mockpi backend, you can find the frontend at [this address](https://github.com/jntakpe/mockpi-ui)

#### Prerequisites
 
Obviously [Git](https://git-scm.com/) must be installed to clone the project.

Mockpi backend is developed using [Kotlin](https://kotlinlang.org/) and requires both [JDK 8](http://openjdk.java.net/) and 
[Kotlin >= 1.1](https://kotlinlang.org/). The backend module is built with [Gradle >= 4.3](https://gradle.org/) and project data is stored 
in a [MongoDB >= 3.4](https://www.mongodb.com/download-center?jmp=docs), please make sure these dependencies are installed.

#### Usage

Start MongoDB with : ``mongod``

To start the Mockpi backend with : ``./gradlew bootRun``
Backend configuration is customizable using standard [Spring Boot](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html) 
[application.yml](/src/main/resources/application.yml) file.