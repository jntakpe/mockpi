package com.github.jntakpe.mockpi.domain

import org.hibernate.validator.constraints.NotBlank
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.http.MediaType

@Document
data class Response(@field:NotBlank val body: String, val status: Int = 200, val contentType: String = MediaType.APPLICATION_JSON_VALUE)