# ChatLink - Realtime Chat Application

ChatLink is a realtime chat application built using Socket.IO & Node.js, providing users with an instant communication experience. The application includes a multi-room chat system that empowers users to create personalized chat rooms, fostering tailored interactions.

## Features

-   **Dynamic Multi-Room Chat System**: Users can create personalized chat rooms and engage in multiple rooms simultaneously, catering to diverse communication needs.

-   **Real-time User Engagement Indicators**: Implemented features such as 'User is Typing' status updates and message notifications for user join and leave events to enhance the overall user experience.

## Deployed App Link

[ChatLink - Realtime Chat Application](https://chatlink-ckqc.onrender.com)

## Installation

To run the project locally, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/mohit1301/chatLink.git
    ```

2. Install dependencies:

    ```bash
    cd chatapp
    npm install
    ```

3. Create a .env file in the root directory and add the following environment variables:

    ```bash
    MONGODB_URL=<your_mongodb_url>
    PORT=<desired_port_number>
    ```

4. Start the server:

    ```bash
    npm start
    ```

5. For development with automatic server restart, you can use:

    ```bash
    npm run devStart
    ```

## Environment Variables

-   `MONGODB_URL`: URL for connecting to MongoDB database.
-   `PORT`: Port number on which the server will run