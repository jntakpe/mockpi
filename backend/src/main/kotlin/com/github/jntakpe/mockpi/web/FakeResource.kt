package com.github.jntakpe.mockpi.web

import com.github.jntakpe.mockpi.domain.Request
import com.github.jntakpe.mockpi.domain.Response
import com.github.jntakpe.mockpi.service.FakeService
import org.springframework.http.ResponseEntity
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.toMono

@RestController
@RequestMapping("\${api.fakeContextRoot}")
class FakeResource(private val fakeService: FakeService) {

    @RequestMapping("/**")
    fun fake(req: ServerHttpRequest) = fakeService.findFakeResponse(req.toRequest())
            .map(Response::body)
            .map { ResponseEntity.ok(it) }
            .switchIfEmpty(ResponseEntity.notFound().build<String>().toMono())


    fun ServerHttpRequest.toRequest() = Request(this.uri.path, this.method, this.queryParams.toSingleValueMap(),
            this.headers.toSingleValueMap())

}