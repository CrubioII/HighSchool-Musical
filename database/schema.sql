--
-- Schema creation script for the Universidad Cali gym and wellness application.
-- This script defines a dedicated schema for the application (`gym_app`), a
-- database user, and the tables needed for statistics and assignments. It
-- intentionally avoids modifying the existing university schema; instead it
-- references existing user identifiers via integer columns.

-- Create application schema
CREATE SCHEMA IF NOT EXISTS gym_app;

-- Create a dedicated database role for the application
-- Replace the password with a secure value in production
CREATE ROLE gym_user LOGIN PASSWORD 'changeme';

-- Grant usage on the new schema to the application role
GRANT USAGE ON SCHEMA gym_app TO gym_user;

-- Switch search path to the application schema
SET search_path TO gym_app;

-- Table: app_user
-- Purpose: stores credentials for application users. In a production system the
-- university's authentication service would be used instead. Fields:
--  id           Unique identifier for the user (serial primary key)
--  username     Institutional username
--  password_hash BCrypt-hashed password
--  role         Role of the user (student, colaborador, trainer, admin)
CREATE TABLE IF NOT EXISTS app_user (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('student','colaborador','trainer','admin'))
);

-- Table: assignment
-- Purpose: tracks the assignment of trainers to users. A user may have only
-- one active assignment at a time. When reassigning, the end_date of the
-- previous assignment should be set.
CREATE TABLE IF NOT EXISTS assignment (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  instructor_id INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  CONSTRAINT unique_active_assignment UNIQUE (user_id) WHERE (end_date IS NULL)
);

-- Table: user_monthly_stats
-- Purpose: stores monthly aggregated statistics for users, including
-- the number of routines started and the number of follow-ups (progress logs).
CREATE TABLE IF NOT EXISTS user_monthly_stats (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  month_year DATE NOT NULL,
  routines_started INTEGER NOT NULL DEFAULT 0,
  followups_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE (user_id, month_year)
);

-- Table: instructor_monthly_stats
-- Purpose: stores monthly aggregated statistics for instructors, including
-- the number of new assignments and follow-ups performed.
CREATE TABLE IF NOT EXISTS instructor_monthly_stats (
  id SERIAL PRIMARY KEY,
  instructor_id INTEGER NOT NULL,
  month_year DATE NOT NULL,
  new_assignments INTEGER NOT NULL DEFAULT 0,
  followups_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE (instructor_id, month_year)
);

-- Grant privileges on application tables to the application user
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA gym_app TO gym_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA gym_app TO gym_user;