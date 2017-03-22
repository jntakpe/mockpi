package com.github.jntakpe.mockpi.service

import com.github.jntakpe.mockpi.domain.Mock
import com.github.jntakpe.mockpi.domain.Request
import com.github.jntakpe.mockpi.exceptions.ConflictKeyException
import com.github.jntakpe.mockpi.repository.MockRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono

@Service
class MockService(private val mockRepository: MockRepository) {

    val logger = LoggerFactory.getLogger(javaClass.simpleName)

    fun findByName(name: String): Mono<Mock> {
        logger.debug("Searching mock with name {}", name)
        return mockRepository.findByNameIgnoreCase(name)
    }

    fun verifyNameAvailable(name: String, oldName: String = ""): Mono<String> {
        logger.debug("Checking that name {} is available", name)
        return findByName(name)
                .filter { it.name != oldName }
                .map { false }
                .defaultIfEmpty(true)
                .flatMap { if (it) Mono.just(name) else Mono.error<String>(ConflictKeyException("Name $name is not available")) }
                .single()
    }

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
        //TODO générer un name quand il n'est pas renseigné
        return mockRepository.save(mock)
    }

    private fun matchHeadersRelaxed(mockHeaders: Map<String, String>, requestHeaders: Map<String, String>): Boolean {
        return mockHeaders.filter { (k, v) -> requestHeaders[k] != v }.none()
    }

}