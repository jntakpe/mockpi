package com.github.jntakpe.mockpi.mapper

import com.github.jntakpe.mockpi.domain.Request
import com.github.jntakpe.mockpi.domain.Response
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.http.server.reactive.ServerHttpRequest

fun ServerHttpRequest.toRequest() =
        Request(this.uri.path, this.method, this.queryParams.toSingleValueMap(), this.headers.toSingleValueMap())

fun Response.toResponseEntity() =
        ResponseEntity.status(this.status).contentType(MediaType.parseMediaType(this.contentType)).body(this.body)