package com.yugaplus.backend.model;

public record User(
        Integer id, String fullName,
        String email, String password,
        String city) {
}
