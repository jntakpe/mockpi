package com.github.jntakpe.mockpi.config

import com.github.jntakpe.mockpi.domain.Mock
import com.github.jntakpe.mockpi.domain.Request
import com.github.jntakpe.mockpi.domain.Response
import com.github.jntakpe.mockpi.domain.User
import com.github.jntakpe.mockpi.repository.MockRepository
import com.github.jntakpe.mockpi.repository.UserRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.MediaType

@Configuration
class TestDataConfig {

    @Bean
    fun initData(userRepository: UserRepository, mockRepository: MockRepository): CommandLineRunner {
        return CommandLineRunner {
            initUsers(userRepository)
            initMocks(mockRepository)
        }
    }

    private fun initUsers(userRepository: UserRepository) {
        val users = listOf(
                User("jntakpe", "Joss", "jntakpe@mail.com", "pwd"),
                User("cbarillet", "Vyril", "cbarillet@mail.com", "pwd"),
                User("bpoindron", "Brubru", "bpoindron@mail.com", "pwd"),
                User("jmadih", "Jaja", "jaja@mail.com", "pwd"),
                User("crinfray", "Coco", "crinfray@mail.com", "pwd"),
                User("todelete", "To Delete", "todelete@mail.com", "pwd")
        )
        userRepository.deleteAll().block()
        userRepository.saveAll(users).blockLast()
    }

    private fun initMocks(mockRepository: MockRepository) {
        val mocks = listOf(
                Mock("demo", Request("/mockpi/users/origin", HttpMethod.GET), Response("{\"name\": \"jntakpe\"}")),
                Mock("demo_1", Request("/mockpi/users/1", HttpMethod.GET), Response("{\"name\": \"jntakpe\"}")),
                Mock("demo_2", Request("/mockpi/users/1", HttpMethod.GET, mapOf(Pair("age", "20")), emptyMap()), Response("{\"name\": \"jntakpe\"}")),
                Mock("demo_3", Request("/mockpi/users/1", HttpMethod.GET, mapOf(Pair("age", "20"), Pair("gender", "M")), emptyMap()),
                        Response("{\"name\": \"jntakpe\"}")),
                Mock("demo_4", Request("/mockpi/users/2", HttpMethod.GET, emptyMap(), mapOf(Pair(HttpHeaders.ACCEPT, "*"))),
                        Response("{\"name\": \"cbarillet\"}")),
                Mock("demo_5", Request("/mockpi/users/2", HttpMethod.GET, emptyMap(), mapOf(Pair(HttpHeaders.CONTENT_TYPE, "application/json"),
                        Pair(HttpHeaders.CACHE_CONTROL, "no-cache"))), Response("{\"name\": \"cbarillet\"}")),
                Mock("toupdate", Request("/mockpi/toupdate/1", HttpMethod.GET), Response("{\"name\": \"jntakpe\"}")),
                Mock("toupdate2", Request("/mockpi/toupdate/2", HttpMethod.GET), Response("{\"name\": \"jntakpe\"}")),
                Mock("toupdateapi", Request("/mockpi/toupdate/api", HttpMethod.GET), Response("{\"name\": \"jntakpe\"}")),
                Mock("toupdatepath", Request("/mockpi/toupdate/path", HttpMethod.GET), Response("{\"name\": \"jntakpe\"}")),
                Mock("todelete", Request("/mockpi/todelete/api", HttpMethod.GET), Response("{\"name\": \"jntakpe\"}")),
                Mock("todeleteapi", Request("/mockpi/todelete/api", HttpMethod.GET), Response("{\"name\": \"jntakpe\"}")),
                Mock("delayed", Request("/mockpi/delayed", HttpMethod.GET), Response("{\"name\": \"jntakpe\"}"), "", 1000L, "delayed desc", null),
                Mock("pristine", Request("/mockpi/pristine", HttpMethod.GET), Response("pristinebody")),
                Mock("pristine_2", Request("/mockpi/pristine/custom", HttpMethod.GET), Response("custombody", 201, MediaType.TEXT_PLAIN_VALUE))
        )
        mockRepository.deleteAll().block()
        mockRepository.saveAll(mocks).blockLast()
    }


}