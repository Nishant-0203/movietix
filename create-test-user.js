#!/usr/bin/env node

// Script to create a test user and get authentication token
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:8080';

async function createTestUser() {
  console.log('Creating test user for MovieTix...\n');

  try {
    // First, let's try to register a new user
    const registerData = {
      name: 'Test User',
      email: 'test@movietix.com', 
      password: 'test123'
    };
    
    console.log('1. Registering user:', registerData.email);
    const registerResponse = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData)
    });
    
    console.log(`Register Status: ${registerResponse.status} ${registerResponse.statusText}`);
    
    if (registerResponse.ok) {
      const registerResult = await registerResponse.json();
      console.log('✅ Registration successful!');
      console.log('Token:', registerResult.token);
      
      // Test authenticated API calls
      await testAuthenticatedAPIs(registerResult.token);
    } else {
      const errorText = await registerResponse.text();
      console.log('❌ Registration failed:', errorText);
      
      // Try login instead
      console.log('\n2. Trying login with existing user...');
      await tryLogin();
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function tryLogin() {
  const loginAttempts = [
    { email: 'test@movietix.com', password: 'test123' },
    { email: 'admin@movietix.com', password: 'admin123' },
    { email: 'admin@example.com', password: 'admin' },
    { email: 'user@example.com', password: 'password' }
  ];
  
  for (const loginData of loginAttempts) {
    console.log(`Trying login: ${loginData.email}`);
    
    try {
      const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      
      if (loginResponse.ok) {
        const loginResult = await loginResponse.json();
        console.log('✅ Login successful!');
        console.log('Token:', loginResult.token);
        await testAuthenticatedAPIs(loginResult.token);
        return;
      } else {
        console.log(`❌ Login failed for ${loginData.email}: ${loginResponse.status}`);
      }
    } catch (error) {
      console.log(`❌ Login error for ${loginData.email}: ${error.message}`);
    }
  }
}

async function testAuthenticatedAPIs(token) {
  console.log('\n3. Testing authenticated API endpoints...');
  
  try {
    // Test movies endpoint
    const moviesResponse = await fetch(`${API_BASE}/api/movies`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log(`Movies API Status: ${moviesResponse.status} ${moviesResponse.statusText}`);
    
    if (moviesResponse.ok) {
      const movies = await moviesResponse.json();
      console.log(`✅ Found ${movies.length} movies`);
      
      if (movies.length > 0) {
        console.log('Sample movie:', movies[0]);
        
        // Test individual movie endpoint
        const movieId = movies[0].id;
        console.log(`\n4. Testing individual movie endpoint (ID: ${movieId})...`);
        
        const movieResponse = await fetch(`${API_BASE}/api/movies/${movieId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log(`Movie Detail Status: ${movieResponse.status} ${movieResponse.statusText}`);
        
        if (movieResponse.ok) {
          const movie = await movieResponse.json();
          console.log('✅ Movie details fetched:', movie.title);
        }
      }
      
      // Test search endpoint
      console.log('\n5. Testing search endpoint...');
      const searchResponse = await fetch(`${API_BASE}/api/movies/search?title=test`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log(`Search Status: ${searchResponse.status} ${searchResponse.statusText}`);
      
      if (searchResponse.ok) {
        const searchResults = await searchResponse.json();
        console.log(`✅ Search returned ${searchResults.length} results`);
      }
    }
    
  } catch (error) {
    console.error('❌ API test error:', error.message);
  }
}

createTestUser();