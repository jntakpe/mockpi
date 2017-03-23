package com.github.jntakpe.mockpi.web

import com.github.jntakpe.mockpi.config.Urls
import com.github.jntakpe.mockpi.domain.Mock
import org.assertj.core.api.Assertions
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
class MockResourceTest {

    @Autowired
    lateinit var mockResource: MockResource

    @Autowired
    lateinit var webAdvising: WebAdvising

    lateinit var client: WebTestClient

    @Before
    fun setUp() {
        client = WebTestClient.bindToController(mockResource).controllerAdvice(webAdvising).build()
    }

    @Test
    fun `should get mock by name`() {
        val name = "demo1"
        val result = client.get().uri(Urls.MOCK_API + "/{name}", name)
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
}