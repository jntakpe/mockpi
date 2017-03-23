package com.github.jntakpe.mockpi.web

import com.github.jntakpe.mockpi.config.Urls
import com.github.jntakpe.mockpi.domain.Mock
import com.github.jntakpe.mockpi.domain.Request
import com.github.jntakpe.mockpi.domain.Response
import org.assertj.core.api.Assertions
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.reactive.server.WebTestClient
import org.springframework.validation.Validator
import org.springframework.web.bind.annotation.RequestMethod
import reactor.core.publisher.Mono
import reactor.test.StepVerifier

@SpringBootTest
@RunWith(SpringRunner::class)
class MockResourceTest {

    @Autowired
    lateinit var mockResource: MockResource

    @Autowired
    lateinit var webAdvising: WebAdvising

    @Autowired
    lateinit var webFluxValidator: Validator

    lateinit var client: WebTestClient

    @Before
    fun setUp() {
        client = WebTestClient.bindToController(mockResource).validator(webFluxValidator).controllerAdvice(webAdvising).build()
    }

    @Test
    fun `should get mock by name`() {
        val demo1Name = "demo1"
        val result = client.get().uri(Urls.MOCK_API + "/{name}", demo1Name)
                .exchange()
                .expectStatus().isOk
                .expectHeader().contentType(MediaType.APPLICATION_JSON_UTF8)
                .expectBody(Mock::class.java)
                .returnResult<Mock>()
        StepVerifier.create(result.responseBody).consumeNextWith {
            (name, request, response) ->
            Assertions.assertThat(name).isEqualTo(demo1Name)
            Assertions.assertThat(request).isNotNull()
            Assertions.assertThat(request.path).isEqualTo("/users/1")
            Assertions.assertThat(response).isNotNull()
        }
    }

    @Test
    fun `should get mock by name ignoring case`() {
        val result = client.get().uri(Urls.MOCK_API + "/{name}", "deMO1")
                .exchange()
                .expectStatus().isOk
                .expectHeader().contentType(MediaType.APPLICATION_JSON_UTF8)
                .expectBody(Mock::class.java)
                .returnResult<Mock>()
        StepVerifier.create(result.responseBody).consumeNextWith {
            (name, request, response) ->
            Assertions.assertThat(name).isEqualTo(name)
            Assertions.assertThat(request).isNotNull()
            Assertions.assertThat(request.path).isEqualTo("/users/1")
            Assertions.assertThat(response).isNotNull()
        }
    }

    @Test
    fun `should not get mock by name if unknown name`() {
        client.get().uri(Urls.MOCK_API + "/{name}", "unknown")
                .exchange()
                .expectStatus().isNotFound
    }

    @Test
    fun `should create new mock`() {
        val mockName = "postMock"
        val mockBody = "mockBody"
        val result = client.post().uri(Urls.MOCK_API).accept(MediaType.APPLICATION_JSON_UTF8)
                .exchange(Mono.just(Mock(mockName, Request("/post/mock", RequestMethod.GET), Response(mockBody))), Mock::class.java)
                .expectStatus().isCreated
                .expectHeader().contentType(MediaType.APPLICATION_JSON_UTF8)
                .expectBody(Mock::class.java)
                .returnResult<Mock>()
        StepVerifier.create(result.responseBody).consumeNextWith {
            (name, request, response) ->
            Assertions.assertThat(name).isEqualTo(mockName)
            Assertions.assertThat(request).isNotNull()
            Assertions.assertThat(request.path).isEqualTo("/post/mock")
            Assertions.assertThat(response).isNotNull()
            Assertions.assertThat(response.body).isEqualTo(mockBody)
        }
    }

    @Test
    fun `should not create new user cuz login taken`() {
        client.post().uri(Urls.MOCK_API).accept(MediaType.APPLICATION_JSON_UTF8)
                .exchange(Mono.just(Mock("dEMo1", Request("/some", RequestMethod.GET), Response("test"))), Mock::class.java)
                .expectStatus().isEqualTo(HttpStatus.CONFLICT)
    }
}