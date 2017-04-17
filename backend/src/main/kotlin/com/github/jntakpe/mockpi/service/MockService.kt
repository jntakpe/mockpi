package com.github.jntakpe.mockpi.service

import com.github.jntakpe.mockpi.config.Urls
import com.github.jntakpe.mockpi.domain.Mock
import com.github.jntakpe.mockpi.domain.Request
import com.github.jntakpe.mockpi.exceptions.ConflictKeyException
import com.github.jntakpe.mockpi.exceptions.IdNotFoundException
import com.github.jntakpe.mockpi.repository.MockRepository
import org.apache.commons.lang3.StringUtils
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.core.publisher.toMono

@Service
class MockService(private val mockRepository: MockRepository) {

    val logger = LoggerFactory.getLogger(javaClass.simpleName)

    fun findAll(): Flux<Mock> {
        logger.debug("Searching all mocks")
        return mockRepository.findAll()
    }

    fun findByName(name: String): Mono<Mock> {
        logger.debug("Searching mock with name {}", name)
        return mockRepository.findByNameIgnoreCase(name)
    }

    fun verifyNameAvailable(name: String, oldName: String? = null): Mono<String> {
        logger.debug("Checking that name {} is available", name)
        return findByName(name)
                .filter { it.name != oldName }
                .flatMap { ConflictKeyException("Name $name is not available").toMono<String>() }
                .defaultIfEmpty(name)
                .map(String::toLowerCase)
    }

    fun verifyRequestAvailable(request: Request, oldRequest: Request? = null): Mono<Request> {
        logger.debug("Checking that request {} is available", request)
        val prefixedRequest = addPrefixIfRequired(request)
        return findMatchingMock(prefixedRequest)
                .filter { it.request != oldRequest }
                .flatMap { ConflictKeyException("Request $prefixedRequest is not available").toMono<Request>() }
                .defaultIfEmpty(prefixedRequest)
    }

    fun findMatchingMock(request: Request): Mono<Mock> {
        logger.debug("Searching response with request {}", request)
        return request.toMono()
                .map(this::addPrefixIfRequired)
                .flatMapMany { mockRepository.findByRequest_PathAndRequest_Method(it.path, it.method) }
                .filter { it.request.params == request.params }
                .filter { matchHeadersRelaxed(it.request.headers, request.headers) }
                .singleOrEmpty()
    }

    fun create(mock: Mock): Mono<Mock> {
        logger.info("Creating {}", mock)
        return verifyNameAndRequestAvailable(mock, null)
                .flatMap { mockRepository.insert(it) }
    }

    fun update(mock: Mock, oldName: String): Mono<Mock> {
        logger.info("Updating {} to {}", oldName, mock)
        return findByNameOrThrow(oldName)
                .flatMap { verifyNameAndRequestAvailable(mock, it) }
                .flatMap(mockRepository::save)
    }

    fun delete(name: String): Mono<Void> {
        logger.info("Deleting mock {}", name)
        return findByNameOrThrow(name).flatMap { mockRepository.delete(it.name) }
    }

    private fun verifyNameAndRequestAvailable(current: Mock, existing: Mock?): Mono<Mock> {
        return Mono.`when`(verifyNameAvailable(current.name, existing?.name), verifyRequestAvailable(current.request, existing?.request))
                .map { current.copy(name = it.t1, request = it.t2) }
    }

    private fun matchHeadersRelaxed(mockHeaders: Map<String, String>, requestHeaders: Map<String, String>): Boolean {
        return mockHeaders.filter { (k, v) -> requestHeaders[k] != v }.none()
    }

    private fun findByNameOrThrow(name: String): Mono<Mock> = findByName(name)
            .switchIfEmpty(IdNotFoundException("Mock $name doest not exist").toMono<Mock>())

    private fun addPrefixIfRequired(request: Request): Request {
        val apiPath = StringUtils.prependIfMissing(Urls.FAKE_PREFIX, "/")
        var path = StringUtils.prependIfMissing(request.path, "/")
        path = StringUtils.prependIfMissing(path, apiPath)
        return request.copy(path = path)
    }

}