require('dotenv').config();
const path = require('path');

module.exports = {
    APP: {
        APP_NAME: process.env.APP_NAME || 'My Express',
        APP_ENV: process.env.APP_ENV || 'development',
        APP_PORT: process.env.APP_PORT || 5000,
        APP_URL: process.env.APP_URL || 'http://127.0.0.1:5000',
        APP_SECRET: process.env.APP_SECRET || 'af63ff81e7d3b9d85ff76b2f59b3b7f350186bd7c0c4e513d852a0634a81c722',
        JWT_SECRET: process.env.JWT_SECRET || 'jwtsecretkey',
        SESSION_SECRET: process.env.SESSION_SECRET || 'af63ff81e7d3b9d85ff76b2f59b3b7f350186bd7c0c4e513d852a0634a81c722',
        APP_DEBUG: process.env.APP_DEBUG || true,
        COUNTRY_CODE: process.env.COUNTRY_CODE || 'KE',
        CKEDITOR_LICENSE_KEY: process.env.CKEDITOR_LICENSE_KEY || 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NzQxMzc1OTksImp0aSI6Ijg4NzM5YzI0LTA4OGYtNDNjZS04MTJlLTFhYWI5ODk5M2JiYSIsImxpY2Vuc2VkSG9zdHMiOlsiMTI3LjAuMC4xIiwibG9jYWxob3N0IiwiMTkyLjE2OC4qLioiLCIxMC4qLiouKiIsIjE3Mi4qLiouKiIsIioudGVzdCIsIioubG9jYWxob3N0IiwiKi5sb2NhbCJdLCJ1c2FnZUVuZHBvaW50IjoiaHR0cHM6Ly9wcm94eS1ldmVudC5ja2VkaXRvci5jb20iLCJkaXN0cmlidXRpb25DaGFubmVsIjpbImNsb3VkIiwiZHJ1cGFsIl0sImxpY2Vuc2VUeXBlIjoiZGV2ZWxvcG1lbnQiLCJmZWF0dXJlcyI6WyJEUlVQIl0sInZjIjoiN2Y5NDU5N2IifQ.EKhJAxOtF08fW4tCbVsohtjMn9Jei9uKt8bMgohbu1nI-0fEyMVWkK8qdoD9WNTgO4-QRVx90YGOIYW1LLBJ9g',
    }, 
    BROWSER: {
        WindowConstructorOptions: {
            WIDTH: 1100,
            HEIGHT: 1100,
            MINWIDTH:1000,
            MINHEIGHT:600
        } 
    },
    VIEW_ENGINE: process.env.VIEW_ENGINE || 'ejs',
    PATHS: {
        ROUTES: process.env.ROUTES_PATH || path.join(path.resolve('.'), 'routes'),
        VIEWS: process.env.VIEWS_PATH || path.join(path.resolve('.'), 'resources'),
        PUBLIC: process.env.PUBLIC_PATH || path.join(path.resolve('.'), 'public'),
        STORAGE: path.join(__dirname, '../public/store'),
    },
    DATABASE: {
        DB_CONNECTION: process.env.DB_CONNECTION || 'mysql',
        DB_HOST: process.env.DB_HOST || '127.0.0.1',
        DB_PORT: process.env.DB_PORT || '3306',
        DB_NAME: process.env.DB_NAME || 'myexpress',
        DB_USER: process.env.DB_USER || 'root',
        DB_PASSWORD: process.env.DB_PASSWORD || '',
        DB_SSL: process.env.DB_SSL || false 
    },
    AUTH: {
        JWT_SECRET: process.env.JWT_SECRET || 'jwtsecret',
        TOKEN_EXPIRY: process.env.TOKEN_EXPIRY || '24h',
        BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,
    },
    MAIL: {
        HOST: process.env.MAIL_HOST || '',
        PORT: process.env.MAIL_PORT || '465',
        SOURCE_ADDRESS: process.env.MAIL_SOURCE_ADDRESS || '',
        SOURCE_USERNAME: process.env.MAIL_SOURCE_USERNAME || 'MyExpress Framework',
        ENCRYPTION: process.env.MAIL_ENCRYPTION_CRITERIA || 'ssl',
    },
    ROUTES: {
        PREFIX: '/api',
    },
    REQUESTS: {
        ALLOW_HEADERS_LIST: {
            // 
        }
    },    
    UPLOADS: {
        AUTOSAVE: false,
        AUTORENAME: true,
        MAX_UPLOADS: 100,
        MAX_FILE_SIZE: 5 * 1024 * 1024,
        ALLOWED_FILE_TYPES: [
            "image/png", 
            "image/jpeg", 
            "image/jpg", 
            "application/pdf"
        ],
        PRESERVE_PATH: false,
        UNIQUE_UPLOAD_NAME: ''
    },
    SESSION: {
        SESSION_NAME: "myexpress.auth_session", // leave empty to default to connect.sid
        RESAVE: true,
        PROXY: true,
        CLEAR: true,
    },
    COOKIES: { 
        MAXAGE: 24 * 60 * 60 * 1000,
        SECURE: process.env.APP_ENV === 'production',
        HTTPONLY: true,
        SAMESITE: false, // or Lax, Strict, None, or false 
        PATH: '/',
        DOMAIN: '',
        REFRESH: true
    }
};