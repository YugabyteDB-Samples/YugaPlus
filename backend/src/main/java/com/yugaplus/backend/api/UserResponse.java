package com.yugaplus.backend.api;

import com.yugaplus.backend.model.User;

public record UserResponse(Status status, User user) {
}
