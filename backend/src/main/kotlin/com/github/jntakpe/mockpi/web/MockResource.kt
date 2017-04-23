package com.github.jntakpe.mockpi.web

import com.github.jntakpe.mockpi.config.Urls
import com.github.jntakpe.mockpi.domain.Mock
import com.github.jntakpe.mockpi.service.MockService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono
import reactor.core.publisher.toMono
import javax.validation.Valid

@RestController
@RequestMapping(Urls.MOCK_API)
class MockResource(private val mockService: MockService) {

    @GetMapping
    fun findAll() = mockService.findAll()

    @GetMapping(Urls.BY_NAME)
    fun findByName(@PathVariable name: String): Mono<ResponseEntity<Mock>> {
        return mockService.findByName(name)
                .map { m -> ResponseEntity(m, HttpStatus.OK) }
                .switchIfEmpty(ResponseEntity.notFound().build<Mock>().toMono())
    }

    @GetMapping(Urls.BY_NAME_AVAILABLE_DUPLICATE)
    fun findByNameAvailableDuplicate(@PathVariable name: String) = mockService.findAvailableDuplicateName(name)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody @Valid mock: Mock): Mono<Mock> = mockService.create(mock)

    @PutMapping(Urls.BY_NAME)
    fun update(@PathVariable name: String, @RequestBody @Valid mock: Mock): Mono<Mock> = mockService.update(mock, name)

    @DeleteMapping(Urls.BY_NAME)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun remove(@PathVariable name: String): Mono<Void> = mockService.delete(name)
}