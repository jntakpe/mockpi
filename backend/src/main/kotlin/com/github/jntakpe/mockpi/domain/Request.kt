package com.github.jntakpe.mockpi.domain

import org.hibernate.validator.constraints.NotBlank
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.http.HttpMethod
import java.util.*

@Document
data class Request(@field:NotBlank val path: String,
                   val method: HttpMethod,
                   val params: Map<String, String> = emptyMap(),
                   val headers: Map<String, String> = emptyMap()) {

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Request) return false
        return path == other.path && method == other.method
    }

    override fun hashCode(): Int {
        return Objects.hash(path, method)
    }

}