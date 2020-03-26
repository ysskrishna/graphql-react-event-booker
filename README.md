# EventBiz
A shared events app where users can add their own events and book other users events.

## Backend Express + GraphQl + MongoDB
Clone the git repo and install the dependencies
```sh
npm i 
```

Create a ENV variables MONGO_URI, JWT_SECRET_KEY, JWT_EXPIRATION_TIME
```sh
MONGO_URI = "mongodb://localhost:27017/testDB"
JWT_SECRET_KEY = "ultimatesecret"
JWT_EXPIRATION_TIME = 1
```

Run Backend in development mode
```sh
npm run dev
```
By default the backend will be running in port: 8000

## Frontend React + Semantic-UI-React
Install frontend dependencies. 
```sh
cd client
npm i 
```

Run Frontend in development mode.
```sh
cd client
npm start
```

By default the Frontend will be running in port: 3000

# Images

## Landing Page:
![Landing Page](/images/events_page_unauthenticated.png)

## Login:
![Login Page](/images/login_page.png)

## Register:
![Register Page](/images/register_page.png)

## Dashboard:
![Dashboard Page](/images/add_events.png)

## User Bookings:
![User Bookings Page](/images/bookings_page.png)