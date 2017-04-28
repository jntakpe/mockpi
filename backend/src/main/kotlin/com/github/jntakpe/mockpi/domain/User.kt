package com.github.jntakpe.mockpi.domain

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.JsonProperty.Access.WRITE_ONLY
import org.hibernate.validator.constraints.Email
import org.hibernate.validator.constraints.NotBlank
import org.springframework.boot.autoconfigure.security.SecurityProperties
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.PersistenceConstructor
import org.springframework.data.mongodb.core.mapping.Document
import javax.validation.constraints.Size

@Document
data class User @PersistenceConstructor constructor(@NotBlank @Size(min = 3) val username: String,
                                                    @NotBlank val name: String,
                                                    @NotBlank @Email val email: String,
                                                    @JsonProperty(access = WRITE_ONLY) val password: String?,
                                                    @Id var id: String?) {

    constructor(username: String, name: String, email: String, password: String) : this(
            username,
            name,
            email,
            password,
            id = null
    )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is User) return false
        return username == other.username
    }

    override fun hashCode(): Int {
        return username.hashCode()
    }
}