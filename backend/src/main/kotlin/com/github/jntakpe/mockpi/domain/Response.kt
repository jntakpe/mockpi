package com.github.jntakpe.mockpi.domain

import org.hibernate.validator.constraints.NotBlank
import org.springframework.http.MediaType
import kotlin.text.Charsets.UTF_8

data class Response(@NotBlank val body: String,
                    val status: Int = 200,
                    val contentType: String = MediaType.APPLICATION_JSON_VALUE,
                    val encoding: String = UTF_8.name())