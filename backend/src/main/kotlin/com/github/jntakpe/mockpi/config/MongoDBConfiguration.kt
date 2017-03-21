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
import org.springframework.web.bind.annotation.RequestMethod
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
                Mock("demo1", Request("/users/1", RequestMethod.GET), Response("{\"name\": \"jntakpe\"}")),
                Mock("demo2", Request("/users/2", RequestMethod.GET), Response("{\"name\": \"cbarillet\"}"))
        )
        mockRepository.deleteAll().thenMany(mockRepository.save(mocks)).blockLast()
    }

}