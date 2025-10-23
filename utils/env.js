// utils/env.js

let BASE_URL = ''

if (process.env.NODE_ENV === 'development') {
	BASE_URL = 'https://hhy.t.user.bcdg1135.com/v1'
} else if (process.env.NODE_ENV === 'production') {
	BASE_URL = '/v1'
} else if (process.env.NODE_ENV === 'test') {
	BASE_URL = '/v1'
}

export default {
	BASE_URL
}