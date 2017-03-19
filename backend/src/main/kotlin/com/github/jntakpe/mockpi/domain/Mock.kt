package com.github.jntakpe.mockpi.domain

import org.hibernate.validator.constraints.NotBlank
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document
data class Mock(@Id @NotBlank val name: String,
                val request: Request,
                val response: Response,
                val collection: String = "demo",
                val delay: Int = 0,
                val description: String = "") {

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Mock) return false
        return name == other.name
    }

    override fun hashCode(): Int {
        return name.hashCode()
    }

    override fun toString(): String {
        return "Mock(name='$name', request.path=${request.path})"
    }
}