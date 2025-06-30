# Snappad MVP

Snappad is a Minimum Viable Product (MVP) for a modern property rental platform inspired by Airbnb, built with Next.js, TypeScript, and Tailwind CSS v4.

## Overview

This MVP demonstrates the core features of a property rental marketplace, focusing on a clean, responsive UI, robust API integration, and a scalable, maintainable codebase. It is designed for rapid iteration and user feedback, with a strong emphasis on modularity and developer experience.

## Features

- **Property Listings**
  - Browse all available properties with responsive, branded cards.
  - View detailed property pages with images, descriptions, amenities, and owner contact info.

- **Booking Flow**
  - Custom date picker for selecting check-in and check-out dates.
  - Custom guest dropdown (not native select) for choosing number of guests.
  - Real-time availability check with graceful error handling.
  - Reservation confirmation with modern, branded UI.

- **User Experience**
  - Custom loading animation featuring the Snappad brand.
  - Airbnb-inspired card and modal designs using your custom color palette.
  - Light and dark mode support throughout the app.
  - Graceful error and not-found pages with consistent styling.

- **Owner Features**
  - Secure form for property owners to list new properties.
  - Modular, reusable form components with validation.

- **API & Data**
  - RESTful API routes for property CRUD operations.
  - MongoDB integration for persistent property data.
  - Axios-based hooks for data fetching with loading and error states.

- **Code Quality**
  - Modular component structure with barrel files for types and exports.
  - Centralized utility functions for date formatting and more.
  - TypeScript throughout for type safety and maintainability.

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   - Copy `.env.example` to `.env.local` and fill in your MongoDB URI and any other required values.

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000) to view the app.**

## Roadmap

- User authentication and profiles
- Reviews and ratings
- Payment integration
- Advanced search and filtering

---

This MVP is a foundation for a full-featured property rental platform. Feedback
