package com.github.jntakpe.mockpi.service

import com.github.jntakpe.mockpi.domain.Mock
import com.github.jntakpe.mockpi.repository.MockRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono

@Service
class MockService(private val mockRepository: MockRepository) {

    val logger = LoggerFactory.getLogger(javaClass.simpleName)

    fun create(mock: Mock): Mono<Mock> {
        logger.info("Creating {}", mock)
        return mockRepository.save(mock)
    }

}