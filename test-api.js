#!/usr/bin/env node

// Simple script to test the MovieTix API
const API_BASE = 'http://localhost:8080';

async function testAPI() {
  console.log('Testing MovieTix API endpoints...\n');

  try {
    // Test 1: Movies endpoint without auth
    console.log('1. Testing /api/movies (should return 401)...');
    const moviesResponse = await fetch(`${API_BASE}/api/movies`);
    console.log(`Status: ${moviesResponse.status} ${moviesResponse.statusText}`);
    
    // Test 2: Auth endpoints
    console.log('\n2. Testing auth endpoints...');
    
    // Try register with test user
    const registerData = {
      name: 'Test User',
      email: 'test@movietix.com',
      password: 'test123'
    };
    
    console.log('Registering test user...');
    const registerResponse = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData)
    });
    
    console.log(`Register Status: ${registerResponse.status} ${registerResponse.statusText}`);
    
    if (registerResponse.ok) {
      const registerResult = await registerResponse.json();
      console.log('Registration successful, token received');
      
      // Test movies with auth
      console.log('\n3. Testing /api/movies with auth...');
      const authMoviesResponse = await fetch(`${API_BASE}/api/movies`, {
        headers: { 'Authorization': `Bearer ${registerResult.token}` }
      });
      
      console.log(`Auth Movies Status: ${authMoviesResponse.status} ${authMoviesResponse.statusText}`);
      
      if (authMoviesResponse.ok) {
        const movies = await authMoviesResponse.json();
        console.log(`Found ${movies.length} movies`);
        movies.forEach((movie, index) => {
          console.log(`  ${index + 1}. ${movie.title} (ID: ${movie.id})`);
        });
      }
    } else {
      // Try login instead
      console.log('Registration failed, trying login...');
      const loginData = {
        email: 'admin@example.com',
        password: 'admin'
      };
      
      const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      
      console.log(`Login Status: ${loginResponse.status} ${loginResponse.statusText}`);
    }
    
  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testAPI();