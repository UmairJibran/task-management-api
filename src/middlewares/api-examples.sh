#!/bin/bash

# Task Management API Curl Examples

####################################################################
# Authentication Endpoints
####################################################################

echo "=== Authentication Endpoints ==="

# Signup a new user
echo "\n--- Signup a new user ---"
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "me+supabase@umairjibran.com",
    "password": "12345678"
  }'

# Login a user
echo "\n--- Login a user ---"
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "me+supabase@umairjibran.com",
    "password": "12345678"
  }'

# Store the received token in a variable for use in subsequent requests
# TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email": "me+supabase@umairjibran.com", "password": "12345678"}' | grep -o '"access_token":"[^"]*' | sed 's/"access_token":"//')
# For manual testing, replace the TOKEN variable below with your actual token

TOKEN=""

####################################################################
# Categories Endpoints
####################################################################

echo "\n=== Categories Endpoints ==="

# Create a new category
echo "\n--- Create a new category ---"
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Work"
  }'

# Create another category
echo "\n--- Create another category ---"
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Personal"
  }'

# Get all categories
echo "\n--- Get all categories ---"
curl -X GET http://localhost:3000/api/categories \
  -H "Authorization: Bearer $TOKEN"

# Get a specific category by ID (replace category_id with an actual ID)
echo "\n--- Get a specific category ---"
curl -X GET http://localhost:3000/api/categories/bc6824e1-1538-4599-8d7e-72ef7670cf6b \
  -H "Authorization: Bearer $TOKEN"

# Update a category
echo "\n--- Update a category ---"
curl -X PUT http://localhost:3000/api/categories/bc6824e1-1538-4599-8d7e-72ef7670cf6b \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Updated Work"
  }'

# Delete a category
echo "\n--- Delete a category ---"
curl -X DELETE http://localhost:3000/api/categories/bc6824e1-1538-4599-8d7e-72ef7670cf6b \
  -H "Authorization: Bearer $TOKEN"

####################################################################
# Tasks Endpoints
####################################################################

echo "\n=== Tasks Endpoints ==="

# Create a new task
echo "\n--- Create a new task ---"
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Complete project documentation",
    "description": "Finalize all documentation for the project",
    "categoryId": "fd298609-7d4d-440c-bb0b-9357220ef1ed",
    "status": "pending",
    "dueDate": "2025-04-30"
  }'

# Get all tasks
echo "\n--- Get all tasks ---"
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer $TOKEN"

# Get tasks with filters
echo "\n--- Get tasks with filters ---"
curl -X GET "http://localhost:3000/api/tasks?status=pending&category=fd298609-7d4d-440c-bb0b-9357220ef1ed" \
  -H "Authorization: Bearer $TOKEN"

# Get a specific task by ID (replace task_id with an actual ID)
echo "\n--- Get a specific task ---"
curl -X GET http://localhost:3000/api/tasks/5f223360-d388-4c38-a82e-ade31eb05dcf \
  -H "Authorization: Bearer $TOKEN"

# Update a task
echo "\n--- Update a task ---"
curl -X PUT http://localhost:3000/api/tasks/5f223360-d388-4c38-a82e-ade31eb05dcf \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Updated documentation task",
    "status": "in_progress"
  }'

# Delete a task
echo "\n--- Delete a task ---"
curl -X DELETE http://localhost:3000/api/tasks/5f223360-d388-4c38-a82e-ade31eb05dcf \
  -H "Authorization: Bearer $TOKEN"

####################################################################
# Analytics Endpoints
####################################################################

echo "\n=== Analytics Endpoints ==="

# Get task completion rates (all time)
echo "\n--- Get task completion rates (all time) ---"
curl -X GET http://localhost:3000/api/analytics/completion-rate \
  -H "Authorization: Bearer $TOKEN"

# Get task completion rates with timeframe filter
echo "\n--- Get task completion rates (last week) ---"
curl -X GET "http://localhost:3000/api/analytics/completion-rate?timeframe=week" \
  -H "Authorization: Bearer $TOKEN"

# Get overdue tasks
echo "\n--- Get overdue tasks ---"
curl -X GET http://localhost:3000/api/analytics/overdue-tasks \
  -H "Authorization: Bearer $TOKEN"

echo "\n"