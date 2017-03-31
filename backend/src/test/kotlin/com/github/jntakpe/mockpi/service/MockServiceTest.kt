package com.github.jntakpe.mockpi.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.github.jntakpe.mockpi.domain.Mock
import com.github.jntakpe.mockpi.domain.Request
import com.github.jntakpe.mockpi.domain.Response
import com.github.jntakpe.mockpi.exceptions.ConflictKeyException
import com.github.jntakpe.mockpi.exceptions.IdNotFoundException
import com.github.jntakpe.mockpi.repository.MockRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpHeaders.*
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.web.bind.annotation.RequestMethod.GET
import org.springframework.web.bind.annotation.RequestMethod.POST
import reactor.core.publisher.test

@SpringBootTest
@RunWith(SpringRunner::class)
class MockServiceTest {

    @Autowired
    lateinit var mockService: MockService

    @Autowired
    lateinit var mockRepository: MockRepository

    @Test
    fun `should find all mocks`() {
        val count = mockRepository.count().block()
        mockService.findAll().test()
                .expectSubscription()
                .expectNextCount(count)
                .verifyComplete()
    }

    @Test
    fun `should find mock by name because exact match`() {
        val name = "demo1"
        mockService.findByName(name).test()
                .expectSubscription()
                .consumeNextWith { mock ->
                    assertThat(mock).isNotNull()
                    assertThat(mock.name).isEqualTo(name)
                }
                .verifyComplete()
    }

    @Test
    fun `should find mock by name ignoring case`() {
        val name = "DEMO1"
        mockService.findByName(name).test()
                .expectSubscription()
                .consumeNextWith { mock ->
                    assertThat(mock).isNotNull()
                    assertThat(mock.name).isEqualTo(name.toLowerCase())
                }
                .verifyComplete()
    }

    @Test
    fun `should not find mock because unknown name`() {
        mockService.findByName("unknown").test()
                .expectSubscription()
                .expectNextCount(0)
                .verifyComplete()
    }

    @Test
    fun `shoud accept name because none existing`() {
        val newName = "newname"
        mockService.verifyNameAvailable(newName).test()
                .expectSubscription()
                .expectNext(newName)
                .verifyComplete()
    }

    @Test
    fun `shoud refuse name because same name exist`() {
        val newName = "dEMO1"
        mockService.verifyNameAvailable(newName).test()
                .expectSubscription()
                .verifyError(ConflictKeyException::class.java)
    }

    @Test
    fun `should accept name because old name is the the same`() {
        val name = "DEmo1"
        mockService.verifyNameAvailable(name, "demo1").test()
                .expectSubscription()
                .expectNext(name)
                .verifyComplete()
    }

    @Test
    fun `should refuse name because old name is not the same`() {
        mockService.verifyNameAvailable("Demo1", "oldName").test()
                .expectSubscription()
                .verifyError(ConflictKeyException::class.java)
    }

    @Test
    fun `should accept request because none existing`() {
        mockService.verifyRequestAvailable(Request("somenewrequest", GET)).test()
                .expectSubscription()
                .expectNextCount(1)
                .verifyComplete()
    }

    @Test
    fun `shoud refuse request because same request exist`() {
        mockService.verifyRequestAvailable(Request("/users/1", GET)).test()
                .expectSubscription()
                .verifyError(ConflictKeyException::class.java)
    }

    @Test
    fun `should accept request because old request is the the same`() {
        mockService.verifyRequestAvailable(Request("/users/1", GET), Request("/users/1", GET)).test()
                .expectSubscription()
                .expectNextCount(1)
                .verifyComplete()
    }

    @Test
    fun `should refuse request because old request is not the same`() {
        mockService.verifyRequestAvailable(Request("/users/1", GET), Request("/users/1", POST)).test()
                .expectSubscription()
                .verifyError(ConflictKeyException::class.java)
    }

    @Test
    fun `should find one response with request path and method`() {
        mockService.findMatchingMock(Request("/users/1", GET)).test()
                .expectSubscription()
                .consumeNextWith { response ->
                    assertThat(response).isNotNull()
                    assertThat(response.name).isEqualTo("demo1")
                }
                .verifyComplete()
    }

    @Test
    fun `should find none cuz path missmatch`() {
        mockService.findMatchingMock(Request("/user/1", GET)).test()
                .expectSubscription()
                .expectNextCount(0)
                .verifyComplete()
    }

    @Test
    fun `should find none cuz method missmatch`() {
        mockService.findMatchingMock(Request("/users/1", POST)).test()
                .expectSubscription()
                .expectNextCount(0)
                .verifyComplete()
    }

    @Test
    fun `should find one response with request path, method and one param`() {
        mockService.findMatchingMock(Request("/users/1", GET, mapOf(Pair("age", "20")), emptyMap())).test()
                .expectSubscription()
                .consumeNextWith { response ->
                    assertThat(response).isNotNull()
                    assertThat(response.name).isEqualTo("demo2")
                }
                .verifyComplete()
    }

    @Test
    fun `should find one response with request path, method and two params`() {
        val request = Request("/users/1", GET, mapOf(Pair("gender", "M"), Pair("age", "20")), emptyMap())
        mockService.findMatchingMock(request).test()
                .expectSubscription()
                .consumeNextWith { response ->
                    assertThat(response).isNotNull()
                    assertThat(response.name).isEqualTo("demo3")
                }
                .verifyComplete()
    }

    @Test
    fun `should find none because param missmatch`() {
        val request = Request("/users/1", GET, mapOf(Pair("gender", "Mme"), Pair("age", "20")), emptyMap())
        mockService.findMatchingMock(request).test()
                .expectSubscription()
                .expectNextCount(0)
                .verifyComplete()

    }

    @Test
    fun `should find one response with request path, method and no headers matching`() {
        val request = Request("/users/1", GET, emptyMap(), mapOf(Pair(ACCEPT, "*")))
        mockService.findMatchingMock(request).test()
                .expectSubscription()
                .consumeNextWith { response ->
                    assertThat(response).isNotNull()
                    assertThat(response.name).isEqualTo("demo1")
                }
                .verifyComplete()
    }

    @Test
    fun `should find one response with request path, method and one headers matching`() {
        val request = Request("/users/2", GET, emptyMap(), mapOf(Pair(ACCEPT, "*")))
        mockService.findMatchingMock(request).test()
                .expectSubscription()
                .consumeNextWith { response ->
                    assertThat(response).isNotNull()
                    assertThat(response.name).isEqualTo("demo4")
                }
                .verifyComplete()
    }

    @Test
    fun `should find one response with request path, method and two headers matching`() {
        val request = Request("/users/2", GET, emptyMap(), mapOf(Pair(CACHE_CONTROL, "no-cache"), Pair(CONTENT_TYPE, "application/json")))
        mockService.findMatchingMock(request).test()
                .expectSubscription()
                .consumeNextWith { response ->
                    assertThat(response).isNotNull()
                    assertThat(response.name).isEqualTo("demo5")
                }
                .verifyComplete()
    }

    @Test
    fun `should not find because accept header missing`() {
        val request = Request("/users/2", GET, emptyMap(), mapOf(Pair(CONTENT_TYPE, "application/json")))
        mockService.findMatchingMock(request).test()
                .expectSubscription()
                .expectNextCount(0)
                .verifyComplete()
    }

    @Test
    fun `should not find because accept header wrong value`() {
        val request = Request("/users/2", GET, emptyMap(), mapOf(Pair(ACCEPT, "ALL")))
        mockService.findMatchingMock(request).test()
                .expectSubscription()
                .expectNextCount(0)
                .verifyComplete()
    }

    @Test
    fun `should create basic mock`() {
        val mockName = "basicmock"
        val path = "/basicmock"
        val mock = Mock(mockName, Request(path, GET), Response(ObjectMapper().writeValueAsString(Pair("basic", "mock"))))
        mockService.create(mock).test()
                .expectSubscription()
                .consumeNextWith {
                    (name, request) ->
                    assertThat(name).isEqualTo(mockName)
                    assertThat(request.path).isEqualTo(path)
                }
                .verifyComplete()
        mockRepository.exists(mockName).test()
                .expectSubscription()
                .expectNext(true)
                .verifyComplete()
    }

    @Test
    fun `should not create because name taken`() {
        val mock = Mock("demo1", Request("someRequest/path", GET), Response(ObjectMapper().writeValueAsString(Pair("basic", "mock"))))
        mockService.create(mock).test()
                .expectSubscription()
                .verifyError(ConflictKeyException::class.java)
    }

    @Test
    fun `should not create because request taken`() {
        val mock = Mock("unknownNameForSure", Request("/users/1", GET), Response(ObjectMapper().writeValueAsString(Pair("basic", "mock"))))
        mockService.create(mock).test()
                .expectSubscription()
                .verifyError(ConflictKeyException::class.java)
    }

    @Test
    fun `should update mock without changing name`() {
        val responseBody = "updatedresponse"
        val name = "demo1"
        val mock = mockRepository.findByNameIgnoreCase(name).block().copy(response = Response(responseBody))
        mockService.update(mock, name).test()
                .expectSubscription()
                .consumeNextWith { assertThat(it.response.body).isEqualTo(responseBody) }
                .verifyComplete()
    }

    @Test
    fun `should update mock changing name`() {
        val name = "toupdate"
        val updatedName = "updatedName"
        val mock = mockRepository.findByNameIgnoreCase(name).block().copy(name = updatedName)
        mockService.update(mock, name).test()
                .expectSubscription()
                .consumeNextWith {
                    assertThat(it.name).isEqualTo(updatedName.toLowerCase())
                    assertThat(it.request.path).isEqualTo("/toupdate/1")
                }
                .verifyComplete()
        mockRepository.findByNameIgnoreCase(name).test()
                .expectSubscription()
                .expectNextCount(0)
                .verifyComplete()
        mockRepository.findByNameIgnoreCase(updatedName).test()
                .expectSubscription()
                .expectNextCount(1)
                .verifyComplete()
    }

    @Test
    fun `should not update because name missing`() {
        val mock = mockRepository.findByNameIgnoreCase("demo1").block()
        mockService.update(mock, "unknownname").test()
                .expectSubscription()
                .verifyError(IdNotFoundException::class.java)
    }

    @Test
    fun `should not update because name taken`() {
        val mock = mockRepository.findByNameIgnoreCase("demo1").block()
        mockService.update(mock, "demo2").test()
                .expectSubscription()
                .verifyError(ConflictKeyException::class.java)
    }

    @Test
    fun `should not update because request taken`() {
        val mock = mockRepository.findByNameIgnoreCase("toupdate2").block()
        val request = mockRepository.findByNameIgnoreCase("demo1").block().request
        mockService.update(mock.copy(request = request), mock.name).test()
                .expectSubscription()
                .verifyError(ConflictKeyException::class.java)
    }

    @Test
    fun `should delete`() {
        val name = "todelete"
        mockService.delete(name).test()
                .expectSubscription()
                .expectNext()
                .verifyComplete()
        mockRepository.findByNameIgnoreCase(name).test()
                .expectSubscription()
                .expectNextCount(0)
                .verifyComplete()
    }

    @Test
    fun `shoud not delete because missing mock`() {
        mockService.delete("unknown").test()
                .expectSubscription()
                .verifyError(IdNotFoundException::class.java)
    }

}