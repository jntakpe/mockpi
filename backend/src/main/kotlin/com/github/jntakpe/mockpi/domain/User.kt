package com.github.jntakpe.mockpi.domain

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.JsonProperty.Access.WRITE_ONLY
import org.hibernate.validator.constraints.Email
import org.hibernate.validator.constraints.NotBlank
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import javax.validation.constraints.Size

@Document
data class User(@field:Id @field:NotBlank @field:Size(min = 3) val username: String,
                @field:NotBlank val name: String,
                @field:NotBlank @Email val email: String,
                @field:JsonProperty(access = WRITE_ONLY) val password: String?) {

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is User) return false
        return username == other.username
    }

    override fun hashCode(): Int {
        return username.hashCode()
    }
}