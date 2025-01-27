# 1. Comprehensive Website Handbook

## 1.1. Index

- [1. Comprehensive Website Handbook](#1-comprehensive-website-handbook)
  - [1.1. Index](#11-index)
  - [1.2. Introduction](#12-introduction)
    - [1.2.1. About the Website](#121-about-the-website)
    - [1.2.2. Purpose of the Handbook](#122-purpose-of-the-handbook)
    - [1.2.3. Target Audience (Developers, Marketers, Testers, etc.)](#123-target-audience-developers-marketers-testers-etc)
    - [1.2.4. How to Use This Handbook](#124-how-to-use-this-handbook)
  - [1.3. Website Overview](#13-website-overview)
    - [1.3.1. Vision and Mission of the Website](#131-vision-and-mission-of-the-website)
    - [1.3.2. Key Features and Offerings](#132-key-features-and-offerings)
    - [1.3.3. Target Audience for the Website (end-users)](#133-target-audience-for-the-website-end-users)
    - [1.3.4. High-Level Overview of the Website Workflow](#134-high-level-overview-of-the-website-workflow)
    - [1.3.5. Glossary of Terms (for technical and non-technical users)](#135-glossary-of-terms-for-technical-and-non-technical-users)
      - [1.3.5.1. General Terms](#1351-general-terms)
      - [1.3.5.2. Order Types](#1352-order-types)
      - [1.3.5.3. User Roles](#1353-user-roles)
      - [1.3.5.4. Technical Terms](#1354-technical-terms)
      - [1.3.5.5. Payment Terms](#1355-payment-terms)
      - [1.3.5.6. Features](#1356-features)
  - [1.4. Functional Flow](#14-functional-flow)
    - [1.4.1. User Flows](#141-user-flows)
    - [1.4.2. Visual Flow Diagrams for Each User Flow](#142-visual-flow-diagrams-for-each-user-flow)
      - [1.4.2.1. delivery order flow](#1421-delivery-order-flow)
      - [1.4.2.2. takeaway order flow](#1422-takeaway-order-flow)
      - [1.4.2.3. dine-in order flow](#1423-dine-in-order-flow)
    - [1.4.3. Use case diagrams](#143-use-case-diagrams)
      - [1.4.3.1. Activity diagrams](#1431-activity-diagrams)
      - [1.4.3.2. State machine diagrams](#1432-state-machine-diagrams)
      - [1.4.3.3. Sequence diagrams](#1433-sequence-diagrams)
      - [1.4.3.4. Communication diagrams](#1434-communication-diagrams)
      - [1.4.3.5. Interaction overview diagrams](#1435-interaction-overview-diagrams)
    - [1.4.4. Key Use Cases and Scenarios](#144-key-use-cases-and-scenarios)
  - [1.5. Technical Architecture](#15-technical-architecture)
    - [1.5.1. Technology Stack Overview](#151-technology-stack-overview)
    - [1.5.2. High-Level Architecture Diagram](#152-high-level-architecture-diagram)
    - [1.5.3. Deployment and Hosting Details](#153-deployment-and-hosting-details)
    - [1.5.4. Environment Setup](#154-environment-setup)
  - [1.6. Beginner’s Guide to Programming](#16-beginners-guide-to-programming)
    - [1.6.1. Introduction to Web Development Basics](#161-introduction-to-web-development-basics)
    - [1.6.2. Overview of Tools and Software to Install](#162-overview-of-tools-and-software-to-install)
    - [1.6.3. Step-by-Step Guide to Setting Up the Project Locally](#163-step-by-step-guide-to-setting-up-the-project-locally)
    - [1.6.4. Suggested Learning Path](#164-suggested-learning-path)
    - [1.6.5. Debugging Basics](#165-debugging-basics)
  - [1.7. Codebase Structure and Flow](#17-codebase-structure-and-flow)
    - [1.7.1. Overview of the Codebase](#171-overview-of-the-codebase)
    - [1.7.2. Code Execution Flow](#172-code-execution-flow)
    - [1.7.3. Understanding Functions and Modules](#173-understanding-functions-and-modules)
    - [1.7.4. Step-by-Step Explanation of a Key Feature](#174-step-by-step-explanation-of-a-key-feature)
    - [1.7.5. Reading the Code](#175-reading-the-code)
    - [1.7.6. Code Standards and Best Practices](#176-code-standards-and-best-practices)
  - [1.8. API Documentation](#18-api-documentation)
    - [1.8.1. Overview of API Usage and Purpose](#181-overview-of-api-usage-and-purpose)
    - [1.8.2. API Endpoint List](#182-api-endpoint-list)
      - [1.8.2.1. Admin Panel endpoints](#1821-admin-panel-endpoints)
        - [1.8.2.1.1. Get Restaurants by Status](#18211-get-restaurants-by-status)
        - [1.8.2.1.2. Get Restaurant Payment Details](#18212-get-restaurant-payment-details)
        - [1.8.2.1.3. Get Account Transfer Details](#18213-get-account-transfer-details)
        - [1.8.2.1.4. Get Admin Restaurant Data](#18214-get-admin-restaurant-data)
        - [1.8.2.1.5. Change Restaurant Status](#18215-change-restaurant-status)
        - [1.8.2.1.6. Edit Restaurant Details](#18216-edit-restaurant-details)
        - [1.8.2.1.7. View All Users of a Restaurant](#18217-view-all-users-of-a-restaurant)
        - [1.8.2.1.8. Send Email to Restaurant](#18218-send-email-to-restaurant)
        - [1.8.2.1.9. Export JSON to Excel](#18219-export-json-to-excel)
      - [1.8.2.2. Authentication Endpoints](#1822-authentication-endpoints)
        - [1.8.2.2.1. changePassword](#18221-changepassword)
        - [1.8.2.2.2. resetPassword](#18222-resetpassword)
        - [1.8.2.2.3. register](#18223-register)
        - [1.8.2.2.4. login](#18224-login)
        - [1.8.2.2.5. forgotPassword](#18225-forgotpassword)
        - [1.8.2.2.6. sendEmailVerificationOtp](#18226-sendemailverificationotp)
        - [1.8.2.2.7. verifyEmailOtp](#18227-verifyemailotp)
        - [1.8.2.2.8. Utility Methods](#18228-utility-methods)
      - [1.8.2.3. Customer Details Endpoints](#1823-customer-details-endpoints)
        - [1.8.2.3.1. Store Customer Details](#18231-store-customer-details)
        - [1.8.2.3.2. Get Customer Details](#18232-get-customer-details)
      - [1.8.2.4. Customer Service Endpoints](#1824-customer-service-endpoints)
      - [1.8.2.5. Get Customer](#1825-get-customer)
        - [1.8.2.5.1. Add Customer Address](#18251-add-customer-address)
        - [1.8.2.5.2. Edit Customer Address](#18252-edit-customer-address)
        - [1.8.2.5.3. Send Email](#18253-send-email)
        - [1.8.2.5.4. Delete Address of Requesting Customer by ID](#18254-delete-address-of-requesting-customer-by-id)
        - [1.8.2.5.5. Get Nearby Restaurants](#18255-get-nearby-restaurants)
        - [1.8.2.5.6. Get All Restaurants](#18256-get-all-restaurants)
        - [1.8.2.5.7. Get Restaurant Details by URL](#18257-get-restaurant-details-by-url)
        - [1.8.2.5.8. Get Restaurant Details by ID](#18258-get-restaurant-details-by-id)
        - [1.8.2.5.9. Get Promo Codes for Restaurant by URL](#18259-get-promo-codes-for-restaurant-by-url)
        - [1.8.2.5.10. Check If Promo Code is Valid](#182510-check-if-promo-code-is-valid)
        - [1.8.2.5.11. Update Customer Data](#182511-update-customer-data)
        - [1.8.2.5.12. Check If Dine-In is Available](#182512-check-if-dine-in-is-available)
        - [1.8.2.5.13. Get Restaurant Status](#182513-get-restaurant-status)
      - [1.8.2.6. Google Maps Service Endpoints](#1826-google-maps-service-endpoints)
        - [1.8.2.6.1. Get Autocomplete Results](#18261-get-autocomplete-results)
        - [1.8.2.6.2. Get Geocode Details](#18262-get-geocode-details)
        - [1.8.2.6.3. Get Formatted Geocode Details](#18263-get-formatted-geocode-details)
        - [1.8.2.6.4. Get Place Details](#18264-get-place-details)
    - [1.8.3. Error Codes and Handling](#183-error-codes-and-handling)
    - [1.8.4. How to Test APIs as a Beginner](#184-how-to-test-apis-as-a-beginner)
  - [1.9. Database Design](#19-database-design)
    - [1.9.1. Database Schema Overview](#191-database-schema-overview)
    - [1.9.2. Key Tables and Their Purpose](#192-key-tables-and-their-purpose)
    - [1.9.3. Entity-Relationship Diagrams (ERD)](#193-entity-relationship-diagrams-erd)
    - [1.9.4. Sample Queries for Common Use Cases](#194-sample-queries-for-common-use-cases)
  - [1.10. User Interface (UI)](#110-user-interface-ui)
    - [1.10.1. Screenshots of All Pages (annotated with descriptions)](#1101-screenshots-of-all-pages-annotated-with-descriptions)
    - [1.10.2. Navigation Map](#1102-navigation-map)
    - [1.10.3. Design Principles Used](#1103-design-principles-used)
  - [1.11. Ad Hoc Process Configuration](#111-ad-hoc-process-configuration)
    - [1.11.1. Payment Gateway Integration](#1111-payment-gateway-integration)
      - [1.11.1.1. Overview of Payment Gateway Used](#11111-overview-of-payment-gateway-used)
      - [1.11.1.2. API Keys, Credentials, and Configuration Steps](#11112-api-keys-credentials-and-configuration-steps)
      - [1.11.1.3. Step-by-Step Guide for Setting Up Payment Flow](#11113-step-by-step-guide-for-setting-up-payment-flow)
    - [1.11.2. Messaging Service Integration (e.g., SMS, WhatsApp)](#1112-messaging-service-integration-eg-sms-whatsapp)
      - [1.11.2.1. Overview of Messaging Providers](#11121-overview-of-messaging-providers)
      - [1.11.2.2. Setting Up API Access and Authentication](#11122-setting-up-api-access-and-authentication)
      - [1.11.2.3. Sending Messages](#11123-sending-messages)
  - [1.12. Testing Guidelines](#112-testing-guidelines)
    - [1.12.1. Overview of Testing Strategy](#1121-overview-of-testing-strategy)
    - [1.12.2. Functional Testing Scenarios](#1122-functional-testing-scenarios)
    - [1.12.3. Technical Testing](#1123-technical-testing)
    - [1.12.4. Bug Reporting Guidelines](#1124-bug-reporting-guidelines)
  - [1.13. Deployment and Maintenance](#113-deployment-and-maintenance)
    - [1.13.1. Deployment Process](#1131-deployment-process)
    - [1.13.2. Version Control Guidelines](#1132-version-control-guidelines)
    - [1.13.3. Backup and Recovery Plan](#1133-backup-and-recovery-plan)
  - [1.14. Troubleshooting Guide](#114-troubleshooting-guide)
    - [1.14.1. Common Issues and Fixes](#1141-common-issues-and-fixes)
    - [1.14.2. Debugging Tips for Developers](#1142-debugging-tips-for-developers)
  - [1.15. Security Considerations](#115-security-considerations)
    - [1.15.1. Security Practices Implemented](#1151-security-practices-implemented)
    - [1.15.2. Guidelines for Handling Sensitive Data](#1152-guidelines-for-handling-sensitive-data)
  - [1.16. FAQ](#116-faq)
    - [1.16.1. Common Questions by Non-Technical Staff](#1161-common-questions-by-non-technical-staff)
    - [1.16.2. Questions Related to API Usage](#1162-questions-related-to-api-usage)
    - [1.16.3. Testing and Debugging FAQs](#1163-testing-and-debugging-faqs)
  - [1.17. Appendix](#117-appendix)
    - [1.17.1. Resources and References](#1171-resources-and-references)
    - [1.17.2. Links to Tools, Libraries, and Frameworks Used](#1172-links-to-tools-libraries-and-frameworks-used)
    - [1.17.3. Glossary of Technical Terms](#1173-glossary-of-technical-terms)

## 1.2. Introduction

### 1.2.1. About the Website

The website isa platformfor the userto order food online. The website provides a list of restaurants, their menus, and allows users to place orders for delivery or pickup or dine in . Users can create accounts, save their favorite orders, and track the status of their orders in real-time.

### 1.2.2. Purpose of the Handbook

The purpose of this handbook is to provide a comprehensive guide to the website's architecture, codebase, and functionality. It is intended for developers, testers, and other stakeholders who need to understand how the website works, how to set it up locally, and how to maintain and troubleshoot it.

### 1.2.3. Target Audience (Developers, Marketers, Testers, etc.)

The target audience for this handbook includes:

- Developers who need to understand the codebase, APIs, and database design.
- Testers who need to know how to test the website and report bugs.
- Marketers who need to understand the website's features and target audience.
- Project managers who need to oversee the development and deployment of the website.
- Non-technical staff who need a high-level overview of the website's functionality.
- New team members who need to onboard quickly and understand the project.
- Anyone interested in learning about web development and programming.

### 1.2.4. How to Use This Handbook

This handbook is organized into sections that cover different aspects of the website, from the high-level overview to the technical details of the codebase and database design. You can use the table of contents to navigate to specific sections or read through the entire handbook to get a comprehensive understanding of the website.

## 1.3. Website Overview

### 1.3.1. Vision and Mission of the Website

The vision of the website is to provide a seamless and convenient online ordering experience for users, connecting them with their favorite restaurants and enabling them to order food with ease. The mission of the website is to offer a wide variety of food options, ensure timely delivery, and provide a user-friendly interface that makes ordering food a pleasant experience.

### 1.3.2. Key Features and Offerings

The website offers the following key features and offerings:

- User registration and account creation
- Restaurant listings with menus and reviews
- Order placement for delivery, pickup, or dine-in
- Real-time order tracking
- Favorite orders and reordering
- Payment gateway integration
- Messaging service integration for order updates

### 1.3.3. Target Audience for the Website (end-users)

The target audience for the website includes:

- Working professionals who want to order food for lunch or dinner
- Families looking to order meals for home delivery
- Students who want to order food for study sessions
- Tourists and travelers looking for local cuisine
- Food enthusiasts who want to explore new restaurants
- Event organizers who need catering services
- Anyone who prefers the convenience of online food ordering
- Anyone who wants to avoid the hassle of cooking

### 1.3.4. High-Level Overview of the Website Workflow

```mermaid
graph TB
    subgraph Client["Frontend (Angular 14)"]
        UI[User Interface]
        PWA[Progressive Web App]
        Components[Angular Components]
        Services[Angular Services]
        MaterialUI[Angular Material UI]
    end

    subgraph Firebase["Firebase Backend"]
        Auth[Authentication]
        DB[(Firebase Database)]
        Storage[Cloud Storage]
        Hosting[Firebase Hosting]
    end

    subgraph Features["Core Features"]
        QR[QR Code Generation/Scanning]
        Maps[Google Maps Integration]
        Print[Thermal Printing]
        Payment[Payment Processing]
        RealTime[Real-time Updates]
    end

    Client --> Firebase
    Features --> Client
    Socket[Socket.io] --> RealTime

    style Client fill:#f9f,stroke:#333,stroke-width:2px
    style Firebase fill:#ff9,stroke:#333,stroke-width:2px
    style Features fill:#9f9,stroke:#333,stroke-width:2px
```

### 1.3.5. Glossary of Terms (for technical and non-technical users)

#### 1.3.5.1. General Terms

- **Digital Menu**: An electronic version of a restaurant's menu that can be accessed through web browsers or mobile devices
- **POS (Point of Sale)**: The system where transactions are processed and orders are managed
- **QR Code**: A square barcode that can be scanned by smartphones to quickly access the digital menu
- **Cart**: A virtual collection of items selected by the customer before placing an order

#### 1.3.5.2. Order Types

- **Dine-in**: Customers eating at the restaurant premises
- **Takeaway**: Customers picking up their order from the restaurant
- **Delivery**: Food being delivered to the customer's specified location

#### 1.3.5.3. User Roles

- **Customer**: End-user who browses the menu and places orders
- **Restaurant Staff**: Personnel who manage orders and update menu items
- **Admin**: System administrator with full access to manage the platform
- **Delivery Partner**: Person responsible for delivering orders to customers

#### 1.3.5.4. Technical Terms

- **Frontend**: The user interface that customers interact with (website/app)
- **Backend**: Server-side system that processes requests and manages data
- **API (Application Programming Interface)**: System that allows different parts of the application to communicate
- **Database**: System that stores all menu items, orders, and user information
- **Authentication**: Process of verifying user identity
- **Cache**: Temporary storage of frequently accessed data for faster performance

#### 1.3.5.5. Payment Terms

- **Payment Gateway**: System that processes online payments securely
- **Transaction**: A completed order payment
- **Payment Status**: Current state of payment (pending/completed/failed)
- **Refund**: Return of payment to customer's account

#### 1.3.5.6. Features

- **Real-time Tracking**: Live monitoring of order status
- **Menu Customization**: Ability to modify menu items based on availability
- **Order History**: Record of all past orders
- **Favorites**: Saved list of frequently ordered items
- **Reviews & Ratings**: Customer feedback system

## 1.4. Functional Flow

### 1.4.1. User Flows

```mermaid
graph TD
    A[User visits homepage] --> B[User browses menu]
    B --> C[User selects items]
    C --> D[User adds items to cart]
    D --> E[User reviews cart]
    E --> F[User proceeds to checkout]
    F --> G[User enters delivery details]
    G --> H[User makes payment]
    H --> I[Order confirmation]
    I --> J[Order tracking]
    J --> K[Order delivery]
```

### 1.4.2. Visual Flow Diagrams for Each User Flow

#### 1.4.2.1. delivery order flow

```mermaid
sequenceDiagram
    participant Customer
    participant Restaurant
    participant DeliveryPerson

    Customer->>Restaurant: Place delivery order
    Restaurant->>Customer: Confirm order
    Customer->>Restaurant: Provide delivery address
    Restaurant->>DeliveryPerson: Assign delivery person
    DeliveryPerson->>Restaurant: Collect order
    Restaurant->>DeliveryPerson: Hand over order
    DeliveryPerson->>Customer: Deliver order
    Customer->>DeliveryPerson: Pay bill
    DeliveryPerson->>Customer: Thank customer
```

#### 1.4.2.2. takeaway order flow

```mermaid
sequenceDiagram
    participant Customer
    participant Restaurant

    Customer->>Restaurant: Place takeaway order
    Restaurant->>Customer: Confirm order
    Customer->>Restaurant: Arrive at restaurant
    Restaurant->>Customer: Collect order
    Customer->>Restaurant: Pay bill
    Restaurant->>Customer: Thank customer
```

#### 1.4.2.3. dine-in order flow

```mermaid
sequenceDiagram
    participant Customer
    participant Restaurant
    participant Table

    Customer->>Restaurant: Place dine-in order
    Restaurant->>Customer: Confirm order
    Customer->>Restaurant: Arrive at restaurant
    Restaurant->>Customer: Seat customer
    Customer->>Table: Choose table
    Table->>Restaurant: Reserve table
    Restaurant->>Customer: Table reserved
    Customer->>Restaurant: Order food
    Restaurant->>Customer: Serve food
    Customer->>Restaurant: Pay bill
    Restaurant->>Customer: Thank customer
```

### 1.4.3. Use case diagrams

#### 1.4.3.1. Activity diagrams

```mermaid
graph TD
    A[Start] --> B[User]
    B -->|Browse Menu| C[Menu Page]
    C -->|Select Items| D[Cart Page]
    D -->|Review Cart| E[Checkout Page]
    E -->|Place Order| F[Order Confirmation]
    F -->|Track Order| G[Order Tracking]
    G -->|Delivery| H[Order Delivered]
    G -->|Pickup| I[Order Picked Up]
    G -->|Dine-in| J[Order Served]
```

#### 1.4.3.2. State machine diagrams

```mermaid
stateDiagram
    [*] --> Menu
    Menu --> Cart
    Cart --> Checkout
    Checkout --> Order
    Order --> Tracking
    Tracking --> [*]
```

#### 1.4.3.3. Sequence diagrams

```mermaid
sequenceDiagram
    participant User
    participant Website
    participant Backend
    participant Database

    User->>Website: Browse menu
    Website->>Backend: Fetch menu items
    Backend->>Database: Retrieve menu data
    Database-->>Backend: Send menu data
    Backend-->>Website: Return menu items
    Website-->>User: Display menu items
```

#### 1.4.3.4. Communication diagrams

```mermaid
graph TB
    subgraph Frontend [Angular Frontend]
        APP[App Module]
        LANDING[Landing Module]
        REST[Restaurant Module]
        ADMIN[Admin Module]
        ORDER[Order Module]

        subgraph Components
            HOME[Homepage Component]
            LAYOUT[Layout Component]
            MENU[Restaurant Menu Component]
            MYORDER[My Order Component]
        end

        subgraph Services
            AUTH[Authentication Service]
            CUST[Customer Service]
            REST_SVC[Restaurant Service]
            ORDER_SVC[Order Service]
        end
    end

    subgraph Backend [Backend]
        API[API Server]
        SOCKET[Socket.IO Server]
    end

    subgraph External
        DB[(Database)]
        FIREBASE[Firebase]
    end

    %% Frontend Module Relations
    APP --> LANDING
    APP --> REST
    APP --> ADMIN
    APP --> ORDER

    %% Component Relations
    REST --> HOME
    REST --> LAYOUT
    REST --> MENU
    REST --> MYORDER

    %% Service Communications
    HOME --> AUTH
    HOME --> REST_SVC
    LAYOUT --> AUTH
    LAYOUT --> ORDER_SVC
    MENU --> REST_SVC
    MENU --> ORDER_SVC
    MYORDER --> ORDER_SVC

    %% Backend Communications
    AUTH --> API
    REST_SVC --> API
    ORDER_SVC --> API
    ORDER_SVC --> SOCKET

    %% External Communications
    API --> DB
    API --> FIREBASE
    SOCKET --> DB
```

#### 1.4.3.5. Interaction overview diagrams

```mermaid
graph TB
    subgraph "User Interactions"
        START((Start))
        BROWSE[Browse Restaurants]
        LOGIN[Customer Login]
        VIEW_MENU[View Restaurant Menu]
        ADD_CART[Add Items to Cart]
        PLACE_ORDER[Place Order]
        TRACK[Track Order Status]
        END((End))
    end

    subgraph "System Processes"
        AUTH_PROC[Authentication Process]
        MENU_LOAD[Load Menu Data]
        CART_PROC[Cart Processing]
        ORDER_PROC[Order Processing]
        PAYMENT[Payment Processing]
        NOTIFY[Real-time Notifications]
    end

    subgraph "Restaurant Actions"
        REST_LOGIN[Restaurant Login]
        ORDER_MANAGE[Manage Orders]
        UPDATE_STATUS[Update Order Status]
    end

    %% Main Flow
    START --> BROWSE
    BROWSE --> VIEW_MENU
    VIEW_MENU --> ADD_CART
    ADD_CART --> LOGIN
    LOGIN --> PLACE_ORDER
    PLACE_ORDER --> TRACK

    %% System Process Connections
    LOGIN --> AUTH_PROC
    VIEW_MENU --> MENU_LOAD
    ADD_CART --> CART_PROC
    PLACE_ORDER --> ORDER_PROC
    ORDER_PROC --> PAYMENT
    TRACK --> NOTIFY

    %% Restaurant Flow
    REST_LOGIN --> ORDER_MANAGE
    ORDER_MANAGE --> UPDATE_STATUS
    UPDATE_STATUS --> NOTIFY

    %% Conditions and States
    CART_PROC -- "Cart Empty" --> VIEW_MENU
    AUTH_PROC -- "Auth Failed" --> LOGIN
    PAYMENT -- "Payment Failed" --> PLACE_ORDER
    PAYMENT -- "Success" --> TRACK
    NOTIFY --> END

    %% Styling
    classDef process fill:#f9f,stroke:#333,stroke-width:2px
    classDef action fill:#bbf,stroke:#333,stroke-width:2px
    class AUTH_PROC,MENU_LOAD,CART_PROC,ORDER_PROC,PAYMENT,NOTIFY process
    class BROWSE,LOGIN,VIEW_MENU,ADD_CART,PLACE_ORDER,TRACK,REST_LOGIN,ORDER_MANAGE,UPDATE_STATUS action
```

### 1.4.4. Key Use Cases and Scenarios

1. **User Registration and Login**

    - Users can create an account using their phonenumber.
    - Users can log in to their account to access personalized features.

2. **Browsing Restaurant Listings**

    - Users can browse a list of available restaurants based on their location.
    - Users can view restaurant details, including menus, reviews, and ratings.

3. **Placing an Order**

    - Users can select items from a restaurant's menu and add them to their cart.
    - Users can customize their order with special instructions or preferences.
    - Users can choose between delivery, pickup, or dine-in options.

4. **Order Tracking**

    - Users can track the status of their order in real-time.
    - Users receive notifications about order updates, including preparation, delivery, and completion.

5. **Payment Processing**

    - Users can pay for their order using various payment methods, including credit/debit cards, digital wallets, and UPI.
    - Users receive a confirmation of their payment and order details.

6. **User Reviews and Ratings**

    - Users can leave reviews and ratings for restaurants they have ordered from.
    - Users can read reviews and ratings from other customers to make informed decisions.

7. **Customer Support**

    - Users can contact customer support for assistance with their orders.
    - Users can report issues or provide feedback about their experience.

8. **Promotions and Discounts**

    - Users can apply promotional codes or discounts to their orders.
    - Users receive notifications about special offers and promotions.

9. **Account Management**
    - Users can update their account information, including contact details and payment methods.
    - Users can manage their notification preferences and privacy settings.

## 1.5. Technical Architecture

### 1.5.1. Technology Stack Overview

The website is built using the following technologies:

- Frontend: Angular - angular is a platform and framework for building single-page client applications using HTML and TypeScript. Angular is written in TypeScript. It implements core and optional functionality as a set of TypeScript libraries that you import into your apps.
- Backend: Node.js - Node.js is an open-source, cross-platform, back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser.
- Database: MongoDB - MongoDB is a general-purpose, document-based, distributed database built for modern application developers and for the cloud era.
- Hosting: firebase.com - Firebase is a platform developed by Google for creating mobile and web applications. It was originally an independent company founded in 2011. In 2014, Google acquired the platform and it is now their flagship offering for app development.
- Payment Gateway: razorpay - Razorpay is a payment gateway that allows businesses to accept, process, and disburse payments with its product suite.
- Messaging Service: whatsapp - WhatsApp is a messaging service that allows users to send text messages, voice messages, images, and videos over the internet.
- Other Tools: Git, Postman, VS Code - Git is a distributed version control system for tracking changes in source code during software development. Postman is a collaboration platform for API development that allows users to design, mock, document, monitor, and test APIs. VS Code is a source-code editor developed by Microsoft for Windows, Linux, and macOS.

### 1.5.2. High-Level Architecture Diagram

### 1.5.3. Deployment and Hosting Details

The website is deployed on firebase.com and hosted on Google Cloud Platform. The deployment process involves building the Angular frontend and deploying it to firebase hosting. The backend is deployed as a Node.js application on firebase functions. The database is hosted on MongoDB Atlas.

### 1.5.4. Environment Setup

<!-- 1. create a firebase project
2. enable firestore and storage
3. create a web app
4. copy the firebase config and paste it in the environment.ts file
5. run `npm run dev` to run the project in development mode
6. run `firebase use staging` to use the staging environment
7. run `firebase deploy` to deploy the project -->

1. Go to `https://firebase.google.com/` and click on `Go to console`.
   ![firebase homepage](https://i.imgur.com/Qn5lZ2k.png "firebase")
2. Click on `Get started with a Firebase project`.
   ![firebase console](https://i.imgur.com/Y9YFFJZ.png "firebase console")
3. Enter the project name and click on `Continue`.
   ![project name](https://i.imgur.com/p8wzeI3.png "project name")
4. Click on `Create project`.
   ![create project](https://i.imgur.com/QEzwl6P.png "create project")
5. Click on `Continue`.
   ![continue](https://i.imgur.com/BhSP494.png "continue")
6. Click on "hosting".
   ![hosting](https://i.imgur.com/G4rjM8y.png "hosting")
7. Click on `Get started`.
   ![get started](https://i.imgur.com/uUtGiuC.png "get started")
8. Install firebase tools using `npm install -g firebase-tools`.
   ![install firebase](https://i.imgur.com/Ix7bYy2.png "install firebase")
9. Login to firebase using `firebase login`.
   ![login](https://i.imgur.com/E0jXBGn.png "login")
10. Initialize firebase using `firebase init`.
    ![init](https://i.imgur.com/E0jXBGn.png "init")
11. Deploy to Firebase Hosting using `firebase deploy`.
    ![deploy](https://i.imgur.com/Fe3OCQ1.png "deploy")

## 1.6. Beginner’s Guide to Programming

### 1.6.1. Introduction to Web Development Basics

Web development is the process of building websites and web applications using a combination of HTML, CSS, and JavaScript. HTML is used to create the structure of a web page, CSS is used to style the page, and JavaScript is used to add interactivity and dynamic behavior to the page. Web development also involves working with backend technologies like Node.js and databases like MongoDB to create full-stack applications.

### 1.6.2. Overview of Tools and Software to Install

1. Node.js - Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. You can download Node.js from the official website and install it on your machine.
2. Angular CLI - The Angular CLI is a command-line interface tool that you use to initialize, develop, scaffold, and maintain Angular applications directly from a command shell.
3. MongoDB - MongoDB is a general-purpose, document-based, distributed database built for modern application developers and for the cloud era. You can download MongoDB from the official website and install it on your machine.
4. Git - Git is a distributed version control system for tracking changes in source code during software development. You can download Git from the official website and install it on your machine.
5. Postman - Postman is a collaboration platform for API development that allows users to design, mock, document, monitor, and test APIs. You can download Postman from the official website and install it on your machine.
6. VS Code - Visual Studio Code is a source-code editor developed by Microsoft for Windows, Linux, and macOS. You can download VS Code from the official website and install it on your machine.
7. Firebase CLI - The Firebase Command Line Interface (CLI) provides a variety of tools for managing, viewing, and deploying to Firebase projects. You can install the Firebase CLI using npm.
8. Angular Material - Angular Material is a UI component library for Angular that provides a set of high-quality UI components built with Angular and TypeScript. You can install Angular Material using npm.
9. Razorpay - Razorpay is a payment gateway that allows businesses to accept, process, and disburse payments with its product suite. You can sign up for a Razorpay account and get API keys to integrate with your application.
10. WhatsApp Business API - The WhatsApp Business API allows businesses to communicate with customers over WhatsApp. You can sign up for a WhatsApp Business API account and get API credentials to send messages.

### 1.6.3. Step-by-Step Guide to Setting Up the Project Locally

<!-- 1. Clone the repository from GitHub using the `git clone https://github.com/Harsh98992/digitalMenu.git` command.
2. Install Node.js from the official website.
3. Install Angular CLI using the `npm install -g @angular/cli` command.
4. Install MongoDB from the official website.
5. Install Git from the official website.
6. Install Postman from the official website. -->

1. open command prompt by pressing `windows + r` and typing `cmd` and press enter.
   ![cmd](https://i.imgur.com/rKqtXCL.png "cmd")
   ![cmd](https://i.imgur.com/QnGDNtv.png "cmd")
2. Clone the repository from GitHub using the `git clone https://github.com/Harsh98992/digitalMenu.git` command.
   ![clone](https://i.imgur.com/sYp8FzW.png "clone")
3. Install Node.js from the official website `https://nodejs.org/en/`.
   ![node](https://i.imgur.com/IOYDAbX.png "node")
4. Install Angular CLI using the `npm install -g @angular/cli` command.
5. Install MongoDB from the official website `https://www.mongodb.com/try/download/community`.
6. Install Git from the official website `https://git-scm.com/`.
7. Install Postman from the official website `https://www.postman.com/`.
8. Install VS Code from the official website `https://code.visualstudio.com/`.
9. Install Firebase CLI using the `npm install -g firebase-tools` command.

### 1.6.4. Suggested Learning Path

If you are new to web development, here is a suggested learning path to get started:

1. **HTML, CSS, and JavaScript Basics**

    - Learn the fundamentals of HTML from the `https://www.w3schools.com/html/` website.
    - Learn the basics of CSS from the `https://www.w3schools.com/css/` website.
    - Learn JavaScript basics from the `https://www.w3schools.com/js/` website.
    - Practice building simple web pages using HTML, CSS, and JavaScript.

2. **Angular Basics**

    - Learn the basics of Angular from the `https://angular.io/docs` website.
    - Build a simple Angular application using components, services, and modules.
    - Learn how to use Angular CLI to scaffold and generate code.

3. **Node.js Basics**

    - Dive into Node.js basics from the [Node.js documentation](https://nodejs.org/en/docs/).
    - Build a simple backend application using Express.js.
    - Explore how to handle routing, middleware, and RESTful API endpoints.

4. **MongoDB Basics**

    - Learn MongoDB basics from the [MongoDB documentation](https://docs.mongodb.com/).
    - Set up a MongoDB database and connect it with your Node.js backend application.
    - Practice performing CRUD operations (Create, Read, Update, Delete).

5. **Deployment to Firebase Hosting**

    - Learn how to deploy your application using [Firebase Hosting](https://firebase.google.com/docs/hosting).
    - Set up Firebase CLI and configure your project for deployment.

6. **Payment Gateway Integration**

    - Integrate a payment gateway like Razorpay. Check out the [Razorpay Documentation](https://razorpay.com/docs/).
    - Implement the necessary steps to handle transactions and payments in your application.

7. **Messaging Service Integration**

    - Learn how to integrate a messaging service like WhatsApp using the [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp).
    - Set up the API and configure messaging functionalities.

8. **Testing and Debugging**
    - Learn how to test and debug your application using tools like [Jest](https://jestjs.io/) for unit testing and [Postman](https://www.postman.com/) for API testing.
    - Implement end-to-end testing to ensure the stability of your application.

### 1.6.5. Debugging Basics

Debugging is the process of finding and fixing errors in your code. Here are some basic debugging techniques:

1. Use console.log() statements to print values and debug information.
   ![console](https://i.imgur.com/U3maQ4C.png "console")
2. Use the browser developer tools to inspect elements, view console logs, and debug JavaScript code.
   ![devtools](https://i.imgur.com/vsMZqpc.png "devtools")
3. Use breakpoints in your code to pause execution and inspect variables.
4. Use the Angular CLI to run the project in development mode and view error messages in the console.
5. Use the Postman tool to test APIs and view response data.
6. Use the VS Code debugger to step through your code and inspect variables.
7. Use the Firebase CLI to view logs and debug cloud functions.

## 1.7. Codebase Structure and Flow

### 1.7.1. Overview of the Codebase

The codebase is organized into the following directories:

- `src` - Contains the source code for the Angular frontend application.
- `src/app` - Contains the Angular components, services, and modules.
- `src/assets` - Contains static assets like images, fonts, and stylesheets.
- `src/api` - Contains API endpoints and services for interacting with the backend.

### 1.7.2. Code Execution Flow

```mermaid
graph TD
    A[main.ts] -->|Bootstrap| B[AppModule]
    B -->|Initializes| C[AppComponent]

    C -->|Core Services| D[Service Initialization]
    D -->|Auth Service| E[AuthenticationService]
    D -->|Customer Service| F[CustomerAuthService]
    D -->|Order Service| G[OrderService]

    C -->|Router| H[AppRoutingModule]

    H -->|Feature Modules| I[Restaurant Module]
    H -->|Feature Modules| J[Landing Module]
    H -->|Feature Modules| K[User Auth Module]

    I -->|Components| L[Layout Component]
    L -->|Child Routes| M[Homepage Component]
    M -->|Navigation| N[Restaurant Menu Component]

    subgraph Restaurant Flow
        L
        M
        N
    end

    subgraph Core Services
        E
        F
        G
    end
```

### 1.7.3. Understanding Functions and Modules

### 1.7.4. Step-by-Step Explanation of a Key Feature

### 1.7.5. Reading the Code

### 1.7.6. Code Standards and Best Practices

Adhering to code standards and best practices is crucial for maintaining a high-quality codebase. Below are some guidelines to follow:

1. **Consistent Naming Conventions**:

    - Use camelCase for variables and functions.
    - Use PascalCase for classes and components.
    - Use UPPER_SNAKE_CASE for constants.

2. **Code Formatting**:

    - Use a eslint to enforce consistent code formatting.
    - ![eslint](https://i.imgur.com/FV6lhCl.png "eslint")
    - Indent code blocks with 2 spaces.
    - Limit lines to 80 characters.

3. **Commenting and Documentation**:

    - Write clear and concise comments for complex logic.
    - Use JSDoc or similar tools for documenting functions and classes.
    - Update documentation regularly to reflect code changes.

4. **Error Handling**:

    - Use try-catch blocks to handle exceptions.
    - Log errors for debugging purposes.
    - Provide meaningful error messages to users.

5. **Code Reviews**:

    - Conduct regular code reviews to ensure code quality.
    - Provide constructive feedback during code reviews.
    - Address code review comments promptly.

6. **Testing**:

    - Write unit tests for all functions and components.
    - Use test-driven development (TDD) where applicable.
    - Ensure tests cover edge cases and potential failure points.

7. **Version Control**:

    - Use meaningful commit messages.
    - Commit code frequently with small, incremental changes.
    - Use branches for new features and bug fixes.

8. **Performance Optimization**:

    - Optimize code for performance where necessary.
    - Avoid premature optimization; focus on readability and maintainability first.
    - Profile and benchmark code to identify performance bottlenecks.

9. **Security**:

    - Follow best practices for securing code and data.
    - Validate and sanitize user inputs.
    - Use secure coding practices to prevent vulnerabilities.

10. **Continuous Integration and Deployment (CI/CD)**:
    - Use CI/CD pipelines to automate testing and deployment.
    - Ensure that the build process is reliable and repeatable.
    - Monitor deployments and rollback if issues are detected.

## 1.8. API Documentation

### 1.8.1. Overview of API Usage and Purpose

The digital menu system's API infrastructure serves as the backbone of communication between the frontend application and backend services. Our APIs are built using RESTful principles and are primarily used for:

1. **Menu Management**

    - Retrieving restaurant menus and item details
    - Managing menu items, categories, and pricing
    - Handling menu availability and special offers

2. **Order Processing**

    - Creating and managing customer orders
    - Tracking order status and updates
    - Managing delivery/pickup preferences

3. **User Management**

    - Customer authentication and authorization
    - Profile management and preferences
    - Order history and favorites

4. **Restaurant Operations**
    - Staff authentication and role-based access
    - Order queue management
    - Real-time kitchen notifications

All APIs use JSON for data exchange and require proper authentication using JWT tokens. The base URL for all API endpoints is `/api/v1`, and requests are secured using HTTPS protocol.

### 1.8.2. API Endpoint List

<!-- import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
@Injectable({
    providedIn: "root",
})
export class AdminPanelService {
    apiUrl = environment.apiUrl;
    EXCEL_TYPE =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    EXCEL_EXTENSION = ".xlsx";
    constructor(private http: HttpClient) {}
    getRestaurantsByStatus(restaurantVerified) {
        return this.http.get(
            `${this.apiUrl}/v1/admin/getRestaurantsByStatus/${restaurantVerified}`
        );
    }
    getRestaurantPayment() {
        return this.http.get(
            `${this.apiUrl}/v1/payment/getAccountPaymentDetails`
        );
    }
    getAccountTransferDetails(orderId) {
        return this.http.get(
            `${this.apiUrl}/v1/payment/getAccountTransferDetails/${orderId}`
        );
    }
    getAdminRestaurantData(id: string) {
        return this.http.get(
            `${this.apiUrl}/v1/admin/getRestaurantDetail/${id}`
        );
    }
    changeRestaurantStatus(id: string, data: any) {
        return this.http.patch(
            `${this.apiUrl}/v1/admin/changeRestaurantStatus/${id}`,
            data
        );
    }

    editRestaurant(id: string, data: any) {
        return this.http.patch(
            `${this.apiUrl}/v1/admin/editRestaurant/${id}`,
            data
        );
    }

    viewAllUsersOfRestaurant(id: string) {
        return this.http.get(
            `${this.apiUrl}/v1/admin/viewAllUsersOfRestaurant/${id}`
        );
    }

    sendEmailToRestaurant(data: any) {
        return this.http.post(
            `${this.apiUrl}/v1/admin/sendEmailToRestaurant`,
            data
        );
    }
    public exportJsonToExcel(jsonData: any[], fileName: string): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
        const workbook: XLSX.WorkBook = {
            Sheets: { data: worksheet },
            SheetNames: ["data"],
        };
        const excelBuffer: any = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });
        this.saveAsExcelFile(excelBuffer, fileName);
    }
    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: this.EXCEL_TYPE });
        saveAs(
            data,
            fileName + "_export_" + new Date().getTime() + this.EXCEL_EXTENSION
        );
    }
} -->

#### 1.8.2.1. Admin Panel endpoints

##### 1.8.2.1.1. Get Restaurants by Status

- **Endpoint**: `/api/v1/admin/getRestaurantsByStatus/:restaurantVerified`
- **Method**: GET
- **Description**: Retrieves a list of restaurants based on their verification status.
- **Parameters**:

  - `restaurantVerified` (boolean): Indicates whether the restaurant is verified or not.
  - Example: `/api/v1/admin/getRestaurantsByStatus/true`
  - Example Response:

```json
{
    "restaurants": [
        {
            "id": "123",
            "name": "Restaurant A",
            "verified": true
        },
        {
            "id": "456",
            "name": "Restaurant B",
            "verified": true
        }
    ]
}
```

- **Response**: Returns an array of restaurant objects with their details.
- **Authorization**: Admin role required.
- **Error Handling**: Returns an error message if the request fails.
- **Sample Code**:

    ```typescript
    getRestaurantsByStatus(restaurantVerified: boolean) {
        return this.http.get(
            `${this.apiUrl}/v1/admin/getRestaurantsByStatus/${restaurantVerified}`
        );
    }
    ```

##### 1.8.2.1.2. Get Restaurant Payment Details

- **Endpoint**: `/api/v1/payment/getAccountPaymentDetails`
- **Method**: GET
- **Description**: Fetches payment details for all restaurant accounts.
- **Parameters**: None.
- **Example Response**:

    ```json
    {
        "payments": [
            {
                "restaurantId": "123",
                "restaurantName": "Restaurant A",
                "totalEarnings": 15000,
                "pendingAmount": 5000,
                "lastPaymentDate": "2025-01-10"
            },
            {
                "restaurantId": "456",
                "restaurantName": "Restaurant B",
                "totalEarnings": 20000,
                "pendingAmount": 3000,
                "lastPaymentDate": "2025-01-12"
            }
        ]
    }
    ```

- **Response**: Returns an array of objects containing payment information for each restaurant.
- **Authorization**: Admin role required.
- **Error Handling**: Returns an error message if the request fails.
- **Sample Code**:

    ```typescript
    getRestaurantPayment() {
        return this.http.get(
            `${this.apiUrl}/v1/payment/getAccountPaymentDetails`
        );
    }
    ```

##### 1.8.2.1.3. Get Account Transfer Details

- **Endpoint**: `/api/v1/payment/getAccountTransferDetails/:orderId`
- **Method**: GET
- **Description**: Retrieves transfer details for a specific order.
- **Parameters**:
  - `orderId` (string): The unique identifier for the order.
- **Example**: `/api/v1/payment/getAccountTransferDetails/ORD12345`
- **Example Response**:

    ```json
    {
        "orderId": "ORD12345",
        "restaurantId": "123",
        "transferAmount": 2000,
        "transferDate": "2025-01-15",
        "status": "Completed"
    }
    ```

- **Response**: Returns an object with the details of the account transfer related to the order.
- **Authorization**: Admin role required.
- **Error Handling**: Returns an error message if the order ID is invalid or the request fails.
- **Sample Code**:

    ```typescript
    getAccountTransferDetails(orderId: string) {
        return this.http.get(
            `${this.apiUrl}/v1/payment/getAccountTransferDetails/${orderId}`
        );
    }
    ```

##### 1.8.2.1.4. Get Admin Restaurant Data

- **Endpoint**: `/api/v1/admin/getRestaurantDetail/:id`
- **Method**: GET
- **Description**: Fetches detailed information about a specific restaurant.
- **Parameters**:
  - `id` (string): The unique identifier for the restaurant.
- **Example**: `/api/v1/admin/getRestaurantDetail/123`
- **Example Response**:

    ```json
    {
        "id": "123",
        "name": "Restaurant A",
        "verified": true,
        "owner": "John Doe",
        "contact": "123-456-7890",
        "address": "123 Main St, City, State",
        "cuisine": ["Italian", "Mexican"],
        "ratings": 4.5
    }
    ```

- **Response**: Returns detailed information about the restaurant, including owner details, address, and ratings.
- **Authorization**: Admin role required.
- **Error Handling**: Returns an error message if the restaurant ID is invalid or the request fails.
- **Sample Code**:

    ```typescript
    getAdminRestaurantData(id: string) {
        return this.http.get(
            `${this.apiUrl}/v1/admin/getRestaurantDetail/${id}`
        );
    }
    ```

##### 1.8.2.1.5. Change Restaurant Status

- **Endpoint**: `/api/v1/admin/changeRestaurantStatus/:id`
- **Method**: PATCH
- **Description**: Updates the verification status of a restaurant.
- **Parameters**:

  - `id` (string): The unique identifier for the restaurant.
  - Request Body:

```json
{
    "verified": true
}
```

- **Example**: `/api/v1/admin/changeRestaurantStatus/123`
- **Example Response**:

    ```json
    {
        "message": "Restaurant status updated successfully."
    }
    ```

- **Response**: Returns a success message upon updating the restaurant's status.
- **Authorization**: Admin role required.
- **Error Handling**: Returns an error message if the restaurant ID is invalid or the request fails.
- **Sample Code**:

    ```typescript
    changeRestaurantStatus(id: string, data: any) {
        return this.http.patch(
            `${this.apiUrl}/v1/admin/changeRestaurantStatus/${id}`,
            data
        );
    }
    ```

##### 1.8.2.1.6. Edit Restaurant Details

- **Endpoint**: `/api/v1/admin/editRestaurant/:id`
- **Method**: PATCH
- **Description**: Updates the details of a restaurant.
- **Parameters**:

  - `id` (string): The unique identifier for the restaurant.
  - Request Body:

```json
{
    "name": "New Restaurant Name",
    "contact": "987-654-3210",
    "address": "456 Main St, City, State",
    "cuisine": ["Indian", "Chinese"]
}
```

- **Example**: `/api/v1/admin/editRestaurant/123`
- **Example Response**:

    ```json
    {
        "message": "Restaurant details updated successfully."
    }
    ```

- **Response**: Returns a success message upon updating the restaurant's details.
- **Authorization**: Admin role required.
- **Error Handling**: Returns an error message if the restaurant ID is invalid or the request fails.
- **Sample Code**:

    ```typescript
    editRestaurant(id: string, data: any) {
        return this.http.patch(
            `${this.apiUrl}/v1/admin/editRestaurant/${id}`,
            data
        );
    }
    ```

##### 1.8.2.1.7. View All Users of a Restaurant

- **Endpoint**: `/api/v1/admin/viewAllUsersOfRestaurant/:id`
- **Method**: GET
- **Description**: Retrieves a list of all users associated with a specific restaurant.
- **Parameters**:

  - `id` (string): The unique identifier for the restaurant.
  - Example: `/api/v1/admin/viewAllUsersOfRestaurant/123`
  - Example Response:

```json
{
    "users": [
        {
            "id": "456",
            "name": "User A",
            "email": "abc#example.com",
            "role": "Customer"
        },
        {
            "id": "789",
            "name": "User B",
            "email": "xyz#example.com",
            "role": "Staff"
        }
    ]
}
```

- **Response**: Returns an array of user objects with their details.
- **Authorization**: Admin role required.
- **Error Handling**: Returns an error message if the restaurant ID is invalid or the request fails.
- **Sample Code**:

    ```typescript
    viewAllUsersOfRestaurant(id: string) {
        return this.http.get(
            `${this.apiUrl}/v1/admin/viewAllUsersOfRestaurant/${id}`
        );
    }
    ```

##### 1.8.2.1.8. Send Email to Restaurant

- **Endpoint**: `/api/v1/admin/sendEmailToRestaurant`
- **Method**: POST
- **Description**: Sends an email notification to a restaurant.
- **Request Body**:

    ```json
    {
        "restaurantId": "123",
        "subject": "Order Notification",
        "message": "You have a new order pending."
    }
    ```

- **Response**: Returns a success message upon sending the email.
- **Authorization**: Admin role required.
- **Error Handling**: Returns an error message if the request fails.
- **Sample Code**:

    ```typescript
    sendEmailToRestaurant(data: any) {
        return this.http.post(
            `${this.apiUrl}/v1/admin/sendEmailToRestaurant`,
            data
        );
    }
    ```

##### 1.8.2.1.9. Export JSON to Excel

- **Description**: Converts JSON data to an Excel file and downloads it.
- **Parameters**:

  - `jsonData` (array): The JSON data to export.
  - `fileName` (string): The name of the Excel file.
  - **Sample Code**:

```typescript
        exportJsonToExcel(jsonData: any[], fileName: string): void {
            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
            const workbook: XLSX.WorkBook = {
                Sheets: { data: worksheet },
                SheetNames: ["data"],
            };
            const excelBuffer: any = XLSX.write(workbook, {
                bookType: "xlsx",
                type: "array",
            });
            this.saveAsExcelFile(excelBuffer, fileName);
        }

        private saveAsExcelFile(buffer: any, fileName: string): void {
            const data: Blob = new Blob([buffer], { type: this.EXCEL_TYPE });
            saveAs(
                data,
                fileName + "_export_" + new Date().getTime() + this.EXCEL_EXTENSION
            );
        }
```

#### 1.8.2.2. Authentication Endpoints

##### 1.8.2.2.1. changePassword

- **Endpoint**: `/api/v1/user/updatePassword`
- **Method**: PATCH
- **Description**: Updates the user's password.
- **Parameters**:

  - Request Body:

```json
{
    "oldPassword": "password123",
    "newPassword": "newpassword123"
}
```

- **Response**: Returns a success message upon updating the password.
- **Authorization**: User authentication required.
- **Error Handling**: Returns an error message if the request fails.
- **Sample Code**:

    ```typescript
    changePassword(requestData) {
        return this.http.patch(
            `${this.apiUrl}/v1/user/updatePassword`,
            requestData
        );
    }
    ```

##### 1.8.2.2.2. resetPassword

- **Endpoint**: `/api/v1/user/resetPassword/:token`
- **Method**: PATCH
- **Description**: Resets the user's password using a valid reset token.
- **Parameters**:
  - `token` (string): A unique token sent to the user's email for password reset.
  - Request Body:

```json
{
    "password": "newpassword123"
}
```

- **Response**: Returns a success message upon successfully resetting the password.
- **Authorization**: No authentication required; token-based validation.
- **Error Handling**: Returns an error if the token is invalid, expired, or the request fails.
- **Sample Code**:

    ```typescript
    resetPassword(password: string, token: string) {
        return this.http.patch(
            `${this.apiUrl}/v1/user/resetPassword/${token}`,
            { password }
        );
    }
    ```

##### 1.8.2.2.3. register

- **Endpoint**: `/api/v1/user/signup`
- **Method**: POST
- **Description**: Registers a new user with the provided details.
- **Parameters**:
  - Request Body:

```json
{
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "password123",
    "confirmPassword": "password123"
}
```

- **Response**: Returns a success message and user details upon successful registration.
- **Authorization**: No authentication required.
- **Error Handling**: Returns an error if the email is already registered or the request fails.
- **Sample Code**:

    ```typescript
    register(userData) {
        return this.http.post(`${this.apiUrl}/v1/user/signup`, userData);
    }
    ```

##### 1.8.2.2.4. login

- **Endpoint**: `/api/v1/user/login`
- **Method**: POST
- **Description**: Logs in a user using their email and password.
- **Parameters**:
  - Request Body:

```json
{
    "email": "johndoe@example.com",
    "password": "password123"
}
```

- **Response**: Returns a success message, user details, and an authentication token upon successful login.
- **Authorization**: No authentication required.
- **Error Handling**: Returns an error if the credentials are invalid or the request fails.
- **Sample Code**:

    ```typescript
    login(userData: { email: string; password: string }) {
        this.customerAuth.removeToken();
        return this.http.post(`${this.apiUrl}/v1/user/login`, userData);
    }
    ```

##### 1.8.2.2.5. forgotPassword

- **Endpoint**: `/api/v1/user/forgotPassword`
- **Method**: POST
- **Description**: Sends a password reset link to the user's email address.
- **Parameters**:
  - Request Body:

```json
{
    "email": "johndoe@example.com"
}
```

- **Response**: Returns a success message confirming that the reset link has been sent.
- **Authorization**: No authentication required.
- **Error Handling**: Returns an error if the email is not registered or the request fails.
- **Sample Code**:

    ```typescript
    forgotPassword(email: string) {
        return this.http.post(`${this.apiUrl}/v1/user/forgotPassword`, { email });
    }
    ```

##### 1.8.2.2.6. sendEmailVerificationOtp

- **Endpoint**: `/api/v1/user/emailVerification`
- **Method**: POST
- **Description**: Sends an OTP to the user's email for email verification.
- **Parameters**:
  - Request Body:

```json
{
    "email": "johndoe@example.com"
}
```

- **Response**: Returns a success message confirming that the OTP has been sent.
- **Authorization**: No authentication required.
- **Error Handling**: Returns an error if the email is invalid or the request fails.
- **Sample Code**:

    ```typescript
    sendEmailVerificationOtp(email: string) {
        const data = { email };
        return this.http.post(`${this.apiUrl}/v1/user/emailVerification`, data);
    }
    ```

##### 1.8.2.2.7. verifyEmailOtp

- **Endpoint**: `/api/v1/user/verifyEmailOtp`
- **Method**: PUT
- **Description**: Verifies the OTP sent to the user's email.
- **Parameters**:
  - Request Body:

```json
{
    "otp": "123456",
    "email": "johndoe@example.com"
}
```

- **Response**: Returns a success message upon successful verification of the email.
- **Authorization**: No authentication required.
- **Error Handling**: Returns an error if the OTP is invalid or expired.
- **Sample Code**:

    ```typescript
    verifyEmailOtp(otp: string, email: string) {
        return this.http.put(`${this.apiUrl}/v1/user/verifyEmailOtp`, {
            otp,
            email,
        });
    }
    ```

##### 1.8.2.2.8. Utility Methods

- **setUserToken**: Saves the user's authentication token to `sessionStorage`.

    ```typescript
    setUserToken(token: string) {
        sessionStorage.clear();
        const driver = this.utilService.getPrinterDriver();
        localStorage.clear();
        if (driver) {
            localStorage.setItem("printerDriver", JSON.stringify(driver));
        }
        sessionStorage.setItem("authToken", token);
    }
    ```

- **getUserToken**: Retrieves the user's authentication token from `sessionStorage`.

    ```typescript
    getUserToken() {
        return sessionStorage.getItem("authToken");
    }
    ```

- **removeToken**: Clears authentication token and resets session/local storage.

    ```typescript
    removeToken() {
        sessionStorage.clear();
        const driver = this.utilService.getPrinterDriver();
        localStorage.clear();
        if (driver) {
            localStorage.setItem("printerDriver", JSON.stringify(driver));
        }
    }
    ```

#### 1.8.2.3. Customer Details Endpoints

##### 1.8.2.3.1. Store Customer Details

- **Description**: Stores the customer's name and phone number in local storage.
- **Parameters**:

  - `name` (string): The customer's name.
  - `phoneNumber` (string): The customer's phone number.
  - **Sample Code**:

  - ```typescript
        storeCustomerDetails(name: string, phoneNumber: string): void {
            localStorage.setItem('customerName', name);
            localStorage.setItem('customerPhoneNumber', phoneNumber);
        }
        ```

- **Usage**:

    ```typescript
    customerDetailsService.storeCustomerDetails("John Doe", "123-456-7890");
    ```

##### 1.8.2.3.2. Get Customer Details

- **Description**: Retrieves the customer's name and phone number from local storage.
- **Parameters**: None.
- **Response**: Returns an object with the customer's name and phone number.
- **Sample Code**:

    ```typescript
    getCustomerDetails(): { name: string, phoneNumber: string } {
        const name = localStorage.getItem('customerName');
        const phoneNumber = localStorage.getItem('customerPhoneNumber');
        return { name: name, phoneNumber: phoneNumber };
    }
    ```

- **Usage**:

    ```typescript
    const customerDetails = customerDetailsService.getCustomerDetails();
    console.log(customerDetails);
    ```

#### 1.8.2.4. Customer Service Endpoints

#### 1.8.2.5. Get Customer

- **Endpoint**: `/api/v1/customer/getCustomer`
- **Method**: GET
- **Description**: Retrieves the details of the currently logged-in customer.
- **Parameters**: None.
- **Response**: Returns an object with the customer's details.
- **Authorization**: Customer authentication required.
- **Error Handling**: Returns an error message if the request fails.
- **Sample Code**:

    ```typescript
    getCustomer() {
        return this.http.get(`${this.apiUrl}/v1/customer/getCustomer`);
    }
    ```

- **Usage**:

    ```typescript
    customerService.getCustomer().subscribe((data) => {
        console.log(data);
    });
    ```

##### 1.8.2.5.1. Add Customer Address

- **Endpoint**: `/api/v1/customer/addCustomerAddress`
- **Method**: PATCH
- **Description**: Adds a new address for the currently logged-in customer.
- **Parameters**:

  - `data`: An object containing the customer's address information.

    - Example structure:

```json
{
    "addressLine1": "123 Main St",
    "addressLine2": "Apt 4B",
    "city": "Metropolis",
    "state": "NY",
    "postalCode": "12345",
    "country": "USA"
}
```

- **Response**: Returns a confirmation message if the address is added successfully.
- **Authorization**: Customer authentication required.
- **Error Handling**: Returns an error message if the address cannot be added (e.g., invalid data or server error).
- **Sample Code**:

    ```typescript
    addCustomerAddress(data) {
        return this.http.patch(`${this.apiUrl}/v1/customer/addCustomerAddress`, data);
    }
    ```

- **Usage**:

    ```typescript
    const addressData = {
        addressLine1: "123 Main St",
        addressLine2: "Apt 4B",
        city: "Metropolis",
        state: "NY",
        postalCode: "12345",
        country: "USA",
    };

    customerService.addCustomerAddress(addressData).subscribe((response) => {
        console.log("Address added successfully:", response);
    });
    ```

##### 1.8.2.5.2. Edit Customer Address

- **Endpoint**: `/api/v1/customer/editCustomerAddress`
- **Method**: PATCH
- **Description**: Edits an existing address of the currently logged-in customer.
- **Parameters**:

  - `data`: An object containing the updated address information. It should include an address identifier (like `addressId`) and the updated address fields.
  - Example structure:

```json
{
    "addressId": "123",
    "addressLine1": "456 New St",
    "addressLine2": "Apt 7C",
    "city": "Gotham",
    "state": "NY",
    "postalCode": "67890",
    "country": "USA"
}
```

- **Response**: Returns a confirmation message if the address is successfully updated.
- **Authorization**: Customer authentication required.
- **Error Handling**: Returns an error message if the address update fails (e.g., invalid address ID, missing fields, or server error).
- **Sample Code**:

    ```typescript
    editCustomerAddress(data) {
        return this.http.patch(`${this.apiUrl}/v1/customer/editCustomerAddress`, data);
    }
    ```

- **Usage**:

    ```typescript
    const updatedAddress = {
        addressId: "123",
        addressLine1: "456 New St",
        addressLine2: "Apt 7C",
        city: "Gotham",
        state: "NY",
        postalCode: "67890",
        country: "USA",
    };

    customerService
        .editCustomerAddress(updatedAddress)
        .subscribe((response) => {
            console.log("Address updated successfully:", response);
        });
    ```

##### 1.8.2.5.3. Send Email

- **Endpoint**: `/api/v1/customer/contactUs`
- **Method**: POST
- **Description**: Sends an email message from the customer to the customer service team.
- **Parameters**:

  - `data`: An object containing the email's content (e.g., message, subject).

    - Example structure:

```json
{
    "subject": "Inquiry about Order #1234",
    "message": "I have a question regarding my recent order. Can you help?"
}
```

- **Response**: Returns a success message if the email is sent successfully.
- **Authorization**: Customer authentication required.
- **Error Handling**: Returns an error message if the email fails to send (e.g., server error).
- **Sample Code**:

    ```typescript
    sendEmail(data) {
        return this.http.post(`${this.apiUrl}/v1/customer/contactUs`, data);
    }
    ```

- **Usage**:

    ```typescript
    const emailData = {
        subject: "Inquiry about Order #1234",
        message: "I have a question regarding my recent order. Can you help?",
    };

    customerService.sendEmail(emailData).subscribe((response) => {
        console.log("Email sent successfully:", response);
    });
    ```

##### 1.8.2.5.4. Delete Address of Requesting Customer by ID

- **Endpoint**: `/api/v1/customer/deleteAddressOfRequestCustomerById/{id}`
- **Method**: DELETE
- **Description**: Deletes a specific address of the currently logged-in customer by its ID.
- **Parameters**:
  - `id`: The unique identifier of the address to be deleted.
- **Response**: Returns a confirmation message if the address is deleted successfully.
- **Authorization**: Customer authentication required.
- **Error Handling**: Returns an error message if the address cannot be deleted (e.g., invalid ID, address not found).
- **Sample Code**:

    ```typescript
    deleteAddressOfRequestCustomerById(id) {
        return this.http.delete(`${this.apiUrl}/v1/customer/deleteAddressOfRequestCustomerById/${id}`);
    }
    ```

- **Usage**:

    ```typescript
    const addressId = "123";
    customerService
        .deleteAddressOfRequestCustomerById(addressId)
        .subscribe((response) => {
            console.log("Address deleted successfully:", response);
        });
    ```

##### 1.8.2.5.5. Get Nearby Restaurants

- **Endpoint**: `/api/v1/customer/getNearbyRestaurants`
- **Method**: GET
- **Description**: Retrieves a list of restaurants near a specified latitude and longitude.
- **Parameters**:
  - `latitude`: The latitude of the customer's location.
  - `longitude`: The longitude of the customer's location.
- **Response**: Returns an array of restaurant details located near the specified location.
- **Authorization**: Customer authentication required.
- **Error Handling**: Returns an error message if no restaurants are found or if the request fails.
- **Sample Code**:

    ```typescript
    getNearbyRestaurants(latitude, longitude) {
        return this.http.get(`${this.apiUrl}/v1/customer/getNearbyRestaurants?latitude=${latitude}&longitude=${longitude}`);
    }
    ```

- **Usage**:

    ```typescript
    const latitude = 40.7128;
    const longitude = -74.006;

    customerService
        .getNearbyRestaurants(latitude, longitude)
        .subscribe((restaurants) => {
            console.log("Nearby restaurants:", restaurants);
        });
    ```

##### 1.8.2.5.6. Get All Restaurants

- **Endpoint**: `/api/v1/customer/getAllRestaurants`
- **Method**: GET
- **Description**: Retrieves a list of all available restaurants.
- **Parameters**: None.
- **Response**: Returns an array of restaurant details.
- **Authorization**: Customer authentication required.
- **Error Handling**: Returns an error message if the request fails.
- **Sample Code**:

    ```typescript
    getAllRestaurants() {
        return this.http.get(`${this.apiUrl}/v1/customer/getAllRestaurants`);
    }
    ```

- **Usage**:

    ```typescript
    customerService.getAllRestaurants().subscribe((restaurants) => {
        console.log("All restaurants:", restaurants);
    });
    ```

##### 1.8.2.5.7. Get Restaurant Details by URL

- **Endpoint**: `/api/v1/customer/getRestaurantDetailsFromRestaurantUrl/{restaurantUrl}`
- **Method**: GET
- **Description**: Retrieves the details of a specific restaurant using its URL.
- **Parameters**:
  - `restaurantUrl`: The unique URL of the restaurant.
- **Response**: Returns the details of the restaurant.
- **Authorization**: Customer authentication required.
- **Error Handling**: Returns an error message if the restaurant cannot be found.
- **Sample Code**:

    ```typescript
    getRestaurantDetailsFromRestaurantUrl(restaurantUrl) {
        return this.http.get(`${this.apiUrl}/v1/customer/getRestaurantDetailsFromRestaurantUrl/${restaurantUrl}`);
    }
    ```

- **Usage**:

    ```typescript
    const restaurantUrl = "some-restaurant-url";

    customerService
        .getRestaurantDetailsFromRestaurantUrl(restaurantUrl)
        .subscribe((details) => {
            console.log("Restaurant details:", details);
        });
    ```

##### 1.8.2.5.8. Get Restaurant Details by ID

- **Endpoint**: `/api/v1/customer/getRestaurantDetailsFromRestaurantId/{restaurantId}`
- **Method**: GET
- **Description**: Retrieves the details of a specific restaurant using its ID.
- **Parameters**:
  - `restaurantId`: The unique ID of the restaurant.
- **Response**: Returns the details of the restaurant.
- **Authorization**: Customer authentication required.
- **Error Handling**: Returns an error message if the restaurant cannot be found.
- **Sample Code**:

    ```typescript
    getRestaurantDetailsFromRestaurantId(restaurantId) {
        return this.http.get(`${this.apiUrl}/v1/customer/getRestaurantDetailsFromRestaurantId/${restaurantId}`);
    }
    ```

- **Usage**:

    ```typescript
    const restaurantId = "12345";

    customerService
        .getRestaurantDetailsFromRestaurantId(restaurantId)
        .subscribe((details) => {
            console.log("Restaurant details:", details);
        });
    ```

##### 1.8.2.5.9. Get Promo Codes for Restaurant by URL

- **Endpoint**: `/api/v1/customer/getPromoCodesForRestaurantUrl/{restaurantUrl}`
- **Method**: GET
- **Description**: Retrieves a list of active promo codes for a specific restaurant using its URL.
- **Parameters**:
  - `restaurantUrl`: The unique URL of the restaurant.
- **Response**: Returns an array of promo code details.
- **Authorization**: Customer authentication required.
- **Error Handling**: Returns an error message if no promo codes are available or if the request fails.
- **Sample Code**:

    ```typescript
    getPromoCodesForRestaurantUrl(restaurantUrl) {
        return this.http.get(`${this.apiUrl}/v1/customer/getPromoCodesForRestaurantUrl/${restaurantUrl}`);
    }
    ```

- **Usage**:

    ```typescript
    const restaurantUrl = "some-restaurant-url";

    customerService
        .getPromoCodesForRestaurantUrl(restaurantUrl)
        .subscribe((promoCodes) => {
            console.log("Promo codes:", promoCodes);
        });
    ```

##### 1.8.2.5.10. Check If Promo Code is Valid

- **Endpoint**: `/api/v1/customer/checkIfPromoCodeIsValid`
- **Method**: POST
- **Description**: Validates a promo code for a specific restaurant and order amount.
- **Parameters**:
  - `data`: An object containing the promo code, order amount, and restaurant URL.
    - Example structure:
            ```json
            {
                "promoCodeName": "SAVE20",
                "amountToBePaid": 100,
                "restaurantUrl": "some-restaurant-url"
            }
            ```
- **Response**: Returns a success message with promo code validity details or an error message if invalid.
- **Authorization**: Customer authentication required.
- **Error Handling**: Returns an error message if the promo code is invalid or the request fails.
- **Sample Code**:

    ```typescript
    checkIfPromoCodeIsValid(promoCodeName, amountToBePaid, restaurantUrl) {
        const data = { promoCodeName, amountToBePaid, restaurantUrl };
        return this.http.post(`${this.apiUrl}/v1/customer/checkIfPromoCodeIsValid`, data);
    }
    ```

- **Usage**:

    ```typescript
    const promoCodeData = {
        promoCodeName: "SAVE20",
        amountToBePaid: 100,
        restaurantUrl: "some-restaurant-url",
    };

    customerService
        .checkIfPromoCodeIsValid(
            promoCodeData.promoCodeName,
            promoCodeData.amountToBePaid,
            promoCodeData.restaurantUrl
        )
        .subscribe((response) => {
            console.log("Promo code validity:", response);
        });
    ```

##### 1.8.2.5.11. Update Customer Data

- **Endpoint**: `/api/v1/customer/updateCustomerData`
- **Method**: POST
- **Description**: Updates the personal information of the currently logged-in customer.
- **Parameters**:
  - `data`: An object containing the updated customer information.
    - Example structure:
            ```json
            {
                "name": "John Doe",
                "email": "john.doe@example.com",
                "phone": "1234567890"
            }
            ```
- **Response**: Returns a success message with the updated customer details.
- **Authorization**: Customer authentication required.
- **Error Handling**: Returns an error message if the update fails (e.g., invalid data or server error).
- **Sample Code**:

    ```typescript
    updateCustomerData(data) {
        return this.http.post(`${this.apiUrl}/v1/customer/updateCustomerData`, data);
    }
    ```

- **Usage**:

    ```typescript
    const customerData = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "1234567890",
    };

    customerService.updateCustomerData(customerData).subscribe((response) => {
        console.log("Customer data updated successfully:", response);
    });
    ```

##### 1.8.2.5.12. Check If Dine-In is Available

- **Endpoint**: `/api/v1/customer/isDineInAvailable/{restaurantId}`
- **Method**: GET
- **Description**: Checks if dine-in service is available at a specific restaurant.
- **Parameters**:
  - `restaurantId`: The unique ID of the restaurant.
- **Response**: Returns a boolean value indicating whether dine-in is available or not.
- **Authorization**: Customer authentication required.
- **Error Handling**: Returns an error message if the request fails (e.g., invalid restaurant ID or server error).
- **Sample Code**:

    ```typescript
    isDineInAvailable(restaurantId) {
        return this.http.get(`${this.apiUrl}/v1/customer/isDineInAvailable/${restaurantId}`);
    }
    ```

- **Usage**:

    ```typescript
    const restaurantId = "12345";

    customerService.isDineInAvailable(restaurantId).subscribe((isAvailable) => {
        console.log(`Dine-in availability: ${isAvailable}`);
    });
    ```

##### 1.8.2.5.13. Get Restaurant Status

- **Endpoint**: `/api/v1/customer/getRestaurantStatus/{restaurantId}`
- **Method**: GET
- **Description**: Retrieves the current status of a restaurant (e.g., open or closed).
- **Parameters**:
  - `restaurantId`: The unique ID of the restaurant.
- **Response**: Returns an object containing the restaurant's current status and other relevant information.
- **Authorization**: Customer authentication required.
- **Error Handling**: Returns an error message if the request fails (e.g., invalid restaurant ID or server error).
- **Sample Code**:

    ```typescript
    getRestaurantStatus(restaurantId) {
        return this.http.get(`${this.apiUrl}/v1/customer/getRestaurantStatus/${restaurantId}`);
    }
    ```

- **Usage**:

    ```typescript
    const restaurantId = "12345";

    customerService.getRestaurantStatus(restaurantId).subscribe((status) => {
        console.log("Restaurant status:", status);
    });

    ```

#### 1.8.2.6. Google Maps Service Endpoints

<!-- import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, catchError, map, of } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class GoogleMapsService {
    apiUrl = environment.apiUrl;

    constructor(private httpClient: HttpClient) {}

    // Function to call the Autocomplete API and get search suggestions
    getAutocompleteResults(query: string) {
        if (query) {
            const autocompleteUrl = `${this.apiUrl}/v1/google-maps/autocomplete?input=${query}`;
            return this.httpClient.get<any>(autocompleteUrl).pipe(
                map((response) => response.predictions),
                catchError(() => of([]))
            );
        } else {
            return of([]);
        }
    }

    getGeocodeDetails(latitude: number, longitude: number) {
        // const apiKey = "AIzaSyA565Z7yEHcoZ1TMV4Asu3TZQGn0W2Np_A";

        let url = `${this.apiUrl}/v1/google-maps//geocode-details?latitude=${latitude}&longitude=${longitude}`;

        return this.httpClient.get<any>(url).pipe(
            map((response) => {
                console.log("Geocoding API response:", response);
                // return whole response will be used in the component and other functions to get the pin code
                return response;
            }),
            catchError((error) => {
                console.error("Geocoding API error:", error);
                return of("");
            })
        );
    }

    getFormattedGeocodeDetails(latitude: number, longitude: number) {
        // const apiKey = "AIzaSyA565Z7yEHcoZ1TMV4Asu3TZQGn0W2Np_A";

        let url = `${this.apiUrl}/v1/google-maps//geocode-details?latitude=${latitude}&longitude=${longitude}`;

        return this.httpClient.get<any>(url).pipe(
            map((response) => {
                console.log("Geocoding API response:", response);
                // return whole response will be used in the component and other functions to get the pin code
                const addressComponents =
                    response.results[0].address_components;

                const postalCodeComponent = addressComponents.find(
                    (component) => component.types.includes("postal_code")
                );

                return {
                    pinCode: postalCodeComponent
                        ? postalCodeComponent.long_name
                        : "",
                    completeAddress: response.results[0].formatted_address,

                    // Optional - You can return more details if you want
                    // city: addressComponents.find((component) =>
                    city: addressComponents.find((component) =>
                        component.types.includes("locality")
                    )
                        ? addressComponents.find((component) =>
                              component.types.includes("locality")
                          ).long_name
                        : "",
                    state: addressComponents.find((component) =>
                        component.types.includes("administrative_area_level_1")
                    )
                        ? addressComponents.find((component) =>
                              component.types.includes(
                                  "administrative_area_level_1"
                              )
                          ).long_name
                        : "",
                    country: addressComponents.find((component) =>
                        component.types.includes("country")
                    )
                        ? addressComponents.find((component) =>
                              component.types.includes("country")
                          ).long_name
                        : "",
                };
            }),
            catchError((error) => {
                console.error("Geocoding API error:", error);
                return of("");
            })
        );
    }

    // Function to get the pin code using Geocoding API
    getPinCodeFromGeocode(
        latitude: number,
        longitude: number
    ): Observable<string> {
        return this.getGeocodeDetails(latitude, longitude).pipe(
            map((response) => {
                console.log("Geocoding API response:", response);

                if (
                    response &&
                    response.results &&
                    response.results.length > 0
                ) {
                    const addressComponents =
                        response.results[0].address_components;
                    const postalCodeComponent = addressComponents.find(
                        (component) =>
                            component.types.includes("postal_code") ||
                            component.types.includes("postal_code_prefix") // Optional - Use this if you want more specific postal codes
                    );
                    return postalCodeComponent
                        ? postalCodeComponent.long_name
                        : "";
                } else {
                    return "";
                }
            }),
            catchError((error) => {
                console.error("Geocoding API error:", error);
                return of("");
            })
        );
    }

    getPlaceDetails(placeId: string) {
        const placeDetailsUrl = `${this.apiUrl}/v1/google-maps/place-details?placeId=${placeId}`;
        return this.httpClient.get<any>(placeDetailsUrl).pipe(
            map((response) => response.result),
            catchError(() => of([]))
        );
    }
} -->

##### 1.8.2.6.1. Get Autocomplete Results

- **Endpoint**: `/api/v1/google-maps/autocomplete`
- **Method**: GET
- **Description**: Retrieves search suggestions based on the user's input.
- **Parameters**:
  - `input`: The user's search query.
  - **Response**: Returns an array of prediction objects.
  - **Authorization**: No authentication required.
  - **Error Handling**: Returns an empty array if no suggestions are found or if the request fails.
  - **Sample Code**:

    ```typescript
    getAutocompleteResults(query: string) {
        if (query) {
            const autocompleteUrl = `${this.apiUrl}/v1/google-maps/autocomplete?input=${query}`;
            return this.httpClient.get<any>(autocompleteUrl).pipe(
                map((response) => response.predictions),
                catchError(() => of([]))
            );
        } else {
            return of([]);
        }
    }
    ```

- **Usage**:

    ```typescript
    googleMapsService.getAutocompleteResults("New York").subscribe((results) => {
        console.log("Autocomplete results:", results);
    });
    ```

##### 1.8.2.6.2. Get Geocode Details

- **Endpoint**: `/api/v1/google-maps/geocode-details`
- **Method**: GET
- **Description**: Retrieves the geocode details (address components) for a specific latitude and longitude.
- **Parameters**:
  - `latitude`: The latitude of the location.
  - `longitude`: The longitude of the location.
- **Response**: Returns an object with the geocode details.
- **Authorization**: No authentication required.
- **Error Handling**: Returns an empty object if the details cannot be retrieved or if the request fails.
- **Sample Code**:

    ```typescript
    getGeocodeDetails(latitude: number, longitude: number) {
        let url = `${this.apiUrl}/v1/google-maps/geocode-details?latitude=${latitude}&longitude=${longitude}`;

        return this.httpClient.get<any>(url).pipe(
            map((response) => {
                console.log("Geocoding API response:", response);
                return response;
            }),
            catchError((error) => {
                console.error("Geocoding API error:", error);
                return of("");
            })
        );
    }
    ```

- **Usage**:

    ```typescript
    const latitude = 40.7128;
    const longitude = -74.006;

    googleMapsService.getGeocodeDetails(latitude, longitude).subscribe((details) => {
        console.log("Geocode details:", details);
    });
    ```

##### 1.8.2.6.3. Get Formatted Geocode Details

- **Endpoint**: `/api/v1/google-maps/geocode-details`
- **Method**: GET
- **Description**: Retrieves the formatted geocode details (address components) for a specific latitude and longitude.
- **Parameters**:
  - `latitude`: The latitude of the location.
  - `longitude`: The longitude of the location.
  - **Response**: Returns an object with the formatted geocode details.
  - **Authorization**: No authentication required.
  - **Error Handling**: Returns an empty object if the details cannot be retrieved or if the request fails.
  - **Sample Code**:

    ```typescript
    getFormattedGeocodeDetails(latitude: number, longitude: number) {
        let url = `${this.apiUrl}/v1/google-maps/geocode-details?latitude=${latitude}&longitude=${longitude}`;

        return this.httpClient.get<any>(url).pipe(
            map((response) => {
                console.log("Geocoding API response:", response);
                const addressComponents = response.results[0].address_components;

                const postalCodeComponent = addressComponents.find(
                    (component) => component.types.includes("postal_code")
                );

                return {
                    pinCode: postalCodeComponent ? postalCodeComponent.long_name : "",
                    completeAddress: response.results[0].formatted_address,
                    city: addressComponents.find((component) =>
                        component.types.includes("locality")
                    )
                        ? addressComponents.find((component) =>
                              component.types.includes("locality")
                          ).long_name
                        : "",
                    state: addressComponents.find((component) =>
                        component.types.includes("administrative_area_level_1")
                    )
                        ? addressComponents.find((component) =>
                              component.types.includes("administrative_area_level_1")
                          ).long_name
                        : "",
                    country: addressComponents.find((component) =>
                        component.types.includes("country")
                    )
                        ? addressComponents.find((component) =>
                              component.types.includes("country")
                          ).long_name
                        : "",
                };
            }),
            catchError((error) => {
                console.error("Geocoding API error:", error);
                return of("");
            })
        );
    }
    ```

- **Usage**:

    ```typescript
    const latitude = 40.7128;
    const longitude = -74.006;

    googleMapsService.getFormattedGeocodeDetails(latitude, longitude).subscribe((details) => {
        console.log("Formatted geocode details:", details);
    });
    ```

##### 1.8.2.6.4. Get Place Details

- **Endpoint**: `/api/v1/google-maps/place-details`
- **Method**: GET
- **Description**: Retrieves detailed information about a place using its place ID.
- **Parameters**:
  - `placeId`: The unique ID of the place.
  - **Response**: Returns an object with the place details.
  - **Authorization**: No authentication required.
  - **Error Handling**: Returns an empty object if the details cannot be retrieved or if the request fails.
  - **Sample Code**:

    ```typescript
    getPlaceDetails(placeId: string) {
        const placeDetailsUrl = `${this.apiUrl}/v1/google-maps/place-details?placeId=${placeId}`;
        return this.httpClient.get<any>(placeDetailsUrl).pipe(
            map((response) => response.result),
            catchError(() => of([]))
        );
    }
    ```

- **Usage**:

    ```typescript
    const placeId = "some-place-id";

    googleMapsService.getPlaceDetails(placeId).subscribe((details) => {
        console.log("Place details:", details);
    });
    ```

### 1.8.3. Error Codes and Handling

### 1.8.4. How to Test APIs as a Beginner

## 1.9. Database Design

### 1.9.1. Database Schema Overview

### 1.9.2. Key Tables and Their Purpose

### 1.9.3. Entity-Relationship Diagrams (ERD)

### 1.9.4. Sample Queries for Common Use Cases

## 1.10. User Interface (UI)

### 1.10.1. Screenshots of All Pages (annotated with descriptions)

1. **Login Page**

    - User authentication interface
    - Phone number input
    - OTP verification

2. **Menu Page**

    - Category-wise menu items
    - Item details with images
    - Add to cart functionality

3. **Cart Page**

    - Order summary
    - Item quantity adjustment
    - Checkout process

4. **Admin Dashboard**
    - Order management
    - Menu management
    - Analytics overview

### 1.10.2. Navigation Map

### 1.10.3. Design Principles Used

1. **Material Design**

    - Consistent UI components
    - Responsive layouts
    - Intuitive interactions

2. **User Experience**
    - Clear navigation
    - Fast loading
    - Error handling

## 1.11. Ad Hoc Process Configuration

### 1.11.1. Payment Gateway Integration

#### 1.11.1.1. Overview of Payment Gateway Used

- Razorpay integration
- Secure payment processing
- Multiple payment methods

#### 1.11.1.2. API Keys, Credentials, and Configuration Steps

1. Obtain Razorpay API keys
2. Configure in environment files
3. Set up webhook endpoints

#### 1.11.1.3. Step-by-Step Guide for Setting Up Payment Flow

1. Initialize Razorpay
2. Create order
3. Handle payment response
4. Verify payment status

### 1.11.2. Messaging Service Integration (e.g., SMS, WhatsApp)

#### 1.11.2.1. Overview of Messaging Providers

- WhatsApp Business API
- Firebase Cloud Messaging
- SMS gateway integration

#### 1.11.2.2. Setting Up API Access and Authentication

1. WhatsApp Business account setup
2. API key configuration
3. Template message approval

#### 1.11.2.3. Sending Messages

```typescript
async function sendWhatsAppMessage(
    to: string,
    template: string,
    params: any[]
) {}
```

## 1.12. Testing Guidelines

### 1.12.1. Overview of Testing Strategy

1. **Unit Testing**

    - Component testing
    - Service testing
    - Utility function testing

2. **Integration Testing**
    - API endpoint testing
    - Database operations
    - Authentication flow

### 1.12.2. Functional Testing Scenarios

1. **Order Flow Testing**

    - Menu item selection
    - Cart operations
    - Checkout process
    - Payment integration

2. **Admin Operations**
    - Menu management
    - Order processing
    - User management

### 1.12.3. Technical Testing

1. **Performance Testing**

    - Load time optimization
    - API response times
    - Database query performance

2. **Security Testing**
    - Authentication
    - Authorization
    - Data encryption

### 1.12.4. Bug Reporting Guidelines

1. **Bug Report Format**

    - Title: Short description of the issue
    - Description: Detailed explanation of the problem
    - Steps to Reproduce: Step-by-step guide to reproduce the bug
    - Expected Behavior: What should happen
    - Actual Behavior: What is happening
    - Screenshots: Visual evidence of the bug
    - Environment: Browser, device, OS
    - Severity: Low/Medium/High
    - Priority: Low/Medium/High

## 1.13. Deployment and Maintenance

### 1.13.1. Deployment Process

1. **Build Process**

    ```bash
    ng build --configuration production
    ```

2. **Firebase Deployment**

    ```bash
    firebase use production
    firebase deploy
    ```

### 1.13.2. Version Control Guidelines

1. **Branch Strategy**
    - main: production
    - develop: development
    - feature branches: new features
    - bugfix branches: bug fixes
    - hotfix branches: critical fixes
    - release branches: version releases
2. **Commit Messages**
    - feat: new feature
    - fix: bug fix
    - docs: documentation
    - style: formatting
    - refactor: code restructuring

### 1.13.3. Backup and Recovery Plan

1. **Database Backup**

    - Daily automated backups
    - Manual backup before major updates
    - Backup verification process

2. **Recovery Procedures**
    - Database restoration
    - Application rollback
    - Emergency contacts

## 1.14. Troubleshooting Guide

### 1.14.1. Common Issues and Fixes

1. **Authentication Issues**

    - Check Firebase configuration
    - Verify API keys
    - Clear browser cache

2. **Payment Issues**
    - Verify Razorpay integration
    - Check webhook configuration
    - Monitor payment logs

### 1.14.2. Debugging Tips for Developers

1. **Frontend Debugging**

    - Use Chrome DevTools
    - Check console logs
    - Monitor network requests

2. **Backend Debugging**
    - Firebase Functions logs
    - Database queries
    - API responses

## 1.15. Security Considerations

### 1.15.1. Security Practices Implemented

1. **Authentication**

    - Phone number verification
    - JWT token management
    - Session handling

2. **Data Security**
    - HTTPS encryption
    - Firebase security rules
    - Input validation

### 1.15.2. Guidelines for Handling Sensitive Data

1. **User Data**

    - Encryption at rest
    - Secure transmission
    - Access control

2. **Payment Information**
    - PCI compliance
    - Tokenization
    - Secure storage

## 1.16. FAQ

### 1.16.1. Common Questions by Non-Technical Staff

Q: How do I update menu items?
A: Use the admin dashboard menu management section.

Q: How do I process orders?
A: Monitor the order management dashboard and update order statuses.

### 1.16.2. Questions Related to API Usage

Q: How do I test API endpoints?
A: Use Postman or the Firebase Emulator Suite.

Q: How do I handle API errors?
A: Check error codes and implement proper error handling.

### 1.16.3. Testing and Debugging FAQs

Q: How do I run tests?
A: Use `ng test` for unit tests.

Q: How do I debug issues?
A: Use browser DevTools and Firebase Console.

## 1.17. Appendix

### 1.17.1. Resources and References

1. **Documentation**

    - [Angular Documentation](https://angular.io/docs)
    - [Firebase Documentation](https://firebase.google.com/docs)
    - [Razorpay Documentation](https://razorpay.com/docs)

2. **Tutorials**
    - Angular tutorials
    - Firebase guides
    - Testing guides

### 1.17.2. Links to Tools, Libraries, and Frameworks Used

1. **Development Tools**

    - [Visual Studio Code](https://code.visualstudio.com)
    - [Git](https://git-scm.com)
    - [Node.js](https://nodejs.org)

2. **Frameworks and Libraries**
    - [Angular](https://angular.io)
    - [Angular Material](https://material.angular.io)
    - [Firebase](https://firebase.google.com)

### 1.17.3. Glossary of Technical Terms

- **Angular**: Frontend framework
- **Firebase**: Backend platform
- **API**: Application Programming Interface
- **JWT**: JSON Web Token
- **REST**: Representational State Transfer
- **OTP**: One-Time Password
- **UI/UX**: User Interface/User Experience
- **CI/CD**: Continuous Integration/Continuous Deployment
