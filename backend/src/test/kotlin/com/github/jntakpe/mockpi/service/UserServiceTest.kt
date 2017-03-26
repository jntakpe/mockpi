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
                    assertThat(user).isNotNull()
                    assertThat(user.login).isEqualTo(login)
                }
                .verifyComplete()
    }

    @Test
    fun `should find user by login because ignoring case`() {
        val login = "JNtaKpe"
        StepVerifier.create(userService.findByLogin(login))
                .expectSubscription()
                .consumeNextWith { user ->
                    assertThat(user).isNotNull()
                    assertThat(user.login).isEqualTo(login.toLowerCase())
                }
                .verifyComplete()
    }

    @Test
    fun `should not find user by login because unknown login`() {
        val login = "unknown"
        StepVerifier.create(userService.findByLogin(login))
                .expectSubscription()
                .expectNextCount(0)
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
                .verifyError(ConflictKeyException::class.java)
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
                .verifyError(ConflictKeyException::class.java)
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
    fun `should create a new user with new login with lowercase mail and login`() {
        val uppercase = User("UpperCase", "Upper Case", "UpperCase@mail.com")
        StepVerifier.create(userService.create(uppercase))
                .expectSubscription()
                .consumeNextWith {
                    (login, _, email) ->
                    assertThat(login).isEqualTo("uppercase")
                    assertThat(email).isEqualTo("uppercase@mail.com")
                }
                .verifyComplete()
        StepVerifier.create(userRepository.exists("uppercase"))
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
    fun `should not create a new user because email unavailable`() {
        val rjansem = User("jntakpe2", "Joss", "jntakpe@mail.com")
        StepVerifier.create(userService.create(rjansem))
                .expectSubscription()
                .expectError(ConflictKeyException::class.java)
                .verify()
    }

    @Test
    fun `should update a user keeping login`() {
        val updated = User("CBarillet", "Updated", "UpdatedCBA@mail.com")
        StepVerifier.create(userService.update(updated, "cbarillet"))
                .expectSubscription()
                .consumeNextWith {
                    (login, name, email) ->
                    assertThat(login).isEqualTo("cbarillet")
                    assertThat(name).isEqualTo("Updated")
                    assertThat(email).isEqualTo("updatedcba@mail.com")
                }
                .verifyComplete()
        StepVerifier.create(userRepository.exists("cbarillet"))
                .expectSubscription()
                .expectNext(true)
                .verifyComplete()
    }

    @Test
    fun `should update a user not uppercasing mail and login`() {
        val updated = User("BPoindron", "Updated", "BPoindron@mail.com")
        StepVerifier.create(userService.update(updated, "bpoindron"))
                .expectSubscription()
                .consumeNextWith {
                    (login, _, email) ->
                    assertThat(login).isEqualTo("bpoindron")
                    assertThat(email).isEqualTo("bpoindron@mail.com")
                }
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
    fun `should not update a user because email unavailable`() {
        val corentin = User("crinfray", "Coco", "jntakpe@mail.com")
        StepVerifier.create(userService.update(corentin, "crinfray"))
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