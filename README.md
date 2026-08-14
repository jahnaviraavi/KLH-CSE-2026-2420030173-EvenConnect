# KLH-CSE-2026-2420030173-EvenConnect
# EventConnect – Smart Event Management and Registration System

## Team Members

| S. No. | University ID | Name                        |
| ------ | ------------- | --------------------------- |
| 1      | 2420030173    | Raavi Jahnavi               |
| 2      | 2420030211    | Maremanda Sai Kridhay Kumar |
| 3      | 2420030556    | Sri Hansika Saraf           |
| 4      | 2420030558    | Bobbadhi Kundana Mani       |

## Supervisor

**Ms. G. Lavanya**

## Course

**Adaptive Software Engineering – 24CI3201**

## Team

**Group 10**

## Abstract

EventConnect – Smart Event Management and Registration System is a web-based platform designed to simplify the process of discovering, organizing, booking, and managing events.

Many users face difficulties when event information, registration, ticket booking, payments, and booking records are handled through separate platforms. EventConnect addresses these challenges by providing a centralized platform that connects event discovery, registration, ticket booking, payment processing, booking confirmation, and reporting.

The platform allows users to register and securely log in, manage their profiles, search for events, view event details, book and cancel tickets, make payments, view booking history, and download tickets. Organizers can create, update, and delete events, view bookings, and generate attendee and revenue reports. Administrators handle payment-related operations and manage refunds.

The project follows Agile Software Engineering principles with an iterative, Sprint-based development approach. Requirements are organized using user stories and a product backlog. The system is developed incrementally, with continuous testing, Sprint reviews, retrospectives, and regular feedback.

The project demonstrates the practical application of Object-Oriented Programming, Java programming, database concepts, UML modelling, user stories, Agile process models, software testing, and team-based software development.

## Key Features

* User registration and login
* User profile management
* Password reset
* Event search
* Event details
* Event creation and management
* Ticket booking
* Ticket cancellation
* Booking history
* Ticket download
* Booking confirmation
* Online payment
* Payment history
* Attendee reports
* Revenue reports
* Refund management

## Technologies Used

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Java
* Object-Oriented Programming

### Database

* MySQL

### Database Connectivity

* JDBC

### Software Engineering

* Agile Development
* Scrum / Sprint-based Development
* User Stories
* UML Modelling
* Software Testing

## System Users

### User

Users can:

* Register an account
* Log in
* Update profile information
* Reset password
* Search for events
* View event details
* Book tickets
* Cancel bookings
* View booking history
* Download tickets
* Make payments
* View payment history
* Receive booking confirmation
* View booked events

### Organizer

Organizers can:

* Create events
* Update event information
* Delete events
* View bookings
* Generate attendee reports
* Generate revenue reports

### Administrator

Administrators can:

* View payment information
* View payment history
* Manage refunds
* Handle administrative operations

## Main Modules

### 1. User Management

* User Registration
* User Login
* Profile Management
* Password Management
* View Booked Events

### 2. Event Management

* Create Event
* Update Event
* Delete Event
* Search Events
* View Event Details

### 3. Ticket Booking

* Book Ticket
* Cancel Booking
* View Booking History
* Download Ticket
* Booking Confirmation

### 4. Payments and Reports

* Make Payment
* View Payment History
* Generate Attendee Reports
* Generate Revenue Reports
* Manage Refunds

## Development Methodology

The EventConnect project follows an **Agile Process Model** using an iterative and Sprint-based development approach.

### Agile Development Cycle

```text
Product Backlog
      ↓
Sprint Planning
      ↓
Development
      ↓
Testing
      ↓
Sprint Review
      ↓
Retrospective
      ↓
Next Sprint
```

Agile development is used to support:

* Incremental development
* Continuous testing
* Regular feedback
* Easy progress tracking
* Better team collaboration
* Continuous improvement after each Sprint

## Sprint Planning

### Sprint 1 – User Management

Features:

* User Registration
* User Login
* Update Profile
* Reset Password
* View Booked Events

### Sprint 2 – Event Management

Features:

* Create Event
* Update Event
* Delete Event
* Search Event
* View Event Details

### Sprint 3 – Ticket Booking

Features:

* Book Ticket
* Cancel Booking
* View Booking History
* Download Ticket
* Receive Booking Confirmation

### Sprint 4 – Payments and Reports

Features:

* Make Payment
* View Payment History
* Generate Attendee Report
* Generate Revenue Report
* Manage Refunds

## User Stories

The project requirements are organized into four major epics:

### Epic 1 – User Management

* US01 – User Registration
* US02 – User Login
* US03 – Update Profile
* US04 – Reset Password
* US05 – View Booked Events

### Epic 2 – Event Management

* US06 – Create Event
* US07 – Update Event
* US08 – Delete Event
* US09 – Search Event
* US10 – View Event Details

### Epic 3 – Ticket Booking

* US11 – Book Ticket
* US12 – Cancel Booking
* US13 – View Booking History
* US14 – Download Ticket
* US15 – Receive Booking Confirmation

### Epic 4 – Payments and Reports

* US16 – Make Payment
* US17 – View Payment History
* US18 – Generate Attendee Report
* US19 – Generate Revenue Report
* US20 – Manage Refunds

## UML and System Design

The system design identifies three major actors:

* User
* Organizer
* Administrator

The UML use cases are organized around:

1. User Management
2. Event Management
3. Ticket Booking
4. Payments and Reports

Important system relationships include:

* Book Ticket → Make Payment
* Book Ticket → Receive Booking Confirmation
* Cancel Booking → Manage Refunds

## Project Development Approach

The project is developed incrementally. Each module is designed, implemented, and tested before being integrated with the other modules.

The overall development flow is:

```text
Requirements
     ↓
User Stories
     ↓
UML Design
     ↓
Sprint Planning
     ↓
Java Implementation
     ↓
Testing
     ↓
Integration
     ↓
Final System
```

## Setup Instructions

### Prerequisites

Make sure the following software is installed:

* Java
* MySQL
* JDBC-compatible Java environment
* Git
* A Java development environment / IDE

### Clone the Repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### Database Setup

1. Install and configure MySQL.
2. Create the database required by EventConnect.
3. Configure the database connection details for the Java application.
4. Configure JDBC connectivity.
5. Add the required source files under the `src/` directory.

### Run the Project

1. Open the project in a Java development environment.
2. Configure the MySQL database connection.
3. Ensure the required JDBC configuration is available.
4. Compile the Java source code.
5. Run the application.

> Detailed database configuration and execution commands will be updated as implementation progresses.

## Repository Structure

```text
EventConnect/
│
├── src/
│   └── Source code
│
├── docs/
│   └── Project documentation, UML diagrams and requirements
│
├── data/
│   └── Project data or documented data-source references
│
├── results/
│   └── Development and testing results
│
├── reports/
│   └── Project reports and analysis
│
└── README.md
```

## Current Phase Status

**Current Phase: Review 1 – Requirements and System Design**

### Completed

* Project identification
* Project overview
* Problem identification
* Proposed system
* System actors
* User stories
* Major system modules
* UML use case design
* System flow
* Agile process model
* Sprint planning
* Technology identification
* Project documentation

### Next Phase

* Module implementation
* Java development
* Database integration
* Testing
* Module integration

## Expected Outcome

The expected outcome of EventConnect is a functional event management and registration system that allows users to discover and book events, organizers to manage their events and reports, and administrators to handle payment-related administrative tasks.

The project aims to demonstrate the practical application of:

* Object-Oriented Programming
* Java Programming
* Database Concepts
* UML Modelling
* User Stories
* Agile Process Model
* Software Testing
* Team-Based Software Development

## Academic Project

**EventConnect – Smart Event Management and Registration System**

**Adaptive Software Engineering – 24CI3201**

**Group 10**

**Supervisor:** Ms. G. Lavanya
