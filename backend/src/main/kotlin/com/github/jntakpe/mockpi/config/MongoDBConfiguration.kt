package com.github.jntakpe.mockpi.config

import com.github.jntakpe.mockpi.domain.User
import com.github.jntakpe.mockpi.repository.UserRepository
import com.mongodb.reactivestreams.client.MongoClients
import org.springframework.boot.CommandLineRunner
import org.springframework.boot.autoconfigure.mongo.MongoProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.mongodb.config.AbstractReactiveMongoConfiguration
import reactor.core.publisher.Flux

@Configuration
class MongoDBConfiguration(val mongoProperties: MongoProperties) : AbstractReactiveMongoConfiguration() {

    override fun mongoClient() = MongoClients.create()

    override fun getDatabaseName() = mongoProperties.database

    @Bean
    fun initData(userRepository: UserRepository): CommandLineRunner {
        return CommandLineRunner {
            val persons = Flux.just(
                    User("jntakpe", "Joss", "jntakpe@mail.com"),
                    User("cbarillet", "Vyril", "cbarillet@mail.com"),
                    User("bpoindron", "Brubru", "bpoindron@mail.com"),
                    User("crinfray", "Coco", "crinfray@mail.com"),
                    User("todelete", "To Delete", "todelete@mail.com")
            )
            userRepository.deleteAll().thenMany(userRepository.save(persons)).blockLast()
        }
    }

}