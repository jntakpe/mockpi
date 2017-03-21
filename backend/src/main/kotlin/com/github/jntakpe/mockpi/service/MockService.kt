package com.github.jntakpe.mockpi.service

import com.github.jntakpe.mockpi.domain.Mock
import com.github.jntakpe.mockpi.domain.Request
import com.github.jntakpe.mockpi.repository.MockRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono

@Service
class MockService(private val mockRepository: MockRepository) {

    val logger = LoggerFactory.getLogger(javaClass.simpleName)

    fun findMatchingMock(request: Request): Mono<Mock> {
        logger.debug("Searching response with request {}", request)
        return mockRepository.findByRequest_PathAndRequest_Method(request.path, request.method)
                .filter { p -> p.request.params == request.params }
                .filter { p -> matchHeadersRelaxed(p.request.headers, request.headers) }
                .singleOrEmpty()
    }

    fun create(mock: Mock): Mono<Mock> {
        logger.info("Creating {}", mock)
        //TODO check le même id n'existe pas
        //TODO check la même request n'existe pas
        return mockRepository.save(mock)
    }

    private fun matchHeadersRelaxed(mockHeaders: Map<String, String>, requestHeaders: Map<String, String>): Boolean {
        return mockHeaders.filter { (k, v) -> requestHeaders[k] != v }.none()
    }

}