// Simple script to test API connectivity
// Run with: node test-api-connection.js

const fetch = require('node-fetch');

// Configuration
const API_BASE_URL = 'http://localhost:8080/api';
const HEALTH_ENDPOINT = '/health';
const ROOM_CUSTOMER_LINK_ENDPOINT = '/v1/room-customer-link/validate';

// Test parameters
const phoneNumber = '1234567890';
const roomName = 'TestRoom';

// Test functions
async function testHealthEndpoint() {
    console.log(`Testing health endpoint: ${API_BASE_URL}${HEALTH_ENDPOINT}`);
    try {
        const response = await fetch(`${API_BASE_URL}${HEALTH_ENDPOINT}`);
        console.log(`Health endpoint status: ${response.status}`);
        if (response.ok) {
            const data = await response.json();
            console.log('Health endpoint response:', data);
            return true;
        } else {
            console.error(`Health endpoint returned status: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.error('Health endpoint error:', error.message);
        return false;
    }
}

async function testRoomCustomerLinkEndpoint() {
    const url = `${API_BASE_URL}${ROOM_CUSTOMER_LINK_ENDPOINT}?phoneNumber=${encodeURIComponent(phoneNumber)}&roomName=${encodeURIComponent(roomName)}`;
    console.log(`Testing room-customer link endpoint: ${url}`);
    
    try {
        const response = await fetch(url);
        console.log(`Room-customer link endpoint status: ${response.status}`);
        if (response.ok) {
            const data = await response.json();
            console.log('Room-customer link endpoint response:', data);
            return true;
        } else {
            console.error(`Room-customer link endpoint returned status: ${response.status}`);
            try {
                const errorData = await response.json();
                console.error('Error details:', errorData);
            } catch (e) {
                console.error('Could not parse error response');
            }
            return false;
        }
    } catch (error) {
        console.error('Room-customer link endpoint error:', error.message);
        return false;
    }
}

// Run tests
async function runTests() {
    console.log('=== API Connection Test ===');
    
    const healthResult = await testHealthEndpoint();
    console.log(`Health endpoint test: ${healthResult ? 'PASSED' : 'FAILED'}`);
    
    const roomCustomerLinkResult = await testRoomCustomerLinkEndpoint();
    console.log(`Room-customer link endpoint test: ${roomCustomerLinkResult ? 'PASSED' : 'FAILED'}`);
    
    console.log('=== Test Complete ===');
}

runTests();
