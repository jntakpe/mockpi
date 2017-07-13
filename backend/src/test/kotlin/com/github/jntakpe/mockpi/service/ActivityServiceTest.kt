package com.github.jntakpe.mockpi.service

import com.github.jntakpe.mockpi.repository.ActivityRepository
import com.github.jntakpe.mockpi.repository.MockRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.junit4.SpringRunner
import reactor.core.publisher.test
import java.time.Duration

@SpringBootTest
@RunWith(SpringRunner::class)
class ActivityServiceTest {

    @Autowired
    lateinit var activityService: ActivityService

    @Autowired
    lateinit var activityRepository: ActivityRepository

    @Autowired
    lateinit var mockRepository: MockRepository

    @Test
    fun log_shouldInitializeNewActivity() {
        val count = activityRepository.count().block() ?: throw IllegalStateException("Unable to count items")
        val name = "pristine"
        val mock = mockRepository.findByNameIgnoreCase(name).block() ?: throw IllegalStateException("No mock $name")
        activityService.log(mock, Duration.ofSeconds(1)).test()
                .expectSubscription()
                .consumeNextWith {
                    assertThat(it.id).isNotNull()
                    assertThat(it.mock).isNotNull()
                    assertThat(it.calls).isNotEmpty.hasSize(1)
                }
                .then { assertThat(activityRepository.count().block()!!).isEqualTo(count + 1) }
                .verifyComplete()
    }

    @Test
    fun log_shouldAddCallToExisting() {
        val count = activityRepository.count().block()
        val name = "activity"
        val mock = mockRepository.findByNameIgnoreCase(name).block() ?: throw IllegalStateException("No mock $name")
        activityService.log(mock, Duration.ofSeconds(1)).test()
                .expectSubscription()
                .consumeNextWith {
                    assertThat(it.id).isNotNull()
                    assertThat(it.mock).isNotNull()
                    assertThat(it.calls).isNotEmpty.hasSize(4)
                }
                .then { assertThat(activityRepository.count().block()).isEqualTo(count) }
                .verifyComplete()
    }

    @Test
    fun findAll_shouldFindSome() {
        val size = activityRepository.findAll().collectList().block()?.size ?: throw IllegalStateException("Unable to retrieve size")
        activityService.findAll().test()
                .expectSubscription()
                .expectNextCount(size.toLong())
                .verifyComplete()
    }

}