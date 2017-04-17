package com.github.jntakpe.mockpi.mapper

import com.github.jntakpe.mockpi.domain.Response
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.mock.http.server.reactive.MockServerHttpRequest

class MockMappingsTest {

    @Test
    fun `should map server request to mock request`() {
        val path = "/mockpi/users/1?name=Joss"
        val req = MockServerHttpRequest.post(path).accept(MediaType.APPLICATION_JSON).body("some body").toRequest()
        assertThat(req.path).isEqualTo("/mockpi/users/1")
        assertThat(req.method).isEqualTo(HttpMethod.POST)
        assertThat(req.headers).containsKeys(HttpHeaders.ACCEPT)
        assertThat(req.headers).containsValue(MediaType.APPLICATION_JSON.toString())
        assertThat(req.params).containsKeys("name")
        assertThat(req.params).containsValue("Joss")
    }

    @Test
    fun `should map response to response entity`() {
        val body = "response body"
        val responseEntity = Response(body).toResponseEntity()
        assertThat(responseEntity.body).isEqualTo(body)
        assertThat(responseEntity.statusCode).isEqualTo(HttpStatus.OK)
        assertThat(responseEntity.headers).containsOnlyKeys(HttpHeaders.CONTENT_TYPE)
        assertThat(responseEntity.headers[HttpHeaders.CONTENT_TYPE]).containsExactly(MediaType.APPLICATION_JSON_VALUE)
    }
}