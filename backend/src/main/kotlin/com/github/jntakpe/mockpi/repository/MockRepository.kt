package com.github.jntakpe.mockpi.repository

import com.github.jntakpe.mockpi.domain.Mock
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.http.HttpMethod
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface MockRepository : ReactiveMongoRepository<Mock, String> {

    fun findByNameIgnoreCase(name: String): Mono<Mock>

    fun findByNameStartsWithIgnoreCase(name: String): Flux<Mock>

    fun findByRequest_PathAndRequest_Method(path: String, method: HttpMethod): Flux<Mock>

}