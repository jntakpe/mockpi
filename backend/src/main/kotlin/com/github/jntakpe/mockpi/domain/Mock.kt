package com.github.jntakpe.mockpi.domain

import org.hibernate.validator.constraints.NotBlank
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.PersistenceConstructor
import org.springframework.data.mongodb.core.mapping.Document
import javax.validation.Valid

@Document
data class Mock @PersistenceConstructor constructor(@NotBlank val name: String,
                                                    @Valid val request: Request,
                                                    @Valid val response: Response,
                                                    val collection: String,
                                                    val delay: Long,
                                                    val description: String,
                                                    @Id var id: String?) {

    constructor(name: String, request: Request, response: Response) : this(
            name,
            request,
            response,
            collection = "demo",
            delay = 0,
            description = "",
            id = null
    )

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