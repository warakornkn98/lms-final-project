import axios from 'axios';

const decodeToken = async (token) => {
  try {
    const response = await axios.get('http://localhost:5000/api/decode-token', {
      headers: {
        authtoken: `Bearer ${token}`
      }
    });
    console.log(response.data.user)
    return response.data.user;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export default decodeToken;
