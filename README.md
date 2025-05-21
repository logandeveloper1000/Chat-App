# Chat App

Chat App is a real-time messaging application built with React and Firebase. It supports authenticated one-on-one chat sessions and real-time message delivery using Firestore.

View the live project here:  
https://logan-chat-app.netlify.app/

## Features

- Real-time messaging using Firestore
- User authentication (sign up, login, logout)
- Dashboard for listing chat sessions
- Start a new chat using a modal input
- Alert system for unread messages
- Route protection for private pages
- Responsive design and clean UI

## Technologies Used

- React
- React Router
- Firebase Authentication
- Firebase Firestore
- Netlify (for deployment)

## Getting Started

1. Clone the repository
2. Run `npm install` to install dependencies
3. Set up your Firebase project and add configuration
4. Run `npm start` to start the app locally

## Folder Structure

- `src/pages/` – Contains main route views (Login, Register, Dashboard, ChatPage)
- `src/components/` – UI components like Navbar, ChatCard, AlertDropdown, etc.
- `src/context/` – Auth provider for managing login state
- `src/firebase.js` – Firebase configuration and initialization

## License

This project is under a private license. Unauthorized use, distribution, or modification is prohibited.

## Author

Developed by Gabriel Logan.
