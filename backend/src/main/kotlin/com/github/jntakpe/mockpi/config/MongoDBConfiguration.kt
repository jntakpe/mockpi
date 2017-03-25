package com.github.jntakpe.mockpi.config

import com.github.jntakpe.mockpi.domain.Mock
import com.github.jntakpe.mockpi.domain.Request
import com.github.jntakpe.mockpi.domain.Response
import com.github.jntakpe.mockpi.domain.User
import com.github.jntakpe.mockpi.repository.MockRepository
import com.github.jntakpe.mockpi.repository.UserRepository
import com.mongodb.reactivestreams.client.MongoClients
import org.springframework.boot.CommandLineRunner
import org.springframework.boot.autoconfigure.mongo.MongoProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.mongodb.config.AbstractReactiveMongoConfiguration
import org.springframework.http.HttpHeaders.*
import org.springframework.web.bind.annotation.RequestMethod.GET
import reactor.core.publisher.Flux

@Configuration
class MongoDBConfiguration(val mongoProperties: MongoProperties) : AbstractReactiveMongoConfiguration() {

    override fun mongoClient() = MongoClients.create()

    override fun getDatabaseName() = mongoProperties.database

    @Bean
    fun initData(userRepository: UserRepository, mockRepository: MockRepository): CommandLineRunner {
        return CommandLineRunner {
            initUsers(userRepository)
            initMocks(mockRepository)
        }
    }

    private fun initUsers(userRepository: UserRepository) {
        val users = Flux.just(
                User("jntakpe", "Joss", "jntakpe@mail.com"),
                User("cbarillet", "Vyril", "cbarillet@mail.com"),
                User("bpoindron", "Brubru", "bpoindron@mail.com"),
                User("crinfray", "Coco", "crinfray@mail.com"),
                User("todelete", "To Delete", "todelete@mail.com")
        )
        userRepository.deleteAll().thenMany(userRepository.save(users)).blockLast()
    }

    private fun initMocks(mockRepository: MockRepository) {
        val mocks = Flux.just(
                Mock("demo1", Request("/users/1", GET), Response("{\"name\": \"jntakpe\"}")),
                Mock("demo2", Request("/users/1", GET, mapOf(Pair("age", "20")), emptyMap()), Response("{\"name\": \"jntakpe\"}")),
                Mock("demo3", Request("/users/1", GET, mapOf(Pair("age", "20"), Pair("gender", "M")), emptyMap()),
                        Response("{\"name\": \"jntakpe\"}")),
                Mock("demo4", Request("/users/2", GET, emptyMap(), mapOf(Pair(ACCEPT, "*"))), Response("{\"name\": \"cbarillet\"}")),
                Mock("demo5", Request("/users/2", GET, emptyMap(),
                        mapOf(Pair(CONTENT_TYPE, "application/json"), Pair(CACHE_CONTROL, "no-cache"))),
                        Response("{\"name\": \"cbarillet\"}")),
                Mock("toupdate", Request("/toupdate/1", GET), Response("{\"name\": \"jntakpe\"}")),
                Mock("toupdate2", Request("/toupdate/2", GET), Response("{\"name\": \"jntakpe\"}")),
                Mock("toupdateapi", Request("/toupdate/api", GET), Response("{\"name\": \"jntakpe\"}")),
                Mock("todelete", Request("/todelete/api", GET), Response("{\"name\": \"jntakpe\"}")),
                Mock("todeleteapi", Request("/todelete/api", GET), Response("{\"name\": \"jntakpe\"}"))
        )
        mockRepository.deleteAll().thenMany(mockRepository.save(mocks)).blockLast()
    }

}