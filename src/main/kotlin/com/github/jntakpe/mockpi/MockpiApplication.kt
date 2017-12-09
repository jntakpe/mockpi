package com.github.jntakpe.mockpi

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class MockpiApplication

fun main(args: Array<String>) {
    runApplication<MockpiApplication>(*args)
}