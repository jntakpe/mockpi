package com.github.jntakpe.mockpi.web

import com.github.jntakpe.mockpi.config.Urls
import com.github.jntakpe.mockpi.domain.Mock
import com.github.jntakpe.mockpi.domain.Request
import com.github.jntakpe.mockpi.domain.Response
import com.github.jntakpe.mockpi.repository.MockRepository
import com.github.jntakpe.mockpi.web.dto.IdName
import com.github.jntakpe.mockpi.web.dto.IdRequest
import org.assertj.core.api.Assertions.assertThat
import org.bson.types.ObjectId
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
        val result = client.get().uri(Urls.MOCKS_API)
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
    fun `should get mock by id`() {
        val demo1Name = "demo_1"
        val mock = mockRepository.findByNameIgnoreCase(demo1Name).block()
        val result = client.get().uri(Urls.MOCKS_API + Urls.BY_ID, mock.id!!)
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
    fun `should not get mock by id if unknown id`() {
        client.get().uri(Urls.MOCKS_API + Urls.BY_ID, ObjectId())
                .exchange()
                .expectStatus().isNotFound
    }

    @Test
    fun `should find duplicate at end`() {
        val name = "demo"
        val result = client.get().uri(Urls.MOCKS_API + Urls.BY_NEXT_NAME_AVAILABLE, name)
                .exchange()
                .expectStatus().isOk
                .returnResult(String::class.java)
        result.responseBody.test().expectNext("demo_6").verifyComplete()
    }

    @Test
    fun `should not find duplicate if unknown name`() {
        client.get().uri(Urls.MOCKS_API + Urls.BY_NEXT_NAME_AVAILABLE, "unknown")
                .exchange()
                .expectStatus().isNotFound
    }

    @Test
    fun `should create new mock`() {
        val mockName = "postMock"
        val mockBody = "mockBody"
        val result = client.post().uri(Urls.MOCKS_API).accept(APPLICATION_JSON_UTF8)
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
        client.post().uri(Urls.MOCKS_API).accept(APPLICATION_JSON_UTF8)
                .body(Mock("dEMo_1", Request("/some", GET), Response("test")).toMono(), Mock::class.java)
                .exchange()
                .expectStatus().isEqualTo(HttpStatus.CONFLICT)
    }

    @Test
    fun `should verify that name is available`() {
        val name = "unknown_name"
        val result = client.post().uri(Urls.MOCKS_API + Urls.CHECK_NAME_AVAILABLE).accept(APPLICATION_JSON_UTF8)
                .body(IdName(name).toMono(), IdName::class.java)
                .exchange()
                .expectStatus().isOk
                .returnResult(String::class.java)
        result.responseBody.test()
                .expectNext(name)
                .verifyComplete()
    }

    @Test
    fun `should verify that name is not available`() {
        val mock = mockRepository.findAll().blockFirst()
        client.post().uri(Urls.MOCKS_API + Urls.CHECK_NAME_AVAILABLE).accept(APPLICATION_JSON_UTF8)
                .body(IdName(mock.name).toMono(), IdName::class.java)
                .exchange()
                .expectStatus().isEqualTo(HttpStatus.CONFLICT)
    }

    @Test
    fun `should verify that request is available`() {
        val request = Request("available/request", POST)
        val result = client.post().uri(Urls.MOCKS_API + Urls.CHECK_REQUEST_AVAILABLE).accept(APPLICATION_JSON_UTF8)
                .body(IdRequest(request).toMono(), IdRequest::class.java)
                .exchange()
                .expectStatus().isOk
                .returnResult(Request::class.java)
        result.responseBody.test()
                .consumeNextWith { assertThat(it.path).containsIgnoringCase("available/request") }
                .verifyComplete()
    }

    @Test
    fun `should verify that request is not available`() {
        val mock = mockRepository.findAll().blockFirst()
        client.post().uri(Urls.MOCKS_API + Urls.CHECK_REQUEST_AVAILABLE).accept(APPLICATION_JSON_UTF8)
                .body(IdRequest(mock.request).toMono(), IdRequest::class.java)
                .exchange()
                .expectStatus().isEqualTo(HttpStatus.CONFLICT)
    }

    @Test
    fun `should update mock`() {
        val updatedName = "updatedfromapi"
        val updatedPath = "${Urls.FAKE_PREFIX}/updated/from/api"
        val updatedBody = "updatedBody"
        val id = mockRepository.findByNameIgnoreCase("toupdateapi").block().id
        val result = client.put().uri(Urls.MOCKS_API + Urls.BY_ID, id!!).accept(APPLICATION_JSON_UTF8)
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
        val mock = mockRepository.findByNameIgnoreCase("toupdateapi").block()
        client.put().uri(Urls.MOCKS_API + Urls.BY_ID, mock.id).accept(APPLICATION_JSON_UTF8)
                .body(Mock("demo_1", Request("/path", POST), Response("body")).toMono(), Mock::class.java)
                .exchange()
                .expectStatus().isEqualTo(HttpStatus.CONFLICT)
    }

    @Test
    fun `should delete mock`() {
        val mock = mockRepository.findByNameIgnoreCase("todeleteapi").block()
        client.delete().uri(Urls.MOCKS_API + Urls.BY_ID, mock.id)
                .exchange()
                .expectStatus().isNoContent
    }

    @Test
    fun `should not delete mock because missing`() {
        client.delete().uri(Urls.MOCKS_API + Urls.BY_ID, ObjectId().toString())
                .exchange()
                .expectStatus().isNotFound
    }

}