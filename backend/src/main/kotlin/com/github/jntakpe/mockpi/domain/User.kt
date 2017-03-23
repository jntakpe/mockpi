package com.github.jntakpe.mockpi.domain

import org.hibernate.validator.constraints.NotBlank
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document
data class User(@Id @NotBlank val login: String, @NotBlank val name: String, @NotBlank val email: String) {

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is User) return false
        return login == other.login
    }

    override fun hashCode(): Int {
        return login.hashCode()
    }
}