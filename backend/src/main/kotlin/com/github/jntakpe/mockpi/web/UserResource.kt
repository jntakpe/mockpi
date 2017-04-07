package com.github.jntakpe.mockpi.web

import com.github.jntakpe.mockpi.config.Urls.USERS_API
import com.github.jntakpe.mockpi.domain.User
import com.github.jntakpe.mockpi.service.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.toMono
import javax.validation.Valid

@RestController
@RequestMapping(USERS_API)
class UserResource(private val userService: UserService) {

    @GetMapping("/{login}")
    fun findByLogin(@PathVariable login: String) = userService.findByLogin(login)
            .map { u -> ResponseEntity(u, HttpStatus.OK) }
            .otherwiseIfEmpty(ResponseEntity.notFound().build<User>().toMono())


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun register(@RequestBody @Valid user: User) = userService.register(user)

}