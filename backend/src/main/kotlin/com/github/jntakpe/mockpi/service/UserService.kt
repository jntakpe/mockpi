package com.github.jntakpe.mockpi.service

import com.github.jntakpe.mockpi.domain.User
import com.github.jntakpe.mockpi.exceptions.ConflictKeyException
import com.github.jntakpe.mockpi.repository.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono

@Service
class UserService(val userRepository: UserRepository) {

    val logger = LoggerFactory.getLogger(javaClass.simpleName)

    fun findByLogin(login: String): Mono<User> {
        logger.debug("Searching user with login {}", login)
        return userRepository.findByLoginIgnoreCase(login)
    }

    fun verifyLoginAvailable(login: String, oldLogin: String = ""): Mono<String> {
        logger.debug("Checking that login {} is available", login)
        return findByLogin(login)
                .filter { it.login != oldLogin }
                .map { false }
                .defaultIfEmpty(true)
                .flatMap { if (it) Mono.just(login) else Mono.error<String>(ConflictKeyException("Login $login is not available")) }
                .single()
    }

}