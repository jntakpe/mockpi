package com.github.jntakpe.mockpi.web

import com.github.jntakpe.mockpi.config.Urls
import com.github.jntakpe.mockpi.domain.Mock
import com.github.jntakpe.mockpi.domain.Request
import com.github.jntakpe.mockpi.domain.Response
import com.github.jntakpe.mockpi.repository.MockRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpMethod.GET
import org.springframework.http.HttpMethod.POST
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType.APPLICATION_JSON_UTF8
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.reactive.server.WebTestClient
import reactor.core.publisher.test
import reactor.core.publisher.toMono

@SpringBootTest
@RunWith(SpringRunner::class)
class MockResourceTest {

    @Autowired
    lateinit var mockResource: MockResource

    @Autowired
    lateinit var mockRepository: MockRepository

    @Autowired
    lateinit var webAdvising: WebAdvising

    lateinit var client: WebTestClient

    @Before
    fun setUp() {
        client = WebTestClient.bindToController(mockResource).controllerAdvice(webAdvising).build()
    }

    @Test
    fun `should find all mocks`() {
        val count = mockRepository.count().block()
        val result = client.get().uri(Urls.MOCK_API)
                .exchange()
                .expectStatus().isOk
                .expectHeader().contentType(APPLICATION_JSON_UTF8)
                .returnResult(Mock::class.java)
        result.responseBody.test()
                .expectNextCount(count)
                .expectComplete()
                .verify()
    }

    @Test
    fun `should get mock by name`() {
        val demo1Name = "demo_1"
        val result = client.get().uri(Urls.MOCK_API + Urls.BY_NAME, demo1Name)
                .exchange()
                .expectStatus().isOk
                .expectHeader().contentType(APPLICATION_JSON_UTF8)
                .returnResult(Mock::class.java)
        result.responseBody.test().consumeNextWith {
            (name, request, response) ->
            assertThat(name).isEqualTo(demo1Name)
            assertThat(request).isNotNull()
            assertThat(request.path).isEqualTo("${Urls.FAKE_PREFIX}/users/1")
            assertThat(response).isNotNull()
        }.verifyComplete()
    }

    @Test
    fun `should get mock by name ignoring case`() {
        val result = client.get().uri(Urls.MOCK_API + Urls.BY_NAME, "deMO_1")
                .exchange()
                .expectStatus().isOk
                .expectHeader().contentType(APPLICATION_JSON_UTF8)
                .returnResult(Mock::class.java)
        result.responseBody.test().consumeNextWith {
            (name, request, response) ->
            assertThat(name).isEqualTo(name)
            assertThat(request).isNotNull()
            assertThat(request.path).isEqualTo("${Urls.FAKE_PREFIX}/users/1")
            assertThat(response).isNotNull()
        }.verifyComplete()
    }

    @Test
    fun `should not get mock by name if unknown name`() {
        client.get().uri(Urls.MOCK_API + Urls.BY_NAME, "unknown")
                .exchange()
                .expectStatus().isNotFound
    }

    @Test
    fun `should find duplicate at end`() {
        val name = "demo"
        val result = client.get().uri(Urls.MOCK_API + Urls.BY_NAME_AVAILABLE_DUPLICATE, name)
                .exchange()
                .expectStatus().isOk
                .returnResult(String::class.java)
        result.responseBody.test().expectNext("demo_6").verifyComplete()
    }

    @Test
    fun `should create new mock`() {
        val mockName = "postMock"
        val mockBody = "mockBody"
        val result = client.post().uri(Urls.MOCK_API).accept(APPLICATION_JSON_UTF8)
                .body(Mock(mockName, Request("/post/mock", GET), Response(mockBody)).toMono(), Mock::class.java)
                .exchange()
                .expectStatus().isCreated
                .expectHeader().contentType(APPLICATION_JSON_UTF8)
                .returnResult(Mock::class.java)
        result.responseBody.test().consumeNextWith {
            (name, request, response) ->
            assertThat(name).isEqualTo(mockName.toLowerCase())
            assertThat(request).isNotNull()
            assertThat(request.path).isEqualTo("${Urls.FAKE_PREFIX}/post/mock")
            assertThat(response).isNotNull()
            assertThat(response.body).isEqualTo(mockBody)
        }.verifyComplete()
    }

    @Test
    fun `should not create new mock cuz login taken`() {
        client.post().uri(Urls.MOCK_API).accept(APPLICATION_JSON_UTF8)
                .body(Mock("dEMo_1", Request("/some", GET), Response("test")).toMono(), Mock::class.java)
                .exchange()
                .expectStatus().isEqualTo(HttpStatus.CONFLICT)
    }

    @Test
    fun `should update mock`() {
        val updatedName = "updatedfromapi"
        val updatedPath = "${Urls.FAKE_PREFIX}/updated/from/api"
        val updatedBody = "updatedBody"
        val result = client.put().uri(Urls.MOCK_API + Urls.BY_NAME, "toupdateapi").accept(APPLICATION_JSON_UTF8)
                .body(Mock(updatedName, Request(updatedPath, POST), Response(updatedBody)).toMono(), Mock::class.java)
                .exchange()
                .expectStatus().isOk
                .expectHeader().contentType(APPLICATION_JSON_UTF8)
                .returnResult(Mock::class.java)
        result.responseBody.test().consumeNextWith {
            (name, request, response) ->
            assertThat(name).isEqualTo(updatedName)
            assertThat(request).isNotNull()
            assertThat(request.path).isEqualTo(updatedPath)
            assertThat(response).isNotNull()
            assertThat(response.body).isEqualTo(updatedBody)
        }.verifyComplete()
    }

    @Test
    fun `should not update mock because name taken`() {
        client.put().uri(Urls.MOCK_API + Urls.BY_NAME, "toupdateapi").accept(APPLICATION_JSON_UTF8)
                .body(Mock("demo_1", Request("/path", POST), Response("body")).toMono(), Mock::class.java)
                .exchange()
                .expectStatus().isEqualTo(HttpStatus.CONFLICT)
    }

    @Test
    fun `should delete mock`() {
        client.delete().uri(Urls.MOCK_API + Urls.BY_NAME, "todeleteapi")
                .exchange()
                .expectStatus().isNoContent
    }

    @Test
    fun `should not delete mock because missing`() {
        client.delete().uri(Urls.MOCK_API + Urls.BY_NAME, "unknown")
                .exchange()
                .expectStatus().isNotFound
    }

}