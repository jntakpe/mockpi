package com.github.jntakpe.mockpi.domain

import org.hibernate.validator.constraints.NotBlank
import org.springframework.data.annotation.PersistenceConstructor
import org.springframework.web.bind.annotation.RequestMethod
import java.util.*

data class Request @PersistenceConstructor constructor(@NotBlank val path: String,
                                                       @NotBlank val method: RequestMethod,
                                                       val params: Map<String, String>,
                                                       val headers: Map<String, String>) {

    constructor(path: String, method: RequestMethod) : this(path, method, params = emptyMap(), headers = emptyMap())

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Request) return false
        return path == other.path && method == other.method
    }

    override fun hashCode(): Int {
        return Objects.hash(path, method)
    }

}