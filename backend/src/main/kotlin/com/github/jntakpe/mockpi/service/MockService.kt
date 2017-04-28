package com.github.jntakpe.mockpi.service

import com.github.jntakpe.mockpi.config.StringsMap
import com.github.jntakpe.mockpi.config.Urls
import com.github.jntakpe.mockpi.domain.Mock
import com.github.jntakpe.mockpi.domain.Request
import com.github.jntakpe.mockpi.exceptions.ConflictKeyException
import com.github.jntakpe.mockpi.exceptions.IdNotFoundException
import com.github.jntakpe.mockpi.repository.MockRepository
import org.apache.commons.lang3.StringUtils
import org.bson.types.ObjectId
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.core.publisher.toMono

@Service
class MockService(private val mockRepository: MockRepository) {

    val dupSuffix = "_"

    val logger = LoggerFactory.getLogger(javaClass.simpleName)

    fun findAll(): Flux<Mock> {
        logger.debug("Searching all mocks")
        return mockRepository.findAll()
                .doOnComplete { logger.debug("All mocks retrieved") }
    }

    fun findById(id: ObjectId): Mono<Mock> {
        logger.debug("Searching mock with id {}", id)
        return mockRepository.findOne(id)
                .doOnNext { logger.debug("Mock {} matched with id {}", it, id) }
    }

    fun findByName(name: String): Mono<Mock> {
        logger.debug("Searching mock with name {}", name)
        return mockRepository.findByNameIgnoreCase(name)
                .doOnNext { logger.debug("Mock {} matched with name {}", it, name) }
    }

    fun findAvailableDuplicateName(name: String): Mono<String> {
        val plainName = nameWithoutSuffix(name).toLowerCase()
        logger.debug("Searching available mock duplicate with name {}", plainName)
        return mockRepository.findByNameStartsWith(plainName)
                .switchIfEmpty(IdNotFoundException("Name $plainName is not found").toMono())
                .map(Mock::name)
                .map { it.substringAfterLast(dupSuffix) }
                .filter { it.toIntOrNull() != null }
                .map(String::toInt)
                .collectSortedList()
                .map { findGap(it) }
                .defaultIfEmpty(1)
                .map { "${plainName}_$it" }
                .doOnNext { logger.debug("Name {} is available", it) }
    }

    fun verifyNameAvailable(name: String, oldName: String? = null): Mono<String> {
        logger.debug("Checking that name {} is available", name)
        return findByName(name)
                .filter { it.name != oldName }
                .flatMap { ConflictKeyException("Name $name is not available").toMono<String>() }
                .defaultIfEmpty(name)
                .map(String::toLowerCase)
                .doOnNext { logger.debug("Name {} is available", name) }
    }

    fun verifyRequestAvailable(request: Request, oldRequest: Request? = null): Mono<Request> {
        logger.debug("Checking that request {} is available", request)
        val prefixedRequest = addPrefixIfRequired(request)
        return findMatchingMock(prefixedRequest)
                .filter { it.request != oldRequest }
                .flatMap { ConflictKeyException("Request $prefixedRequest is not available").toMono<Request>() }
                .defaultIfEmpty(prefixedRequest)
                .doOnNext { logger.debug("Request {} is available", request) }
    }

    fun findMatchingMock(request: Request): Mono<Mock> {
        logger.debug("Searching response with request {}", request)
        return request.toMono()
                .map(this::addPrefixIfRequired)
                .flatMapMany { mockRepository.findByRequest_PathAndRequest_Method(it.path, it.method) }
                .filter { it.request.params == request.params }
                .filter { matchHeadersRelaxed(it.request.headers, request.headers) }
                .doOnNext { logger.debug("Found matching mock {} for request {}", it, request) }
                .singleOrEmpty()
                .switchIfEmpty(Mono.empty<Mock>().doOnSuccess { logger.debug("Unable to find any mock matching request {}", request) })
    }

    fun create(mock: Mock): Mono<Mock> {
        logger.debug("Creating {}", mock)
        return verifyNameAndRequestAvailable(mock, null)
                .flatMap { mockRepository.insert(it) }
                .doOnNext { logger.info("Mock {} successfully created", it) }
    }

    fun update(mock: Mock, id: ObjectId): Mono<Mock> {
        logger.debug("Updating id {} with {}", id, mock)
        return findByIdOrThrow(id)
                .flatMap { verifyNameAndRequestAvailable(mock, it) }
                .flatMap(mockRepository::save)
                .doOnNext { logger.info("Mock {} successfully updated", it) }
    }

    fun delete(id: ObjectId): Mono<Void> {
        logger.debug("Deleting mock {}", id)
        return findByIdOrThrow(id)
                .flatMap { mockRepository.delete(it.id) }
                .doOnNext { logger.info("Mock with id {} successfully deleted") }
    }

    private fun verifyNameAndRequestAvailable(current: Mock, existing: Mock?) = Mono.`when`(
            verifyNameAvailable(current.name, existing?.name),
            verifyRequestAvailable(current.request, existing?.request))
            .map { current.copy(name = it.t1, request = it.t2) }

    private fun matchHeadersRelaxed(headers: StringsMap, reqHeaders: StringsMap) = headers
            .filter { (k, v) -> reqHeaders[k] != v }.none()

    private fun findByIdOrThrow(id: ObjectId) = findById(id)
            .switchIfEmpty(IdNotFoundException("Mock $id not found").toMono<Mock>())

    private fun addPrefixIfRequired(request: Request): Request {
        val apiPath = StringUtils.prependIfMissing(Urls.FAKE_PREFIX, "/")
        var path = StringUtils.prependIfMissing(request.path, "/")
        path = StringUtils.prependIfMissing(path, apiPath)
        return request.copy(path = path)
    }

    private fun findGap(list: MutableList<Int>) = generateSequence(1) { it + 1 }.take(Int.MAX_VALUE).filter { !list.contains(it) }.first()

    private fun nameWithoutSuffix(name: String) = if (name.contains(dupSuffix)) name.substringBeforeLast(dupSuffix) else name
}