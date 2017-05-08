package com.github.jntakpe.mockpi.config

object Urls {
    const val API = "/api"
    const val USERS_API = "$API/mockpi/users"
    const val MOCKS_API = "$API/mocks"
    const val ACTIVITIES_API = "$API/activities"
    const val BY_ID = "/{id}"
    const val BY_NEXT_NAME_AVAILABLE = "/{name}/available"
    const val CHECK_NAME_AVAILABLE = "/name/available"
    const val CHECK_REQUEST_AVAILABLE = "/request/available"
    const val FAKE_PREFIX = "/mockpi"
}