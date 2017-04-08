package com.github.jntakpe.mockpi.domain

import com.fasterxml.jackson.annotation.JsonProperty
import org.hibernate.validator.constraints.Email
import org.hibernate.validator.constraints.NotBlank
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import javax.validation.constraints.Size

@Document
data class User(
        @Id @NotBlank @Size(min = 3) val username: String,
        @NotBlank val name: String,
        @NotBlank @Email val email: String,
        @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) val password: String?) {

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is User) return false
        return username == other.username
    }

    override fun hashCode(): Int {
        return username.hashCode()
    }
}