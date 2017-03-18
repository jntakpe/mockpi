package com.github.jntakpe.mockpi.service

import com.github.jntakpe.mockpi.domain.User
import com.github.jntakpe.mockpi.exceptions.ConflictKeyException
import com.github.jntakpe.mockpi.exceptions.IdNotFoundException
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
class UserServiceTest {

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
                .expectNext(login.toLowerCase())
                .verifyComplete()
    }

    @Test
    fun `should refuse login because old login is not the same`() {
        StepVerifier.create(userService.verifyLoginAvailable("JNtakpe", "oldlogin"))
                .expectSubscription()
                .expectError(ConflictKeyException::class.java)
                .verify()
    }

    @Test
    fun `should create a new user with new login`() {
        val rjansem = User("rjansem", "Rudy", "rjansem@mail.com")
        StepVerifier.create(userService.create(rjansem))
                .expectSubscription()
                .expectNext(rjansem)
                .verifyComplete()
        StepVerifier.create(userRepository.exists("rjansem"))
                .expectSubscription()
                .expectNext(true)
                .verifyComplete()
    }

    @Test
    fun `should not create a new user because login unavailable`() {
        val rjansem = User("jntakpe", "Joss", "joss@mail.com")
        StepVerifier.create(userService.create(rjansem))
                .expectSubscription()
                .expectError(ConflictKeyException::class.java)
                .verify()
    }

    @Test
    fun `should update a user keeping login`() {
        val updated = User("cbarillet", "Updated", "updated@mail.com")
        StepVerifier.create(userService.update(updated, "cbarillet"))
                .expectSubscription()
                .expectNext(updated)
                .verifyComplete()
        StepVerifier.create(userRepository.exists("cbarillet"))
                .expectSubscription()
                .expectNext(true)
                .verifyComplete()
    }

    @Test
    fun `should update a user changing login`() {
        val updated = User("updated", "Updated", "updated@mail.com")
        StepVerifier.create(userService.update(updated, "bpoindron"))
                .expectSubscription()
                .expectNext(updated)
                .verifyComplete()
        StepVerifier.create(userRepository.exists("updated"))
                .expectSubscription()
                .expectNext(true)
                .verifyComplete()
        StepVerifier.create(userRepository.exists("bpoindron"))
                .expectSubscription()
                .expectNext(false)
                .verifyComplete()
    }

    @Test
    fun `should not update a user because login unavailable`() {
        val corentin = User("crinfray", "Coco", "coco@mail.com")
        StepVerifier.create(userService.update(corentin, "jntakpe"))
                .expectSubscription()
                .verifyError(ConflictKeyException::class.java)
    }

    @Test
    fun `should not update a user because old login doesn't exist`() {
        val corentin = User("toto", "Coco", "coco@mail.com")
        StepVerifier.create(userService.update(corentin, "unknown"))
                .expectSubscription()
                .verifyError(IdNotFoundException::class.java)
    }

    @Test
    fun `should delete user`() {
        StepVerifier.create(userService.delete("ToDelete"))
                .verifyComplete()
        StepVerifier.create(userRepository.exists("todelete"))
                .expectSubscription()
                .expectNext(false)
                .expectComplete()
    }

    @Test
    fun `should not delete user because unknown id`() {
        StepVerifier.create(userService.delete("unknown"))
                .expectSubscription()
                .verifyError(IdNotFoundException::class.java)
    }

}