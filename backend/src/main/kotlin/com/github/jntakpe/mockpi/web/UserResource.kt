package com.github.jntakpe.mockpi.web

import com.github.jntakpe.mockpi.config.Urls.USERS_API
import com.github.jntakpe.mockpi.domain.User
import com.github.jntakpe.mockpi.service.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono

@RestController
@RequestMapping(USERS_API)
class UserResource(private val userService: UserService) {

    @GetMapping("/{login}")
    fun findByLogin(@PathVariable login: String): Mono<ResponseEntity<User>> {
        return userService.findByLogin(login)
                .map { u -> ResponseEntity(u, HttpStatus.OK) }
                .otherwiseIfEmpty(Mono.just(ResponseEntity.notFound().build()))
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody user: User) = userService.create(user)

}