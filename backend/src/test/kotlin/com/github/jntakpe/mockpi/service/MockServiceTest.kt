package com.github.jntakpe.mockpi.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.github.jntakpe.mockpi.domain.Mock
import com.github.jntakpe.mockpi.domain.Request
import com.github.jntakpe.mockpi.domain.Response
import com.github.jntakpe.mockpi.repository.MockRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.junit4.SpringRunner
import reactor.test.StepVerifier

@SpringBootTest
@RunWith(SpringRunner::class)
class MockServiceTest {

    @Autowired
    lateinit var mockService: MockService

    @Autowired
    lateinit var mockRepository: MockRepository

    @Test
    fun `should create basic mock`() {
        val mockName = "basicmock"
        val path = "/basicmock"
        val mock = Mock(mockName, Request(path), Response(ObjectMapper().writeValueAsString(Pair("basic", "mock"))))
        StepVerifier.create(mockService.create(mock))
                .expectSubscription()
                .consumeNextWith {
                    (name, request) ->
                    run {
                        assertThat(name).isEqualTo(mockName)
                        assertThat(request.path).isEqualTo(path)
                    }
                }
                .verifyComplete()
        StepVerifier.create(mockRepository.exists(mockName))
                .expectSubscription()
                .expectNext(true)
                .verifyComplete()
    }
}