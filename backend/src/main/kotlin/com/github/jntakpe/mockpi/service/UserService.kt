package com.github.jntakpe.mockpi.service

import com.github.jntakpe.mockpi.domain.User
import com.github.jntakpe.mockpi.exceptions.ConflictKeyException
import com.github.jntakpe.mockpi.exceptions.IdNotFoundException
import com.github.jntakpe.mockpi.repository.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.core.publisher.toMono

@Service
class UserService(private val userRepository: UserRepository) {

    val logger = LoggerFactory.getLogger(javaClass.simpleName)

    fun findByUsername(username: String): Mono<User> {
        logger.debug("Searching user with username {}", username)
        return userRepository.findByUsernameIgnoreCase(username)
    }

    fun verifyUsernameAvailable(username: String, oldUsername: String = ""): Mono<String> {
        logger.debug("Checking that username {} is available", username)
        return findByUsername(username)
                .filter { it.username != oldUsername }
                .flatMap { ConflictKeyException("Username $username is not available").toMono<String>() }
                .defaultIfEmpty(username)
                .single()
    }

    fun verifyEmailAvailable(email: String, oldMail: String = ""): Mono<String> {
        logger.debug("Checking that email {} is available", email)
        return userRepository.findByEmailIgnoreCase(email)
                .filter { it.email != oldMail }
                .flatMap { ConflictKeyException("Email $email is not available").toMono<String>() }
                .defaultIfEmpty(email)
                .single()
    }

    fun register(user: User): Mono<User> {
        logger.info("Creating {}", user)
        return Mono.`when`(verifyUsernameAvailable(user.username), verifyEmailAvailable(user.email))
                .map { lowerCaseUsernameAndMail(user) }
                .flatMap { u -> userRepository.insert(u) }
                .single()
    }

    fun update(user: User, oldUsername: String): Mono<User> {
        logger.info("Updating {} to {}", oldUsername, user)
        return findByUsernameOrThrow(oldUsername)
                .flatMap { (username, _, email) ->
                    Mono.`when`(verifyUsernameAvailable(user.username, username), verifyEmailAvailable(user.email, email))
                }
                .map { lowerCaseUsernameAndMail(user) }
                .flatMap { u -> userRepository.save(u) }
                .flatMap { u -> deleteOldUsername(oldUsername, u) }
                .singleOrEmpty()
    }

    fun delete(username: String): Mono<Void> {
        logger.info("Deleting user {}", username)
        return findByUsernameOrThrow(username)
                .flatMap { (username) -> userRepository.delete(username) }
                .singleOrEmpty()
    }

    private fun lowerCaseUsernameAndMail(user: User) = user.copy(username = user.username.toLowerCase(), email = user.email.toLowerCase())

    private fun findByUsernameOrThrow(username: String) = findByUsername(username)
            .otherwiseIfEmpty(IdNotFoundException("Username $username doest not exist").toMono<User>())

    private fun deleteOldUsername(oldUsername: String, user: User): Flux<User>? = user.toMono()
            .filter { it.username != oldUsername }
            .flatMap { u -> userRepository.delete(oldUsername).map { u } }
            .defaultIfEmpty(user)

}