# UML Diagrams - Sistem Logistik

## 1. Class Diagram

Diagram ini menunjukkan struktur model/entitas dalam sistem beserta atribut dan method-nya.

```mermaid
classDiagram
    class User {
        +String username
        +String email
        +String password
        +String fullName
        +String role
        +String phone
        +Boolean isActive
        +Date createdAt
        +Date updatedAt
        +comparePassword(candidatePassword) Boolean
    }

    class Customer {
        +String id
        +String name
        +String email
        +String phone
        +String address
        +String company
        +Number totalShipments
        +Boolean isActive
        +Date createdAt
        +Date updatedAt
    }

    class Fleet {
        +String id
        +String plateNumber
        +String type
        +Number capacity
        +String driver
        +String status
        +Date lastMaintenance
        +Date nextMaintenance
        +String fuelType
        +Number year
        +Date createdAt
        +Date updatedAt
    }

    class Shipment {
        +String id
        +Object customer
        +String origin
        +String destination
        +Number weight
        +String status
        +Object fleet
        +Date estimatedDelivery
        +Date actualDelivery
        +String notes
        +Date createdAt
        +Date updatedAt
    }

    class Location {
        +String id
        +String name
        +String cityName
        +String type
        +String address
        +Object coordinates
        +Number latitude
        +Number longitude
        +Number capacity
        +Number currentOccupancy
        +String manager
        +Boolean isActive
        +Date createdAt
        +Date updatedAt
    }

    class ActivityLog {
        +ObjectId user
        +String action
        +String details
        +String ipAddress
        +Date timestamp
        +Date createdAt
        +Date updatedAt
    }

    User "1" --> "*" ActivityLog : creates
    Fleet "0..1" --> "*" Shipment : assigned to
    Customer "1" --> "*" Shipment : places
    Location "1" --> "*" Shipment : origin/destination
```

## 2. Entity Relationship Diagram (ERD)

Diagram ini menunjukkan relasi antar entitas dalam database.

```mermaid
erDiagram
    USER ||--o{ ACTIVITY_LOG : creates
    USER {
        ObjectId _id PK
        String username UK
        String email UK
        String password
        String fullName
        String role
        String phone
        Boolean isActive
        DateTime createdAt
        DateTime updatedAt
    }

    CUSTOMER ||--o{ SHIPMENT : places
    CUSTOMER {
        ObjectId _id PK
        String id UK
        String name
        String email
        String phone
        String address
        String company
        Number totalShipments
        Boolean isActive
        DateTime createdAt
        DateTime updatedAt
    }

    FLEET ||--o{ SHIPMENT : "assigned to"
    FLEET {
        ObjectId _id PK
        String id UK
        String plateNumber UK
        String type
        Number capacity
        String driver
        String status
        Date lastMaintenance
        Date nextMaintenance
        String fuelType
        Number year
        DateTime createdAt
        DateTime updatedAt
    }

    SHIPMENT }o--|| LOCATION : "origin"
    SHIPMENT }o--|| LOCATION : "destination"
    SHIPMENT {
        ObjectId _id PK
        String id UK
        Object customer
        String origin FK
        String destination FK
        Number weight
        String status
        Object fleet
        Date estimatedDelivery
        Date actualDelivery
        String notes
        DateTime createdAt
        DateTime updatedAt
    }

    LOCATION {
        ObjectId _id PK
        String id UK
        String name
        String cityName
        String type
        String address
        Object coordinates
        Number latitude
        Number longitude
        Number capacity
        Number currentOccupancy
        String manager
        Boolean isActive
        DateTime createdAt
        DateTime updatedAt
    }

    ACTIVITY_LOG {
        ObjectId _id PK
        ObjectId user FK
        String action
        String details
        String ipAddress
        DateTime timestamp
        DateTime createdAt
        DateTime updatedAt
    }
```

## 3. Use Case Diagram

Diagram ini menunjukkan interaksi berbagai role user dengan sistem.

```mermaid
graph TB
    subgraph "Logistic Management System"
        UC1[Manage Users]
        UC2[Manage Customers]
        UC3[Manage Fleet]
        UC4[Manage Locations]
        UC5[Create Shipment]
        UC6[Update Shipment Status]
        UC7[Track Shipment]
        UC8[Assign Fleet to Shipment]
        UC9[View Activity Logs]
        UC10[Generate Reports]
        UC11[Manage Fleet Maintenance]
        UC12[View Dashboard]
        UC13[Login/Logout]
    end

    Admin((Admin))
    Manager((Manager))
    Staff((Staff))
    Driver((Driver))

    Admin --> UC1
    Admin --> UC2
    Admin --> UC3
    Admin --> UC4
    Admin --> UC9
    Admin --> UC10
    Admin --> UC12
    Admin --> UC13

    Manager --> UC2
    Manager --> UC3
    Manager --> UC4
    Manager --> UC5
    Manager --> UC6
    Manager --> UC8
    Manager --> UC9
    Manager --> UC10
    Manager --> UC11
    Manager --> UC12
    Manager --> UC13

    Staff --> UC2
    Staff --> UC5
    Staff --> UC6
    Staff --> UC7
    Staff --> UC12
    Staff --> UC13

    Driver --> UC6
    Driver --> UC7
    Driver --> UC12
    Driver --> UC13

    UC5 -.includes.-> UC2
    UC8 -.includes.-> UC3
    UC6 -.includes.-> UC9
```

## 4. Sequence Diagram - Create Shipment Flow

Diagram ini menunjukkan alur proses pembuatan shipment baru.

```mermaid
sequenceDiagram
    actor User as Staff/Manager
    participant Frontend
    participant API as Backend API
    participant Auth as Auth Middleware
    participant Controller as Shipment Controller
    participant DB as MongoDB
    participant Logger as Activity Log

    User->>Frontend: Fill shipment form
    Frontend->>Frontend: Validate input
    Frontend->>API: POST /api/shipments
    API->>Auth: Verify JWT token
    Auth->>Auth: Check user role

    alt Token invalid
        Auth-->>Frontend: 401 Unauthorized
        Frontend-->>User: Show error message
    else Token valid
        Auth->>Controller: Forward request
        Controller->>DB: Check customer exists

        alt Customer not found
            DB-->>Controller: Customer not found
            Controller-->>Frontend: 404 Not Found
            Frontend-->>User: Show error
        else Customer exists
            DB-->>Controller: Customer data
            Controller->>DB: Check fleet availability

            alt Fleet available
                DB-->>Controller: Fleet data
                Controller->>DB: Create shipment
                DB-->>Controller: Shipment created
                Controller->>Logger: Log activity
                Logger->>DB: Save activity log
                Controller-->>Frontend: 201 Created + shipment data
                Frontend-->>User: Show success message
            else Fleet not available
                DB-->>Controller: No fleet available
                Controller->>DB: Create shipment (pending)
                DB-->>Controller: Shipment created
                Controller->>Logger: Log activity
                Controller-->>Frontend: 201 Created (pending fleet)
                Frontend-->>User: Show warning (no fleet)
            end
        end
    end
```

## 5. Sequence Diagram - Update Shipment Status Flow

Diagram ini menunjukkan alur proses update status shipment.

```mermaid
sequenceDiagram
    actor User as Driver/Staff
    participant Frontend
    participant API as Backend API
    participant Auth as Auth Middleware
    participant Controller as Shipment Controller
    participant DB as MongoDB
    participant Logger as Activity Log

    User->>Frontend: Select shipment
    User->>Frontend: Update status
    Frontend->>API: PUT /api/shipments/:id
    API->>Auth: Verify JWT token
    Auth->>Auth: Check permissions

    alt Unauthorized
        Auth-->>Frontend: 403 Forbidden
        Frontend-->>User: Access denied
    else Authorized
        Auth->>Controller: Forward request
        Controller->>DB: Find shipment by ID

        alt Shipment not found
            DB-->>Controller: Not found
            Controller-->>Frontend: 404 Not Found
            Frontend-->>User: Shipment not found
        else Shipment found
            DB-->>Controller: Shipment data
            Controller->>Controller: Validate status transition

            alt Invalid transition
                Controller-->>Frontend: 400 Bad Request
                Frontend-->>User: Invalid status change
            else Valid transition
                Controller->>DB: Update shipment status

                alt Status = "Delivered"
                    Controller->>DB: Set actualDelivery date
                    Controller->>DB: Update fleet status to "Available"
                end

                DB-->>Controller: Updated shipment
                Controller->>Logger: Log status change
                Logger->>DB: Save activity log
                Controller-->>Frontend: 200 OK + updated data
                Frontend-->>User: Status updated successfully
            end
        end
    end
```

## 6. State Diagram - Shipment Status

Diagram ini menunjukkan state transitions untuk status shipment.

```mermaid
stateDiagram-v2
    [*] --> Pending: Create shipment

    Pending --> InTransit: Assign fleet & dispatch
    Pending --> Cancelled: Cancel by user

    InTransit --> Delivered: Complete delivery
    InTransit --> Cancelled: Cancel shipment

    Delivered --> [*]
    Cancelled --> [*]

    note right of Pending
        Waiting for fleet assignment
    end note

    note right of InTransit
        Fleet assigned and on route
    end note

    note right of Delivered
        Successfully delivered
        actualDelivery date set
    end note

    note right of Cancelled
        Shipment cancelled
        Fleet released
    end note
```

## 7. Component Diagram - System Architecture

Diagram ini menunjukkan arsitektur komponen sistem.

```mermaid
graph TB
    subgraph "Frontend - React"
        UI[User Interface]
        Components[React Components]
        State[State Management]
        API_Client[API Client/Axios]
    end

    subgraph "Backend - Node.js/Express"
        Routes[Routes Layer]
        Middleware[Middleware Layer]
        Controllers[Controllers Layer]
        Models[Models Layer]
        Utils[Utilities]
    end

    subgraph "Database"
        MongoDB[(MongoDB)]
    end

    subgraph "Authentication"
        JWT[JWT Service]
        BCrypt[Password Hashing]
    end

    UI --> Components
    Components --> State
    State --> API_Client

    API_Client -->|HTTP/REST| Routes
    Routes --> Middleware
    Middleware --> JWT
    Middleware --> Controllers
    Controllers --> Models
    Controllers --> Utils
    Models --> MongoDB

    Controllers --> BCrypt
    Controllers --> JWT

    style Frontend - React fill:#61dafb
    style Backend - Node.js/Express fill:#68a063
    style Database fill:#4db33d
    style Authentication fill:#f7df1e
```

## 8. Deployment Diagram

Diagram ini menunjukkan deployment architecture sistem.

```mermaid
graph TB
    subgraph "Client Side"
        Browser[Web Browser]
    end

    subgraph "Frontend Server"
        ReactApp[React Application<br/>Port: 3000]
    end

    subgraph "Backend Server"
        ExpressAPI[Express API<br/>Port: 5000]
    end

    subgraph "Database Server"
        MongoDBServer[(MongoDB<br/>Port: 27017)]
    end

    Browser -->|HTTP/HTTPS| ReactApp
    ReactApp -->|REST API Calls| ExpressAPI
    ExpressAPI -->|Mongoose ODM| MongoDBServer

    style Browser fill:#e8f4f8
    style ReactApp fill:#61dafb
    style ExpressAPI fill:#68a063
    style MongoDBServer fill:#4db33d
```

## 9. Activity Diagram - Fleet Assignment Process

Diagram ini menunjukkan proses assignment fleet ke shipment.

```mermaid
flowchart TD
    Start([Start]) --> CheckShipment{Shipment<br/>exists?}

    CheckShipment -->|No| Error1[Return 404 Error]
    CheckShipment -->|Yes| CheckStatus{Status is<br/>Pending?}

    CheckStatus -->|No| Error2[Return 400 Error:<br/>Cannot assign fleet]
    CheckStatus -->|Yes| GetFleetList[Get available fleets]

    GetFleetList --> CheckCapacity{Fleet capacity<br/>>= shipment weight?}

    CheckCapacity -->|No| NoFleet[No suitable fleet]
    CheckCapacity -->|Yes| AssignFleet[Assign fleet to shipment]

    AssignFleet --> UpdateFleetStatus[Update fleet status<br/>to 'On Route']
    UpdateFleetStatus --> UpdateShipmentStatus[Update shipment status<br/>to 'In Transit']
    UpdateShipmentStatus --> LogActivity[Log activity]
    LogActivity --> Success[Return success response]

    NoFleet --> End1([End - No fleet available])
    Error1 --> End2([End - Error])
    Error2 --> End2
    Success --> End3([End - Success])

    style Start fill:#90EE90
    style Success fill:#90EE90
    style End3 fill:#90EE90
    style Error1 fill:#FFB6C6
    style Error2 fill:#FFB6C6
    style End1 fill:#FFE4B5
    style End2 fill:#FFB6C6
```

---

## Cara Menggunakan Diagram Ini

1. **Untuk melihat diagram**: Buka file ini di editor yang support Mermaid (VS Code dengan extension Mermaid, GitHub, GitLab, dll)
2. **Untuk export**: Gunakan tools seperti:
   - Mermaid Live Editor: https://mermaid.live/
   - VS Code extension: Markdown Preview Mermaid Support
   - CLI: `mmdc -i uml-diagrams.md -o output.pdf`

## Legend

- **PK**: Primary Key
- **FK**: Foreign Key
- **UK**: Unique Key
- **||--o{**: One to Many relationship
- **}o--||**: Many to One relationship
- **-->**: Association/Dependency
- **-.includes.->**: Include relationship
