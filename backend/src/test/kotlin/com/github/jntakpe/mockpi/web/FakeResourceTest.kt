package com.github.jntakpe.mockpi.web

import com.github.jntakpe.mockpi.config.Urls
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.reactive.server.WebTestClient
import reactor.core.publisher.test

@SpringBootTest
@RunWith(SpringRunner::class)
class FakeResourceTest {

    @Autowired
    lateinit var fakeResource: FakeResource

    @Autowired
    lateinit var webAdvising: WebAdvising

    lateinit var client: WebTestClient

    @Before
    fun setUp() {
        client = WebTestClient.bindToController(fakeResource).controllerAdvice(webAdvising).build()
    }

    @Test
    fun `should find mocked resource`() {
        val result = client.get().uri("${Urls.FAKE_PREFIX}/pristine")
                .exchange()
                .expectStatus().isOk
                .expectHeader().contentType(MediaType.APPLICATION_JSON)
                .returnResult(String::class.java)
        result.responseBody.test()
                .expectNext("pristinebody")
                .expectComplete()
                .verify()
    }

    @Test
    fun `should not find mocked resource`() {
        val result = client.get().uri("${Urls.FAKE_PREFIX}/unknown")
                .exchange()
                .expectStatus().isNotFound
                .returnResult(String::class.java)
        result.responseBody.test()
                .expectComplete()
                .verify()
    }

    @Test
    fun `should find custom mocked resource response`() {
        val result = client.get().uri("${Urls.FAKE_PREFIX}/pristine/custom")
                .exchange()
                .expectStatus().isCreated
                .expectHeader().contentType(MediaType.TEXT_PLAIN)
                .returnResult(String::class.java)
        result.responseBody.test()
                .expectNext("custombody")
                .expectComplete()
                .verify()
    }

}