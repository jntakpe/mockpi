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
import reactor.core.publisher.test

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
        userService.findByLogin(login).test()
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
        userService.findByLogin(login).test()
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
        userService.findByLogin(login).test()
                .expectSubscription()
                .expectNextCount(0)
                .verifyComplete()
    }

    @Test
    fun `should accept login because none existing`() {
        val newlogin = "newlogin"
        userService.verifyLoginAvailable(newlogin).test()
                .expectSubscription()
                .expectNext(newlogin)
                .verifyComplete()
    }

    @Test
    fun `should refuse login because same login exist`() {
        userService.verifyLoginAvailable("JNtakpe").test()
                .expectSubscription()
                .verifyError(ConflictKeyException::class.java)
    }

    @Test
    fun `should accept login because old login is the same`() {
        val login = "JNtakpe"
        userService.verifyLoginAvailable(login, "jntakpe").test()
                .expectSubscription()
                .expectNext(login)
                .verifyComplete()
    }

    @Test
    fun `should refuse login because old login is not the same`() {
        userService.verifyLoginAvailable("JNtakpe", "oldlogin").test()
                .expectSubscription()
                .verifyError(ConflictKeyException::class.java)
    }

    @Test
    fun `should register a new user with new login`() {
        val rjansem = User("rjansem", "Rudy", "rjansem@mail.com")
        userService.register(rjansem).test()
                .expectSubscription()
                .expectNext(rjansem)
                .verifyComplete()
        userRepository.exists("rjansem").test()
                .expectSubscription()
                .expectNext(true)
                .verifyComplete()
    }

    @Test
    fun `should register a new user with new login with lowercase mail and login`() {
        val uppercase = User("UpperCase", "Upper Case", "UpperCase@mail.com")
        userService.register(uppercase).test()
                .expectSubscription()
                .consumeNextWith {
                    (login, _, email) ->
                    assertThat(login).isEqualTo("uppercase")
                    assertThat(email).isEqualTo("uppercase@mail.com")
                }
                .verifyComplete()
        userRepository.exists("uppercase").test()
                .expectSubscription()
                .expectNext(true)
                .verifyComplete()
    }

    @Test
    fun `should not register a new user because login unavailable`() {
        val rjansem = User("jntakpe", "Joss", "joss@mail.com")
        userService.register(rjansem).test()
                .expectSubscription()
                .expectError(ConflictKeyException::class.java)
                .verify()
    }

    @Test
    fun `should not register a new user because email unavailable`() {
        val rjansem = User("jntakpe2", "Joss", "jntakpe@mail.com")
        userService.register(rjansem).test()
                .expectSubscription()
                .expectError(ConflictKeyException::class.java)
                .verify()
    }

    @Test
    fun `should update a user keeping login`() {
        val updated = User("CBarillet", "Updated", "UpdatedCBA@mail.com")
        userService.update(updated, "cbarillet").test()
                .expectSubscription()
                .consumeNextWith {
                    (login, name, email) ->
                    assertThat(login).isEqualTo("cbarillet")
                    assertThat(name).isEqualTo("Updated")
                    assertThat(email).isEqualTo("updatedcba@mail.com")
                }
                .verifyComplete()
        userRepository.exists("cbarillet").test()
                .expectSubscription()
                .expectNext(true)
                .verifyComplete()
    }

    @Test
    fun `should update a user not uppercasing mail and login`() {
        val updated = User("BPoindron", "Updated", "BPoindron@mail.com")
        userService.update(updated, "bpoindron").test()
                .expectSubscription()
                .consumeNextWith {
                    (login, _, email) ->
                    assertThat(login).isEqualTo("bpoindron")
                    assertThat(email).isEqualTo("bpoindron@mail.com")
                }
                .verifyComplete()
        userRepository.exists("cbarillet").test()
                .expectSubscription()
                .expectNext(true)
                .verifyComplete()
    }

    @Test
    fun `should update a user changing login`() {
        val updated = User("updated", "Updated", "updated@mail.com")
        userService.update(updated, "bpoindron").test()
                .expectSubscription()
                .expectNext(updated)
                .verifyComplete()
        userRepository.exists("updated").test()
                .expectSubscription()
                .expectNext(true)
                .verifyComplete()
        userRepository.exists("bpoindron").test()
                .expectSubscription()
                .expectNext(false)
                .verifyComplete()
    }

    @Test
    fun `should not update a user because login unavailable`() {
        val corentin = User("crinfray", "Coco", "coco@mail.com")
        userService.update(corentin, "jntakpe").test()
                .expectSubscription()
                .verifyError(ConflictKeyException::class.java)
    }

    @Test
    fun `should not update a user because email unavailable`() {
        val corentin = User("crinfray", "Coco", "jntakpe@mail.com")
        userService.update(corentin, "crinfray").test()
                .expectSubscription()
                .verifyError(ConflictKeyException::class.java)
    }

    @Test
    fun `should not update a user because old login doesn't exist`() {
        val corentin = User("toto", "Coco", "coco@mail.com")
        userService.update(corentin, "unknown").test()
                .expectSubscription()
                .verifyError(IdNotFoundException::class.java)
    }

    @Test
    fun `should delete user`() {
        userService.delete("ToDelete").test()
                .verifyComplete()
        userRepository.exists("todelete").test()
                .expectSubscription()
                .expectNext(false)
                .expectComplete()
    }

    @Test
    fun `should not delete user because unknown id`() {
        userService.delete("unknown").test()
                .expectSubscription()
                .verifyError(IdNotFoundException::class.java)
    }

}