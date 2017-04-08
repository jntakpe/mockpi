package com.github.jntakpe.mockpi.repository

import com.github.jntakpe.mockpi.domain.User
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import reactor.core.publisher.Mono

interface UserRepository : ReactiveMongoRepository<User, String> {

    fun findByUsernameIgnoreCase(login: String): Mono<User>

    fun findByEmailIgnoreCase(email: String): Mono<User>
}