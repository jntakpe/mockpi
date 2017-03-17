package com.github.jntakpe.mockpi.domain

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document
data class User(@Id val login: String, val name: String, val email: String)