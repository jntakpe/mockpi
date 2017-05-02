# MockPI

[![Build Status](https://travis-ci.org/jntakpe/mockpi.svg?branch=master)](https://travis-ci.org/jntakpe/mockpi)
[![dependencies Status](https://david-dm.org/jntakpe/mockpi/status.svg?path=frontend)](https://david-dm.org/jntakpe/mockpi?path=frontend)
[![devDependencies Status](https://david-dm.org/jntakpe/mockpi/dev-status.svg?path=frontend)](https://david-dm.org/jntakpe/mockpi?path=frontend&type=dev)
![license](https://img.shields.io/badge/license-MIT-blue.svg)

Reactive REST API mocking

## Installation

The project is divided into couple modules [backend](/backend) and [frontend](/frontend).

#### Prerequisites
 
Obviously [Git](https://git-scm.com/) must be installed to clone the project.

Backend module is developed using [Kotlin](https://kotlinlang.org/) and requires both [JDK 8](http://openjdk.java.net/) and 
[Kotlin >= 1.1](https://kotlinlang.org/). The backend module is built with [Gradle >= 3.4](https://gradle.org/) and project data is stored 
in a [MongoDB >= 3.4](https://www.mongodb.com/download-center?jmp=docs), please make sure these dependencies are installed.

Frontend module requires [NodeJS >= 6.9.0](https://nodejs.org/en/) and [npm >= 3](https://www.npmjs.com/).
Then you need to install globally the following npm packages :
* [Yarn](https://yarnpkg.com) ``npm install -g yarn``
* [Typescript](https://github.com/Microsoft/TypeScript) ``yarn global add typescript``
* [Angular CLI](https://github.com/angular/angular-cli) ``yarn global add @angular/cli``

Then in the [frontend](/frontend) directory execute : ``yarn``

#### Usage

Start MongoDB with : ``mongod``

In the [backend](/backend) directory, start the module with : ``gradle bootRun``

In the [frontend](/frontend) directory, start the module with : ``npm run start``

