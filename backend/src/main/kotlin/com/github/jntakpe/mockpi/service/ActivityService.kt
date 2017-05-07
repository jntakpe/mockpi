package com.github.jntakpe.mockpi.service

import com.github.jntakpe.mockpi.domain.Activity
import com.github.jntakpe.mockpi.domain.Call
import com.github.jntakpe.mockpi.domain.Mock
import com.github.jntakpe.mockpi.repository.ActivityRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import java.time.Duration
import java.time.Instant

@Service
class ActivityService(private val activityRepository: ActivityRepository) {

    val logger = LoggerFactory.getLogger(javaClass.simpleName)

    fun log(mock: Mock, elapsed: Duration): Mono<Activity> {
        logger.debug("Logging activity for mock {}", mock)
        return findOrCreate(mock)
                .map { it.copy(calls = it.calls.apply { add(Call(Instant.now(), elapsed)) }) }
                .flatMap { activityRepository.save(it) }
                .doOnNext { logger.debug("Activity for mock {} updated", mock) }
    }

    private fun findOrCreate(mock: Mock) = activityRepository.findById(mock.id).defaultIfEmpty(Activity(mock.id!!, mock, mutableListOf()))

}