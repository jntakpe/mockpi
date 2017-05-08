package com.github.jntakpe.mockpi.web

import com.github.jntakpe.mockpi.config.Urls
import com.github.jntakpe.mockpi.domain.Activity
import com.github.jntakpe.mockpi.repository.ActivityRepository
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
class ActivityResourceTest {

    @Autowired
    lateinit var activityRessource: ActivityResource

    @Autowired
    lateinit var activityRepository: ActivityRepository

    @Autowired
    lateinit var webAdvising: WebAdvising

    lateinit var client: WebTestClient

    @Before
    fun setUp() {
        client = WebTestClient.bindToController(activityRessource).controllerAdvice(webAdvising).build()
    }

    @Test
    fun `should find all activities`() {
        val activities = activityRepository.findAll().collectList().block()
        val result = client.get().uri(Urls.ACTIVITIES_API)
                .exchange()
                .expectStatus().isOk
                .expectHeader().contentType(MediaType.APPLICATION_JSON_UTF8)
                .returnResult(Activity::class.java)
        result.responseBody.test()
                .expectNextCount(activities.size.toLong())
                .verifyComplete()
    }

}