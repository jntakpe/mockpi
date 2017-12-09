import org.asciidoctor.gradle.AsciidoctorTask
import org.gradle.internal.impldep.org.junit.experimental.categories.Categories.CategoryFilter.exclude
import org.gradle.internal.impldep.org.junit.experimental.categories.Categories.CategoryFilter.include
import org.gradle.kotlin.dsl.*
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.springframework.boot.gradle.dsl.SpringBootExtension

val kotlinVersion = "1.2.0"
val springBootVersion = "2.0.0.M7"
val commonsLang3Version = "3.6"
val snippetsDir by extra { file("build/generated-snippets") }

extra["kotlin.version"] = kotlinVersion

group = "com.github.jntakpe"
version = "0.2.0-SNAPSHOT"

buildscript {
    repositories {
        jcenter()
        maven("https://repo.spring.io/snapshot")
        maven("https://repo.spring.io/milestone")
    }
    dependencies {
        val springBootVersion = "2.0.0.M7"
        val junitGradleVersion = "1.0.1"
        classpath("org.springframework.boot:spring-boot-gradle-plugin:$springBootVersion")
        classpath("org.junit.platform:junit-platform-gradle-plugin:$junitGradleVersion")
    }
}

plugins {
    val kotlinVersion = "1.2.0"
    val springIOVersion = "1.0.3.RELEASE"
    val asciiDocVersion = "1.5.6"
    kotlin("jvm") version kotlinVersion
    kotlin("plugin.spring") version kotlinVersion
    id("io.spring.dependency-management") version springIOVersion
    id("org.asciidoctor.convert") version asciiDocVersion
}

apply {
    plugin("org.springframework.boot")
    plugin("org.junit.platform.gradle.plugin")
}

java {
    sourceCompatibility = JavaVersion.VERSION_1_8
    targetCompatibility = JavaVersion.VERSION_1_8
}

dependencies {
    compile(kotlin("stdlib-jre8", kotlinVersion))
    compile(kotlin("reflect", kotlinVersion))
    compile("org.springframework.boot:spring-boot-starter-actuator")
    compile("org.springframework.boot:spring-boot-starter-webflux")
    compile("org.springframework.boot:spring-boot-starter-data-mongodb-reactive")
    compile("org.springframework.boot:spring-boot-starter-security")
    compile("com.fasterxml.jackson.module:jackson-module-kotlin")
    testCompile("org.springframework.boot:spring-boot-starter-test") {
        exclude(module = "junit")
    }
    testCompile("org.springframework.restdocs:spring-restdocs-webtestclient")
    testCompile("org.junit.jupiter:junit-jupiter-api")
    testCompile("de.flapdoodle.embed:de.flapdoodle.embed.mongo")
    testRuntime("org.junit.jupiter:junit-jupiter-engine")
    asciidoctor("org.springframework.restdocs:spring-restdocs-asciidoctor")
}

dependencyManagement {
    imports {
        mavenBom("org.springframework.boot:spring-boot-starter-parent:$springBootVersion")
    }
}

repositories {
    jcenter()
    maven("https://repo.spring.io/snapshot")
    maven("https://repo.spring.io/milestone")
}

tasks {
    withType<KotlinCompile> {
        kotlinOptions {
            jvmTarget = "1.8"
            freeCompilerArgs = listOf("-Xjsr305=strict")
        }
    }
    val testTask = withType<Test> {
        outputs.dir(snippetsDir)
    }
    withType<AsciidoctorTask> {
        dependsOn(testTask)
        inputs.dir(snippetsDir)
        sources(delegateClosureOf<PatternSet> {
            include("api-guide.adoc")
        })
        attributes.put("snippets", snippetsDir)
        doLast {
            copy {
                from("$buildDir/asciidoc/html5")
                into("$projectDir/src/main/resources/static")
                include("api-guide.html")
            }
        }
    }
}

configure<SpringBootExtension> {
    buildInfo()
}