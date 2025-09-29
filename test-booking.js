const axios = require('axios');

// Test booking functionality
async function testBooking() {
    try {
        console.log('Testing booking API...');
        
        // First, login to get a valid JWT token
        console.log('1. Logging in...');
        const loginResponse = await axios.post('http://localhost:8080/api/auth/login', {
            email: 'customer@test.com',
            password: 'password123'
        });
        
        const token = loginResponse.data.token;
        console.log('✓ Login successful, got token');
        
        // Test getting showtimes first
        console.log('2. Getting showtime details...');
        const showtimeResponse = await axios.get('http://localhost:8080/api/showtimes/3', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('✓ Showtime retrieved:', {
            id: showtimeResponse.data.id,
            movieTitle: showtimeResponse.data.movieTitle,
            theaterName: showtimeResponse.data.theaterName,
            availableSeats: showtimeResponse.data.availableSeats
        });
        
        // Now test booking
        console.log('3. Creating booking...');
        const bookingResponse = await axios.post('http://localhost:8080/api/bookings', {
            showtimeId: 3,
            seatNumber: 'A1'
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✓ Booking successful:', {
            bookingId: bookingResponse.data.id,
            bookingReference: bookingResponse.data.bookingReference,
            status: bookingResponse.data.status,
            seatNumber: bookingResponse.data.seatNumber,
            totalAmount: bookingResponse.data.totalAmount
        });
        
        // Test getting user's bookings
        console.log('4. Getting user bookings...');
        const userBookingsResponse = await axios.get('http://localhost:8080/api/bookings/my-bookings', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('✓ User bookings retrieved:', userBookingsResponse.data.length, 'bookings found');
        
        console.log('\n🎉 All booking functionality tests passed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        }
    }
}

testBooking();