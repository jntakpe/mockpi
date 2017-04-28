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
    fun `should find user by username because exact match`() {
        val username = "jntakpe"
        userService.findByUsername(username).test()
                .expectSubscription()
                .consumeNextWith { user ->
                    assertThat(user).isNotNull()
                    assertThat(user.username).isEqualTo(username)
                }
                .verifyComplete()
    }

    @Test
    fun `should find user by username because ignoring case`() {
        val username = "JNtaKpe"
        userService.findByUsername(username).test()
                .expectSubscription()
                .consumeNextWith { user ->
                    assertThat(user).isNotNull()
                    assertThat(user.username).isEqualTo(username.toLowerCase())
                }
                .verifyComplete()
    }

    @Test
    fun `should not find user by username because unknown username`() {
        val username = "unknown"
        userService.findByUsername(username).test()
                .expectSubscription()
                .expectNextCount(0)
                .verifyComplete()
    }

    @Test
    fun `should accept username because none existing`() {
        val newusername = "newusername"
        userService.verifyUsernameAvailable(newusername).test()
                .expectSubscription()
                .expectNext(newusername)
                .verifyComplete()
    }

    @Test
    fun `should refuse username because same username exist`() {
        userService.verifyUsernameAvailable("JNtakpe").test()
                .expectSubscription()
                .verifyError(ConflictKeyException::class.java)
    }

    @Test
    fun `should accept username because old id is the same`() {
        val jntakpe = userRepository.findByUsernameIgnoreCase("jntakpe").block()
        userService.verifyUsernameAvailable("JNtakpe", jntakpe.id).test()
                .expectSubscription()
                .expectNext("JNtakpe")
                .verifyComplete()
    }

    @Test
    fun `should refuse username because old id is not the same`() {
        userService.verifyUsernameAvailable("JNtakpe", "unknownid").test()
                .expectSubscription()
                .verifyError(ConflictKeyException::class.java)
    }

    @Test
    fun `should accept mail because none existing`() {
        val mail = "totonew@mail.com"
        userService.verifyEmailAvailable(mail).test()
                .expectSubscription()
                .expectNext(mail)
                .verifyComplete()
    }

    @Test
    fun `should refuse mail because same mail exist`() {
        userService.verifyEmailAvailable("jntakpe@mail.com").test()
                .expectSubscription()
                .verifyError(ConflictKeyException::class.java)
    }

    @Test
    fun `should accept mail because old id is the same`() {
        val jntakpe = userRepository.findByUsernameIgnoreCase("jntakpe").block()
        userService.verifyEmailAvailable("jntakpe@mail.com", jntakpe.id).test()
                .expectSubscription()
                .expectNext(jntakpe.email)
                .verifyComplete()
    }

    @Test
    fun `should refuse mail because old id is not the same`() {
        userService.verifyEmailAvailable("jntakpe@mail.com", "unknownid").test()
                .expectSubscription()
                .verifyError(ConflictKeyException::class.java)
    }

    @Test
    fun `should register a new user with new username`() {
        val rjansem = User("rjansem", "Rudy", "rjansem@mail.com", "pwd")
        val list = mutableListOf<User>()
        userService.register(rjansem).test()
                .expectSubscription()
                .recordWith { list }
                .consumeNextWith {
                    assertThat(it.id).isNotEmpty()
                    assertThat(it.username).isEqualTo(rjansem.username)
                    assertThat(it.email).isEqualTo(rjansem.email)
                    assertThat(it.name).isEqualTo(rjansem.name)
                    assertThat(it.password).isEqualTo(rjansem.password)
                }
                .then {
                    assertThat(list).isNotEmpty.hasSize(1)
                    userRepository.exists(list[0].id).test()
                            .expectSubscription()
                            .expectNext(true)
                            .verifyComplete()
                }
                .verifyComplete()
    }

    @Test
    fun `should register a new user with new username with lowercase mail and username`() {
        val uppercase = User("UpperCase", "Upper Case", "UpperCase@mail.com", "pwd")
        userService.register(uppercase).test()
                .expectSubscription()
                .consumeNextWith {
                    assertThat(it.username).isEqualTo("uppercase")
                    assertThat(it.email).isEqualTo("uppercase@mail.com")
                }
                .verifyComplete()
    }

    @Test
    fun `should not register a new user because username unavailable`() {
        val rjansem = User("jntakpe", "Joss", "joss@mail.com", "pwd")
        userService.register(rjansem).test()
                .expectSubscription()
                .expectError(ConflictKeyException::class.java)
                .verify()
    }

    @Test
    fun `should not register a new user because email unavailable`() {
        val rjansem = User("jntakpe2", "Joss", "jntakpe@mail.com", "pwd")
        userService.register(rjansem).test()
                .expectSubscription()
                .expectError(ConflictKeyException::class.java)
                .verify()
    }

    @Test
    fun `should update a user keeping username`() {
        val updated = User("CBarillet", "Updated", "UpdatedCBA@mail.com", "pwd")
        userService.update(updated, "cbarillet").test()
                .expectSubscription()
                .consumeNextWith {
                    (username, name, email) ->
                    assertThat(username).isEqualTo("cbarillet")
                    assertThat(name).isEqualTo("Updated")
                    assertThat(email).isEqualTo("updatedcba@mail.com")
                }
                .verifyComplete()
    }

    @Test
    fun `should update a user not uppercasing mail and username`() {
        val updated = User("JMADIh", "Updated", "JAJAMAIL@mail.com", "pwd")
        userService.update(updated, "jmadih").test()
                .expectSubscription()
                .consumeNextWith {
                    (username, _, email) ->
                    assertThat(username).isEqualTo("jmadih")
                    assertThat(email).isEqualTo("jajamail@mail.com")
                }
                .verifyComplete()
    }

    @Test
    fun `should update a user changing username`() {
        val updated = User("updated", "Updated", "updated@mail.com", "pwd")
        userService.update(updated, "bpoindron").test()
                .expectSubscription()
                .expectNext(updated)
                .then {
                    userRepository.findByUsernameIgnoreCase("updated").test()
                            .expectSubscription()
                            .expectNextCount(1)
                            .verifyComplete()
                    userRepository.findByUsernameIgnoreCase("bpoindron").test()
                            .expectSubscription()
                            .expectNextCount(0)
                            .verifyComplete()
                }
                .verifyComplete()
    }

    @Test
    fun `should not update a user because username unavailable`() {
        val corentin = User("crinfray", "Coco", "coco@mail.com", "pwd")
        userService.update(corentin, "jntakpe").test()
                .expectSubscription()
                .verifyError(ConflictKeyException::class.java)
    }

    @Test
    fun `should not update a user because email unavailable`() {
        val corentin = User("crinfray", "Coco", "jntakpe@mail.com", "pwd")
        userService.update(corentin, "crinfray").test()
                .expectSubscription()
                .verifyError(ConflictKeyException::class.java)
    }

    @Test
    fun `should not update a user because old username doesn't exist`() {
        val corentin = User("toto", "Coco", "coco@mail.com", "pwd")
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