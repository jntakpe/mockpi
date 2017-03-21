package com.github.jntakpe.mockpi.domain

import org.hibernate.validator.constraints.NotBlank
import org.springframework.data.annotation.PersistenceConstructor
import org.springframework.http.MediaType
import kotlin.text.Charsets.UTF_8

data class Response @PersistenceConstructor constructor(@NotBlank val body: String,
                                                        val status: Int,
                                                        val contentType: String,
                                                        val encoding: String) {

    constructor(body: String) : this(body, status = 200, contentType = MediaType.APPLICATION_JSON_VALUE, encoding = UTF_8.name())

}