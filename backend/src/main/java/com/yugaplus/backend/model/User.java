package com.yugaplus.backend.model;

import java.util.UUID;

public class User {
        private UUID id;
        private String fullName;
        private String email;
        private String userLocation;

        public User() {
        }

        // Getters and setters
        public UUID getId() {
                return id;
        }

        public void setId(UUID id) {
                this.id = id;
        }

        public String getFullName() {
                return fullName;
        }

        public void setFullName(String fullName) {
                this.fullName = fullName;
        }

        public String getEmail() {
                return email;
        }

        public void setEmail(String email) {
                this.email = email;
        }

        public String getUserLocation() {
                return userLocation;
        }

        public void setUserLocation(String city) {
                this.userLocation = city;
        }
}