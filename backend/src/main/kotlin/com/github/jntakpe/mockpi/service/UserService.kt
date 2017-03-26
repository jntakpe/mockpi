package com.github.jntakpe.mockpi.service

import com.github.jntakpe.mockpi.domain.User
import com.github.jntakpe.mockpi.exceptions.ConflictKeyException
import com.github.jntakpe.mockpi.exceptions.IdNotFoundException
import com.github.jntakpe.mockpi.repository.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class UserService(private val userRepository: UserRepository) {

    val logger = LoggerFactory.getLogger(javaClass.simpleName)

    fun findByLogin(login: String): Mono<User> {
        logger.debug("Searching user with login {}", login)
        return userRepository.findByLoginIgnoreCase(login)
    }

    fun verifyLoginAvailable(login: String, oldLogin: String = ""): Mono<String> {
        logger.debug("Checking that login {} is available", login)
        return findByLogin(login)
                .filter { it.login != oldLogin }
                .flatMap { Mono.error<String>(ConflictKeyException("Login $login is not available")) }
                .defaultIfEmpty(login)
                .single()
    }

    fun verifyEmailAvailable(email: String, oldMail: String = ""): Mono<String> {
        logger.debug("Checking that email {} is available", email)
        return userRepository.findByEmailIgnoreCase(email)
                .filter { it.email != oldMail }
                .flatMap { Mono.error<String>(ConflictKeyException("Email $email is not available")) }
                .defaultIfEmpty(email)
                .single()
    }

    fun create(user: User): Mono<User> {
        logger.info("Creating {}", user)
        return Mono.`when`(verifyLoginAvailable(user.login), verifyEmailAvailable(user.email))
                .map { lowerCaseLoginAndMail(user) }
                .flatMap { u -> userRepository.insert(u) }
                .single()
    }

    fun update(user: User, oldLogin: String): Mono<User> {
        logger.info("Updating {} to {}", oldLogin, user)
        return findByLoginOrThrow(oldLogin)
                .flatMap { (login, _, email) ->
                    Mono.`when`(verifyLoginAvailable(user.login, login), verifyEmailAvailable(user.email, email))
                }
                .map { lowerCaseLoginAndMail(user) }
                .flatMap { u -> userRepository.save(u) }
                .flatMap { u -> deleteOldLogin(oldLogin, u) }
                .singleOrEmpty()
    }

    fun delete(username: String): Mono<Void> {
        logger.info("Deleting user {}", username)
        return findByLoginOrThrow(username)
                .flatMap { (login) -> userRepository.delete(login) }
                .singleOrEmpty()
    }

    private fun lowerCaseLoginAndMail(user: User) = user.copy(login = user.login.toLowerCase(), email = user.email.toLowerCase())

    private fun findByLoginOrThrow(username: String) = findByLogin(username)
            .otherwiseIfEmpty(Mono.error(IdNotFoundException("Login $username doest not exist")))

    private fun deleteOldLogin(oldLogin: String, user: User): Flux<User>? = Mono.just(user)
            .filter { it.login != oldLogin }
            .flatMap { u -> userRepository.delete(oldLogin).map { u } }
            .defaultIfEmpty(user)

}