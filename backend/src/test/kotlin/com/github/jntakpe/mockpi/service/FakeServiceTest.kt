package com.github.jntakpe.mockpi.service

import com.github.jntakpe.mockpi.domain.Request
import com.github.jntakpe.mockpi.repository.ActivityRepository
import com.github.jntakpe.mockpi.repository.MockRepository
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.data.Offset
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.util.StopWatch
import reactor.core.publisher.test
import java.time.Duration

@SpringBootTest
@RunWith(SpringRunner::class)
class FakeServiceTest {

    @Autowired
    lateinit var fakeService: FakeService

    @Autowired
    lateinit var activityRepository: ActivityRepository

    @Autowired
    lateinit var mockRepository: MockRepository

    @Test
    fun `should not find mock and return not found`() {
        fakeService.findFakeResponse(Request("/unknown/path", HttpMethod.POST)).test()
                .expectSubscription()
                .consumeNextWith { assertThat(it.statusCode).isEqualTo(HttpStatus.NOT_FOUND) }
                .verifyComplete()
    }

    @Test
    fun `should find mock`() {
        fakeService.findFakeResponse(Request("/users/1", HttpMethod.GET)).test()
                .expectSubscription()
                .consumeNextWith { assertThat(it.statusCode).isEqualTo(HttpStatus.OK) }
                .verifyComplete()
    }

    @Test
    fun `should apply delay`() {
        val stopWatch = StopWatch()
        //TODO Use virtual time when bugs fixed
        fakeService.findFakeResponse(Request("/delayed", HttpMethod.GET)).test()
                .consumeSubscriptionWith { stopWatch.start() }
                .consumeNextWith {
                    stopWatch.stop()
                    assertThat(stopWatch.totalTimeMillis).isCloseTo(1000, Offset.offset(50L))
                }
                .expectComplete()
                .verify()
    }

    @Test
    fun `should not be delayed`() {
        val stopWatch = StopWatch()
        fakeService.findFakeResponse(Request("/users/1", HttpMethod.GET)).test()
                .consumeSubscriptionWith { stopWatch.start() }
                .consumeNextWith {
                    stopWatch.stop()
                    assertThat(stopWatch.totalTimeMillis).isCloseTo(0, Offset.offset(50L))
                }
                .expectComplete()
                .verify()
    }

    @Test
    fun `should find mock and log activity`() {
        val mock = mockRepository.findAll().blockFirst()
        val count = activityRepository.findById(mock.id).map { it.calls.size }.defaultIfEmpty(0).block()
        fakeService.findFakeResponse(mock.request).test()
                .expectSubscription()
                .consumeNextWith { assertThat(it.statusCode).isEqualTo(HttpStatus.OK) }
                .thenAwait(Duration.ofSeconds(1))
                .then {
                    activityRepository.findById(mock.id).map { it.calls.size }.test()
                            .expectSubscription()
                            .expectNext(count + 1)
                            .verifyComplete()
                }
                .verifyComplete()
    }

}