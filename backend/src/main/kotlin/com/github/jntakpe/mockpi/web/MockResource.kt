package com.github.jntakpe.mockpi.web

import com.github.jntakpe.mockpi.config.Urls
import com.github.jntakpe.mockpi.domain.Mock
import com.github.jntakpe.mockpi.service.MockService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Mono

@RestController
@RequestMapping(Urls.MOCK_API)
class MockResource(private val mockService: MockService) {

    @GetMapping("/{name}")
    fun findByName(@PathVariable name: String): Mono<ResponseEntity<Mock>> {
        return mockService.findByName(name)
                .map { m -> ResponseEntity(m, HttpStatus.OK) }
                .otherwiseIfEmpty(Mono.just(ResponseEntity.notFound().build()))
    }
}