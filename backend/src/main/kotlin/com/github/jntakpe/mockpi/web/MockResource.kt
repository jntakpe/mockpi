package com.github.jntakpe.mockpi.web

import com.github.jntakpe.mockpi.config.Urls
import com.github.jntakpe.mockpi.domain.Mock
import com.github.jntakpe.mockpi.service.MockService
import com.github.jntakpe.mockpi.web.dto.IdName
import com.github.jntakpe.mockpi.web.dto.IdRequest
import org.bson.types.ObjectId
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono
import reactor.core.publisher.toMono
import javax.validation.Valid

@RestController
@RequestMapping(Urls.MOCKS_API)
class MockResource(private val mockService: MockService) {

    @GetMapping
    fun findAll() = mockService.findAll()

    @GetMapping(Urls.BY_ID)
    fun findById(@PathVariable id: String): Mono<ResponseEntity<Mock>> {
        return mockService.findById(ObjectId(id))
                .map { ResponseEntity(it, HttpStatus.OK) }
                .switchIfEmpty(ResponseEntity.notFound().build<Mock>().toMono())
    }

    @GetMapping(Urls.BY_NEXT_NAME_AVAILABLE)
    fun findByNameAvailableDuplicate(@PathVariable name: String) = mockService.findAvailableDuplicateName(name)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody @Valid mock: Mock) = mockService.create(mock)

    @PostMapping(Urls.CHECK_NAME_AVAILABLE)
    fun checkNameAvailable(@RequestBody @Valid body: IdName) = mockService.verifyNameAvailable(body.name, body.id?.let(::ObjectId))

    @PostMapping(Urls.CHECK_REQUEST_AVAILABLE)
    fun checkReqAvailable(@RequestBody @Valid body: IdRequest) = mockService.verifyRequestAvailable(body.request, body.id?.let(::ObjectId))

    @PutMapping(Urls.BY_ID)
    fun update(@PathVariable id: String, @RequestBody @Valid mock: Mock) = mockService.update(mock, ObjectId(id))

    @DeleteMapping(Urls.BY_ID)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun remove(@PathVariable id: String) = mockService.delete(ObjectId(id))
}