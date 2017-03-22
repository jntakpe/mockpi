package com.github.jntakpe.mockpi.repository

import com.github.jntakpe.mockpi.domain.Mock
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.web.bind.annotation.RequestMethod
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface MockRepository : ReactiveMongoRepository<Mock, String> {

    fun findByNameIgnoreCase(name: String): Mono<Mock>

    fun findByRequest_PathAndRequest_Method(path: String, method: RequestMethod): Flux<Mock>

}