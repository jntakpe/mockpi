package com.github.jntakpe.mockpi.service

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

    @Test
    fun `should find user by login`() {
        val login = "jntakpe"
        StepVerifier.create(userService.findByLogin(login))
                .expectSubscription()
                .consumeNextWith { user ->
                    run {
                        assertThat(user).isNotNull()
                        assertThat(user.login).isEqualTo(login)
                    }
                }
                .expectComplete()
                .verify()
    }

    @Test
    fun `should find user by login ignoring case`() {
        val login = "JNtaKpe"
        StepVerifier.create(userService.findByLogin(login))
                .expectSubscription()
                .consumeNextWith { user ->
                    run {
                        assertThat(user).isNotNull()
                        assertThat(user.login).isEqualTo(login.toLowerCase())
                    }
                }
                .expectComplete()
                .verify()
    }

    @Test
    fun `should not find user by login because unknown login`() {
        val login = "unknown"
        StepVerifier.create(userService.findByLogin(login))
                .expectSubscription()
                .recordWith { mutableListOf() }
                .expectRecordedMatches { it.isEmpty() }
                .expectComplete()
                .verify()
    }

}