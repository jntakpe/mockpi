package com.github.jntakpe.mockpi.service

import com.github.jntakpe.mockpi.domain.User
import com.github.jntakpe.mockpi.exceptions.ConflictKeyException
import com.github.jntakpe.mockpi.repository.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
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

    fun create(user: User): Mono<User> {
        logger.info("Creating user {}", user)
        return verifyLoginAvailable(user.login)
                .flatMap { userRepository.insert(user) }
                .single()
    }

    fun update(user: User, oldLogin: String): Mono<User> {
        logger.info("Updating user {} to {}", oldLogin, user)
        return verifyLoginAvailable(user.login, oldLogin)
                .flatMap { userRepository.save(user) }
                .flatMap { u -> deleteOldLogin(oldLogin, u) }
                .single()
    }

    fun delete(login: String): Mono<Void> {
        logger.info("Deleting user {}", login)
        return userRepository.delete(login)
    }

    private fun deleteOldLogin(oldLogin: String, user: User): Flux<User>? = Mono.just(user)
            .filter { it.login != oldLogin }
            .flatMap { u -> delete(oldLogin).map { u } }
            .defaultIfEmpty(user)

}