package com.github.jntakpe.mockpi.service

import com.github.jntakpe.mockpi.domain.Mock
import com.github.jntakpe.mockpi.domain.Request
import com.github.jntakpe.mockpi.domain.Response
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono

@Service
class FakeService(private val mockService: MockService) {

    val logger = LoggerFactory.getLogger(javaClass.simpleName)

    fun findFakeResponse(req: Request): Mono<Response> {
        logger.debug("Searching mock response for request {}", req)
        return mockService.findMatchingMock(req)
                .map(Mock::response)
    }
}