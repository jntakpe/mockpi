package com.github.jntakpe.mockpi.service

import com.github.jntakpe.mockpi.domain.User
import com.github.jntakpe.mockpi.exceptions.ConflictKeyException
import com.github.jntakpe.mockpi.exceptions.IdNotFoundException
import com.github.jntakpe.mockpi.repository.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import reactor.core.publisher.toMono

@Service
class UserService(private val userRepository: UserRepository) {

    val logger = LoggerFactory.getLogger(javaClass.simpleName)

    fun findByUsername(username: String): Mono<User> {
        logger.debug("Searching user with username {}", username)
        return userRepository.findByUsernameIgnoreCase(username)
                .doOnNext { logger.debug("User {} matched with username {}", it, username) }
    }

    fun verifyUsernameAvailable(username: String, oldUsername: String = ""): Mono<String> {
        logger.debug("Checking that username {} is available", username)
        return findByUsername(username)
                .filter { it.username != oldUsername }
                .flatMap { ConflictKeyException("Username $username is not available").toMono<String>() }
                .defaultIfEmpty(username)
                .doOnNext { logger.debug("Username {} is available", username) }
    }

    fun verifyEmailAvailable(email: String, oldMail: String = ""): Mono<String> {
        logger.debug("Checking that email {} is available", email)
        return userRepository.findByEmailIgnoreCase(email)
                .filter { it.email != oldMail }
                .flatMap { ConflictKeyException("Email $email is not available").toMono<String>() }
                .defaultIfEmpty(email)
                .doOnNext { logger.debug("Email {} is available", email) }
    }

    fun register(user: User): Mono<User> {
        logger.debug("Creating {}", user)
        return Mono.`when`(verifyUsernameAvailable(user.username), verifyEmailAvailable(user.email))
                .map { lowerCaseUsernameAndMail(user) }
                .flatMap(userRepository::insert)
                .doOnNext { logger.info("User {} successfully created", user) }
    }

    fun update(user: User, oldUsername: String): Mono<User> {
        logger.debug("Updating {} to {}", oldUsername, user)
        return findByUsernameOrThrow(oldUsername)
                .flatMap { Mono.`when`(verifyUsernameAvailable(user.username, it.username), verifyEmailAvailable(user.email, it.email)) }
                .map { lowerCaseUsernameAndMail(user) }
                .flatMap { userRepository.save(it) }
                .doOnNext { logger.info("User {} successfully updated", user) }
                .flatMap { u -> deleteOldUsername(oldUsername, u) }
    }

    fun delete(username: String): Mono<Void> {
        logger.debug("Deleting user {}", username)
        return findByUsernameOrThrow(username)
                .map(User::username)
                .flatMap(userRepository::deleteById)
                .doOnNext { logger.info("User with username {} successfully deleted", username) }

    }

    private fun lowerCaseUsernameAndMail(user: User) = user.copy(username = user.username.toLowerCase(), email = user.email.toLowerCase())

    private fun findByUsernameOrThrow(username: String) = findByUsername(username)
            .switchIfEmpty(IdNotFoundException("Username $username doest not exist").toMono<User>())

    private fun deleteOldUsername(oldUsername: String, user: User): Mono<User>? = user.toMono()
            .filter { it.username != oldUsername }
            .flatMap { u -> delete(oldUsername).map { u } }
            .defaultIfEmpty(user)

}