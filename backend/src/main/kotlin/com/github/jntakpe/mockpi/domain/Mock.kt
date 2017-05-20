package com.github.jntakpe.mockpi.domain

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer
import org.bson.types.ObjectId
import org.hibernate.validator.constraints.NotBlank
import org.springframework.data.mongodb.core.mapping.Document
import javax.validation.Valid

@Document
data class Mock(@field:NotBlank val name: String,
                @field:Valid val request: Request,
                @field:Valid val response: Response,
                val collection: String = "demo",
                val delay: Long = 0,
                val description: String = "",
                @field:JsonSerialize(using = ToStringSerializer::class) var id: ObjectId? = null) {

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