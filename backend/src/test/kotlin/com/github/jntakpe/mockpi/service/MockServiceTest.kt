package com.github.jntakpe.mockpi.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.github.jntakpe.mockpi.domain.Mock
import com.github.jntakpe.mockpi.domain.Request
import com.github.jntakpe.mockpi.domain.Response
import com.github.jntakpe.mockpi.exceptions.ConflictKeyException
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
import reactor.test.StepVerifier

@SpringBootTest
@RunWith(SpringRunner::class)
class MockServiceTest {

    @Autowired
    lateinit var mockService: MockService

    @Autowired
    lateinit var mockRepository: MockRepository

    @Test
    fun `should find mock by name because exact match`() {
        val name = "demo1"
        StepVerifier.create(mockService.findByName(name))
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
        StepVerifier.create(mockService.findByName(name))
                .expectSubscription()
                .consumeNextWith { mock ->
                    assertThat(mock).isNotNull()
                    assertThat(mock.name).isEqualTo(name.toLowerCase())
                }
                .verifyComplete()
    }

    @Test
    fun `should not find mock because unknown name`() {
        StepVerifier.create(mockService.findByName("unknown"))
                .expectSubscription()
                .expectNextCount(0)
                .verifyComplete()
    }

    @Test
    fun `shoud accept name because none existing`() {
        val newName = "newname"
        StepVerifier.create(mockService.verifyNameAvailable(newName))
                .expectSubscription()
                .expectNext(newName)
                .verifyComplete()
    }

    @Test
    fun `shoud refuse name because same name exist`() {
        val newName = "dEMO1"
        StepVerifier.create(mockService.verifyNameAvailable(newName))
                .expectSubscription()
                .verifyError(ConflictKeyException::class.java)
    }

    @Test
    fun `should accept name because old name is the the same`() {
        val name = "DEmo1"
        StepVerifier.create(mockService.verifyNameAvailable(name, "demo1"))
                .expectSubscription()
                .expectNext(name)
                .verifyComplete()
    }

    @Test
    fun `should refuse name because old name is not the same`() {
        StepVerifier.create(mockService.verifyNameAvailable("Demo1", "oldName"))
                .expectSubscription()
                .verifyError(ConflictKeyException::class.java)
    }

    @Test
    fun `should accept request because none existing`() {
        StepVerifier.create(mockService.verifyRequestAvailable(Request("somenewrequest", GET)))
                .expectSubscription()
                .expectNextCount(1)
                .verifyComplete()
    }

    @Test
    fun `shoud refuse request because same request exist`() {
        StepVerifier.create(mockService.verifyRequestAvailable(Request("/users/1", GET)))
                .expectSubscription()
                .verifyError(ConflictKeyException::class.java)
    }

    @Test
    fun `should accept request because old request is the the same`() {
        StepVerifier.create(mockService.verifyRequestAvailable(Request("/users/1", GET), Request("/users/1", GET)))
                .expectSubscription()
                .expectNextCount(1)
                .verifyComplete()
    }

    @Test
    fun `should refuse request because old request is not the same`() {
        StepVerifier.create(mockService.verifyRequestAvailable(Request("/users/1", GET), Request("/users/1", POST)))
                .expectSubscription()
                .verifyError(ConflictKeyException::class.java)
    }

    @Test
    fun `should find one response with request path and method`() {
        StepVerifier.create(mockService.findMatchingMock(Request("/users/1", GET)))
                .expectSubscription()
                .consumeNextWith { response ->
                    assertThat(response).isNotNull()
                    assertThat(response.name).isEqualTo("demo1")
                }
                .verifyComplete()
    }

    @Test
    fun `should find none cuz path missmatch`() {
        StepVerifier.create(mockService.findMatchingMock(Request("/user/1", GET)))
                .expectSubscription()
                .expectNextCount(0)
                .verifyComplete()
    }

    @Test
    fun `should find none cuz method missmatch`() {
        StepVerifier.create(mockService.findMatchingMock(Request("/users/1", POST)))
                .expectSubscription()
                .expectNextCount(0)
                .verifyComplete()
    }

    @Test
    fun `should find one response with request path, method and one param`() {
        StepVerifier.create(mockService.findMatchingMock(Request("/users/1", GET, mapOf(Pair("age", "20")), emptyMap())))
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
        StepVerifier.create(mockService.findMatchingMock(request))
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
        StepVerifier.create(mockService.findMatchingMock(request))
                .expectSubscription()
                .expectNextCount(0)
                .verifyComplete()

    }

    @Test
    fun `should find one response with request path, method and no headers matching`() {
        val request = Request("/users/1", GET, emptyMap(), mapOf(Pair(ACCEPT, "*")))
        StepVerifier.create(mockService.findMatchingMock(request))
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
        StepVerifier.create(mockService.findMatchingMock(request))
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
        StepVerifier.create(mockService.findMatchingMock(request))
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
        StepVerifier.create(mockService.findMatchingMock(request))
                .expectSubscription()
                .expectNextCount(0)
                .verifyComplete()
    }

    @Test
    fun `should not find because accept header wrong value`() {
        val request = Request("/users/2", GET, emptyMap(), mapOf(Pair(ACCEPT, "ALL")))
        StepVerifier.create(mockService.findMatchingMock(request))
                .expectSubscription()
                .expectNextCount(0)
                .verifyComplete()
    }

    @Test
    fun `should create basic mock`() {
        val mockName = "basicmock"
        val path = "/basicmock"
        val mock = Mock(mockName, Request(path, GET), Response(ObjectMapper().writeValueAsString(Pair("basic", "mock"))))
        StepVerifier.create(mockService.create(mock))
                .expectSubscription()
                .consumeNextWith {
                    (name, request) ->
                    assertThat(name).isEqualTo(mockName)
                    assertThat(request.path).isEqualTo(path)
                }
                .verifyComplete()
        StepVerifier.create(mockRepository.exists(mockName))
                .expectSubscription()
                .expectNext(true)
                .verifyComplete()
    }

    @Test
    fun `should not create because name taken`() {
        val mock = Mock("demo1", Request("someRequest/path", GET), Response(ObjectMapper().writeValueAsString(Pair("basic", "mock"))))
        StepVerifier.create(mockService.create(mock))
                .expectSubscription()
                .verifyError(ConflictKeyException::class.java)
    }


    @Test
    fun `should not create because request taken`() {
        val mock = Mock("unknownNameForSure", Request("/users/1", GET), Response(ObjectMapper().writeValueAsString(Pair("basic", "mock"))))
        StepVerifier.create(mockService.create(mock))
                .expectSubscription()
                .verifyError(ConflictKeyException::class.java)
    }

}