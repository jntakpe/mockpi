package com.github.jntakpe.mockpi.mapper

import com.github.jntakpe.mockpi.domain.Activity
import com.github.jntakpe.mockpi.domain.Request
import com.github.jntakpe.mockpi.domain.Response
import com.github.jntakpe.mockpi.web.dto.ActivityDTO
import org.springframework.http.MediaType.parseMediaType
import org.springframework.http.ResponseEntity
import org.springframework.http.server.reactive.ServerHttpRequest

fun ServerHttpRequest.toRequest() = Request(this.uri.path, this.method, this.queryParams.toSingleValueMap(), this.headers.toSingleValueMap())

fun Response.toResponseEntity() = ResponseEntity.status(this.status).contentType(parseMediaType(this.contentType)).body(this.body)

fun Activity.toDTO() = ActivityDTO(this.mock.name, this.mock.request.path, this.mock.request.method, this.mock.request.params, this.calls)