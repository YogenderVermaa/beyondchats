Tech Stack

Laravel 10

PHP 8.1+

PostgreSQL

REST API

Features

CRUD APIs for articles

Stores original and AI-updated articles

Database migrations included

Production-ready configuration

Setup (Local)
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve

API Endpoint

GET /api/articles – Fetch all articles

POST /api/articles – Create new article

Environment Variables

Configure database and app settings in .env:

APP_ENV=production
APP_DEBUG=false

DB_CONNECTION=pgsql
DB_HOST=...
DB_DATABASE=...
DB_USERNAME=...
DB_PASSWORD=...

Deployment

Deployed using Railway

MySql managed via Railway plugin

Environment variables set in Railway dashboard