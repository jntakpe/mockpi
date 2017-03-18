package com.github.jntakpe.mockpi.web

import com.github.jntakpe.mockpi.config.Urls
import com.github.jntakpe.mockpi.domain.User
import org.assertj.core.api.Assertions.assertThat
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.reactive.server.WebTestClient
import reactor.test.StepVerifier

@SpringBootTest
@RunWith(SpringRunner::class)
class UserResourceTest {

    @Autowired
    lateinit var userResource: UserResource

    lateinit var client: WebTestClient

    @Before
    fun setUp() {
        client = WebTestClient.bindToController(userResource).build()
    }

    @Test
    fun `should get user by login`() {
        val result = client.get().uri(Urls.USERS_API + "/{login}", "jntakpe")
                .exchange()
                .expectStatus().isOk
                .expectHeader().contentType(MediaType.APPLICATION_JSON_UTF8)
                .expectBody(User::class.java)
                .returnResult<User>()
        StepVerifier.create(result.responseBody).consumeNextWith {
            (login, name, email) ->
            run {
                assertThat(login).isEqualTo("jntakpe")
                assertThat(name).isEqualTo("Joss")
                assertThat(email).isEqualTo("jntakpe@mail.com")
            }
        }
    }

    @Test
    fun `should get user by login ignoring case`() {
        val result = client.get().uri(Urls.USERS_API + "/{login}", "JNtakpe")
                .exchange()
                .expectStatus().isOk
                .expectHeader().contentType(MediaType.APPLICATION_JSON_UTF8)
                .expectBody(User::class.java)
                .returnResult<User>()
        StepVerifier.create(result.responseBody).consumeNextWith {
            (login, name, email) ->
            run {
                assertThat(login).isEqualTo("jntakpe")
                assertThat(name).isEqualTo("Joss")
                assertThat(email).isEqualTo("jntakpe@mail.com")
            }
        }
    }

    @Test
    fun `should not get user by login if unknown login`() {
        client.get().uri(Urls.USERS_API + "/{login}", "unknown")
                .exchange()
                .expectStatus().isNotFound
    }


}