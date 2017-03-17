package com.github.jntakpe.mockpi.service

import com.github.jntakpe.mockpi.exceptions.ConflictKeyException
import com.github.jntakpe.mockpi.repository.UserRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.junit4.SpringRunner
import reactor.test.StepVerifier

@SpringBootTest
@RunWith(SpringRunner::class)
internal class UserServiceTest {

    @Autowired
    lateinit var userService: UserService

    @Autowired
    lateinit var userRepository: UserRepository

    @Test
    fun `should find user by login because exact match`() {
        val login = "jntakpe"
        StepVerifier.create(userService.findByLogin(login))
                .expectSubscription()
                .consumeNextWith { user ->
                    run {
                        assertThat(user).isNotNull()
                        assertThat(user.login).isEqualTo(login)
                    }
                }
                .verifyComplete()
    }

    @Test
    fun `should find user by login because ignoring case`() {
        val login = "JNtaKpe"
        StepVerifier.create(userService.findByLogin(login))
                .expectSubscription()
                .consumeNextWith { user ->
                    run {
                        assertThat(user).isNotNull()
                        assertThat(user.login).isEqualTo(login.toLowerCase())
                    }
                }
                .verifyComplete()
    }

    @Test
    fun `should not find user by login because unknown login`() {
        val login = "unknown"
        StepVerifier.create(userService.findByLogin(login))
                .expectSubscription()
                .recordWith { mutableListOf() }
                .expectRecordedMatches { it.isEmpty() }
                .verifyComplete()
    }

    @Test
    fun `should accept login because none existing`() {
        val newlogin = "newlogin"
        StepVerifier.create(userService.verifyLoginAvailable(newlogin))
                .expectSubscription()
                .expectNext(newlogin)
                .verifyComplete()
    }

    @Test
    fun `should refuse login because same login exist`() {
        StepVerifier.create(userService.verifyLoginAvailable("JNtakpe"))
                .expectSubscription()
                .expectError(ConflictKeyException::class.java)
                .verify()
    }

    @Test
    fun `should accept login because old login is the same`() {
        val login = "JNtakpe"
        StepVerifier.create(userService.verifyLoginAvailable(login, "jntakpe"))
                .expectSubscription()
                .expectNext(login)
                .verifyComplete()
    }

    @Test
    fun `should refuse login because old login is not the same`() {
        StepVerifier.create(userService.verifyLoginAvailable("JNtakpe", "oldlogin"))
                .expectSubscription()
                .expectError(ConflictKeyException::class.java)
                .verify()
    }

}