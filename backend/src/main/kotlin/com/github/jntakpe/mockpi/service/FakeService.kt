package com.github.jntakpe.mockpi.service

import com.github.jntakpe.mockpi.domain.Request
import com.github.jntakpe.mockpi.mapper.toResponseEntity
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import reactor.core.publisher.toMono
import java.time.Duration

@Service
class FakeService(private val mockService: MockService) {

    val logger = LoggerFactory.getLogger(javaClass.simpleName)

    fun findFakeResponse(req: Request): Mono<ResponseEntity<String>> {
        logger.debug("Searching mock response for request {}", req);
        return mockService.findMatchingMock(req)
                .elapsed()
                .flatMap { t -> Mono.delay(resolveDelay(t.t1, t.t2.delay)).map { t.t2 } }
                .map { it.response.toResponseEntity() }
                .doOnNext { logger.debug("Returning fake response {} to request {}", it, req) }
                .switchIfEmpty(ResponseEntity.notFound().build<String>().toMono()
                        .doOnNext { logger.debug("No fake response found for request {}", req) })
    }

    private fun resolveDelay(elapsed: Long, delay: Long) = Duration.ofMillis(if (elapsed >= delay) 0 else delay - elapsed)
}