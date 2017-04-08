package com.github.jntakpe.mockpi.web

import com.github.jntakpe.mockpi.config.Urls
import com.github.jntakpe.mockpi.domain.User
import org.assertj.core.api.Assertions.assertThat
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.reactive.server.WebTestClient
import reactor.core.publisher.test
import reactor.core.publisher.toMono

@SpringBootTest
@RunWith(SpringRunner::class)
class UserResourceTest {

    @Autowired
    lateinit var userResource: UserResource

    @Autowired
    lateinit var webAdvising: WebAdvising

    lateinit var client: WebTestClient

    @Before
    fun setUp() {
        client = WebTestClient.bindToController(userResource).controllerAdvice(webAdvising).build()
    }

    @Test
    fun `should get user by username`() {
        val result = client.get().uri(Urls.USERS_API + "/{username}", "jntakpe")
                .exchange()
                .expectStatus().isOk
                .expectHeader().contentType(MediaType.APPLICATION_JSON_UTF8)
                .expectBody(User::class.java)
                .returnResult<User>()
        result.responseBody.test().consumeNextWith {
            (username, name, email) ->
            assertThat(username).isEqualTo("jntakpe")
            assertThat(name).isEqualTo("Joss")
            assertThat(email).isEqualTo("jntakpe@mail.com")
        }.verifyComplete()
    }

    @Test
    fun `should get user by username ignoring case`() {
        val result = client.get().uri(Urls.USERS_API + "/{username}", "JNtakpe")
                .exchange()
                .expectStatus().isOk
                .expectHeader().contentType(MediaType.APPLICATION_JSON_UTF8)
                .expectBody(User::class.java)
                .returnResult<User>()
        result.responseBody.test().consumeNextWith {
            (username, name, email) ->
            assertThat(username).isEqualTo("jntakpe")
            assertThat(name).isEqualTo("Joss")
            assertThat(email).isEqualTo("jntakpe@mail.com")
        }.verifyComplete()
    }

    @Test
    fun `should not get user by username if unknown username`() {
        client.get().uri(Urls.USERS_API + "/{username}", "unknown")
                .exchange()
                .expectStatus().isNotFound
    }

    @Test
    fun `should create new user`() {
        val result = client.post().uri(Urls.USERS_API).accept(MediaType.APPLICATION_JSON_UTF8)
                .body(User("postUser", "Post user", "postUser@mail.com", "pwd").toMono(), User::class.java)
                .exchange()
                .expectStatus().isCreated
                .expectHeader().contentType(MediaType.APPLICATION_JSON_UTF8)
                .expectBody(User::class.java)
                .returnResult<User>()
        result.responseBody.test().consumeNextWith {
            (username, name, email) ->
            assertThat(username).isEqualTo("postuser")
            assertThat(name).isEqualTo("Post user")
            assertThat(email).isEqualTo("postuser@mail.com")
        }.verifyComplete()
    }

    @Test
    fun `should not create new user cuz username taken`() {
        client.post().uri(Urls.USERS_API).accept(MediaType.APPLICATION_JSON_UTF8)
                .body(User("jntakpe", "Joss", "jntakpe@mail.com", "pwd").toMono(), User::class.java)
                .exchange()
                .expectStatus().isEqualTo(HttpStatus.CONFLICT)
    }

}