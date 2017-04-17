package com.github.jntakpe.mockpi.web

import com.github.jntakpe.mockpi.config.Urls
import com.github.jntakpe.mockpi.mapper.toRequest
import com.github.jntakpe.mockpi.service.FakeService
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping(Urls.FAKE_PREFIX)
class FakeResource(private val fakeService: FakeService) {

    @RequestMapping("/**")
    fun fake(req: ServerHttpRequest) = fakeService.findFakeResponse(req.toRequest())

}