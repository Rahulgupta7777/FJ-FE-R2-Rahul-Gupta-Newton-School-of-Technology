# NexRide (Ride Sharing Application) 


A modern, full-stack ride-sharing platform built with cutting-edge web technologies. This application demonstrates enterprise-level software engineering practices with a type-safe React frontend and a robust Node.js backend.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Features](#features)
- [Architecture](#architecture)
- [Development Guidelines](#development-guidelines)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

##  Overview

This ride-sharing application provides users with an intuitive interface to book rides, track drivers in real-time, manage payments, and review trip history. The frontend features interactive maps with Leaflet integration, while the backend provides secure REST APIs with JWT authentication and PostgreSQL persistence.


##  Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.1.6 | React framework with server-side rendering & API routes |
| **React** | 19.2.3 | UI component library |
| **TypeScript** | ^5 | Static type checking for JavaScript |
| **TailwindCSS** | ^4 | Utility-first CSS framework |
| **shadcn/ui** | ^3.8.5 | High-quality React components |
| **Leaflet** | ^1.9.4 | Interactive maps for location display |
| **jsPDF** | ^4.2.0 | PDF document generation |
| **Lucide React** | ^0.575.0 | Modern icon library |
| **next-themes** | ^0.4.6 | Dark mode support |
| **Radix UI** | ^1.4.3 | Unstyled, accessible UI primitives |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Express.js** | ^5.2.1 | Minimalist web application framework |
| **Node.js** | >=14 | JavaScript runtime environment |
| **PostgreSQL** | Latest | Relational database |
| **pg** | ^8.19.0 | PostgreSQL client for Node.js |
| **JWT** | ^9.0.3 | JSON Web Token authentication |
| **bcryptjs** | ^3.0.3 | Password hashing & encryption |
| **CORS** | ^2.8.6 | Cross-origin resource sharing middleware |
| **dotenv** | ^17.3.1 | Environment variable management |
| **GTFS Realtime** | ^1.1.1 | Real-time transit data |
| **Stripe** | ^20.4.0 | Payment processing (optional) |
