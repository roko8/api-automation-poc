import axios from 'axios';
import CryptoJS from 'crypto-js';

// Function to decrypt credentials
async function decryptCredentials(encryptedData: string, key: string): Promise<string> {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
}

// Function to login to the mock API
async function login(username: string, password: string): Promise<string> {
    try {
        const response = await axios.get('http://localhost:3000/users', {
            params: {
                username: username,
                password: password
            }
        });

        if (response.data.length > 0) {
            console.log('Login successful!');
            return 'fakeAuthToken';  // Mock token for demonstration purposes
        } else {
            throw new Error('Login failed');
        }
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
}

// Function to perform an action using the mock API
async function performAction(authToken: string): Promise<void> {
    try {
        const config = {
            headers: { Authorization: `Bearer ${authToken}` }
        };

        const response = await axios.get('http://localhost:3000/actions', config);
        console.log('Action response:', response.data);
    } catch (error) {
        console.error('Error performing action:', error);
    }
}

// Main function to run the script
(async function main() {
    const encryptedUsername = CryptoJS.AES.encrypt('testuser', 'encryptionKey').toString();
    const encryptedPassword = CryptoJS.AES.encrypt('testpassword', 'encryptionKey').toString();
    const encryptionKey = 'encryptionKey';

    const username = await decryptCredentials(encryptedUsername, encryptionKey);
    const password = await decryptCredentials(encryptedPassword, encryptionKey);

    const authToken = await login(username, password);
    await performAction(authToken);
})();
