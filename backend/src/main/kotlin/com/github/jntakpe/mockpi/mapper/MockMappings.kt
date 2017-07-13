package com.github.jntakpe.mockpi.mapper

import com.github.jntakpe.mockpi.domain.Activity
import com.github.jntakpe.mockpi.domain.Request
import com.github.jntakpe.mockpi.domain.Response
import com.github.jntakpe.mockpi.web.dto.ActivityDTO
import org.springframework.http.MediaType.parseMediaType
import org.springframework.http.ResponseEntity
import org.springframework.http.server.reactive.ServerHttpRequest

fun ServerHttpRequest.toRequest() = Request(uri.path, method, queryParams.toSingleValueMap(), headers.toSingleValueMap())

fun Response.toResponseEntity() = ResponseEntity.status(status).contentType(parseMediaType(contentType)).body(body)

fun Activity.toDTO() = ActivityDTO(mock.name, mock.request.path, mock.request.method, mock.request.params, calls)