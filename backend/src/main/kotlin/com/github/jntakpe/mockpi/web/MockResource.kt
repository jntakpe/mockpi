package com.github.jntakpe.mockpi.web

import com.github.jntakpe.mockpi.config.Urls
import com.github.jntakpe.mockpi.domain.Mock
import com.github.jntakpe.mockpi.service.MockService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono
import javax.validation.Valid

@RestController
@RequestMapping(Urls.MOCK_API)
class MockResource(private val mockService: MockService) {

    @GetMapping("/{name}")
    fun findByName(@PathVariable name: String): Mono<ResponseEntity<Mock>> {
        return mockService.findByName(name)
                .map { m -> ResponseEntity(m, HttpStatus.OK) }
                .otherwiseIfEmpty(Mono.just(ResponseEntity.notFound().build()))
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody @Valid mock: Mock): Mono<Mock> = mockService.create(mock)

    @PutMapping("/{name}")
    fun update(@PathVariable name: String, @RequestBody @Valid mock: Mock): Mono<Mock> = mockService.update(mock, name)

}