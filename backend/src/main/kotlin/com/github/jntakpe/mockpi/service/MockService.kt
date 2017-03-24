package com.github.jntakpe.mockpi.service

import com.github.jntakpe.mockpi.domain.Mock
import com.github.jntakpe.mockpi.domain.Request
import com.github.jntakpe.mockpi.exceptions.ConflictKeyException
import com.github.jntakpe.mockpi.exceptions.IdNotFoundException
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
                .flatMap { Mono.error<String>(ConflictKeyException("Name $name is not available")) }
                .defaultIfEmpty(name)
                .single()
    }

    fun verifyRequestAvailable(request: Request, oldRequest: Request? = null): Mono<Request> {
        logger.debug("Checking that request {} is available", request)
        return findMatchingMock(request)
                .filter { it.request != oldRequest }
                .flatMap { Mono.error<Request>(ConflictKeyException("Request $request is not available")) }
                .defaultIfEmpty(request)
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
        //TODO check la même request n'existe pas
        //TODO générer un name quand il n'est pas renseigné
        return Mono.`when`(verifyNameAvailable(mock.name), verifyRequestAvailable(mock.request))
                .map { mock.copy(name = mock.name.toLowerCase()) }
                .flatMap { mockRepository.insert(it) }
                .single()
    }

    fun update(mock: Mock, oldName: String): Mono<Mock> {
        logger.info("Updating {} to {}", oldName, mock)
        return findByNameOrThrow(oldName)
                .flatMap { (name, request) ->
                    Mono.`when`(verifyNameAvailable(mock.name, name), verifyRequestAvailable(mock.request, request))
                }
                .map { mock.copy(name = mock.name.toLowerCase()) }
                .flatMap { mockRepository.save(it) }
                .single()
    }

    private fun matchHeadersRelaxed(mockHeaders: Map<String, String>, requestHeaders: Map<String, String>): Boolean {
        return mockHeaders.filter { (k, v) -> requestHeaders[k] != v }.none()
    }

    private fun findByNameOrThrow(name: String): Mono<Mock> = findByName(name)
            .otherwiseIfEmpty(Mono.error(IdNotFoundException("Mock $name doest not exist")))
}