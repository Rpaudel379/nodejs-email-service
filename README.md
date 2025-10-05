# Email Service

## Introduction

This Node.js Email Service Backend is a multi-tenant SaaS application designed to handle incoming and outgoing emails for multiple clients. Each client can securely store their IMAP and SMTP credentials, allowing the service to receive live emails, parse them, store them in a database, and forward them to client-defined webhooks. The service also supports sending emails using client SMTP accounts.

## Description

The service bootstraps by fetching all registered clients from the database and initializing IMAP connections for each. Incoming emails are parsed using `mailparser`, stored in MongoDB, and forwarded to the specified webhook endpoint along with attachments. Webhook requests are secured via a basic authentication token, ensuring that only authorized clients can receive forwarded emails.

Key features include:

- Multi-tenant support with isolated client credentials.
- Real-time email listening and parsing.
- Database storage for all incoming emails.
- Forwarding emails to webhooks with attachments.
- Secure webhook communication using basic authentication.
- SMTP support for sending emails on behalf of clients.

The system is designed to be extensible, with future support planned for MinIO attachment storage, per-client authentication methods, and enhanced webhook management.

This guide will walk you through the steps to set up **Email Notification** on **Windows**, **Linux**, and **macOS**.

## Requirements

- **typescript 5.6.3** or above
- **node 20 LTS** or above
- **imap 0.8.19** or above
- **express 4.21.1** or above
- **mailparser 3.7.1** or above
- **mongoose 8.8.1** or above
- **multer 1.4.5-lts.1** or above
- **pino 9.5.0** or above
- **pino-http 10.3.0** or above
- **pino-pretty 13.0.0** or above
- **pino-roll 2.2.0** or above
- **zod 3.23.8** or above
- **docker**

---

## Installation Steps

### Windows Installation

#### 1. Install Node

Node.js is an asynchronous event-driven JavaScript runtime, Node.js is designed to build scalable network applications. To install it:

1. **Download NodeJS v20.18.3 (LTS)** (or above) from the [NodeJS website](https://nodejs.org/en/download/).
2. Run the installer and follow the on-screen instructions.

#### 2. Install Docker

Docker is a set of platform as a service products that use OS-level virtualization to deliver software in packages called containers. To install it:

1. **Download docker desktop** from [Docker Website](https://www.docker.com/products/docker-desktop/).
2. Run the installer and follow the on-screen instructions.

#### 3. Install Mongodb and MongoShell

MongoDB is a document database. It stores data in a type of JSON format called BSON. To Install it:

1. **Download Mongodb and mongoshell** from [Mongodb Website](https://www.mongodb.com/try/download/community/).
2. Run the installers and follow the on-screen instructions.

---

### Linux / macOS Installation

#### 1. Install Node

Follow the instructions to install NodeJS 20 from the [official NodeJS documentation](https://nodejs.org/en/download).

#### 2. Install Docker

Follow the instructions to install Docker from the [official Docker documentation](https://www.docker.com/products/docker-desktop).

#### 3. Install MongoDB and Mongo Shell

Follow the instructions to install Mongodb and mongoshell from the [official Mongodb documentation](https://www.mongodb.com/try/download/community).

---

### 4. Clone the Repository

Clone the **Notification Module** repository to your local machine:

git clone gitlab-logicabeans.com:username/notification-module.git

### 5. Navigate to the Project Directory

Change to the project directory:
cd notification-module

### 6. Install Project Dependencies

Use Node or Bun to install the required dependencies:

- npm install or bun install

### 7. Configure the Environment File

Copy the example environment file and configure it:

- cp .env.sample
- create the .env file and update the necessary mongodb and imap configurations based on your setup.

### 8. Serve the Application locally

To run the app development server, execute:

npm run dev
The application should now be accessible at http://localhost:<ENV_PORT>.

### 9. Serve the Application in a container

To run the app inside a container, execute:

1. docker compose up --build -d

### Contributing Guidelines

- Fork the repository.
- Create a new branch (git checkout -b FD-<number>:<name>).
- Commit changes and push. (git commit -m "FD-<number>:<name>: <Commit Message or Jira ticket title> ")
- Open a Pull Request.

## DEV URL

https://http://localhost:<ENV_PORT>
