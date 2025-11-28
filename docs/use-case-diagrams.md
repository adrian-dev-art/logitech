# UML Diagrams - Sistem Logistik

## 3. Use Case Diagrams

Diagram ini menunjukkan interaksi berbagai role user dengan sistem. Untuk kemudahan pembacaan, diagram dipisah berdasarkan role.

### 3.1 Use Case Diagram - Admin Role

```mermaid
flowchart TB
    Admin([ADMIN])

    Admin --> AUTH

    subgraph AUTH[Authentication Module]
        direction TB
        Login[Login]
        Logout[Logout]
    end

    AUTH --> USER

    subgraph USER[User Management Module]
        direction TB
        CreateUser[Create User]
        UpdateUser[Update User]
        DeleteUser[Delete User]
        ViewUsers[View Users]
    end

    USER --> CUSTOMER

    subgraph CUSTOMER[Customer Management Module]
        direction TB
        CreateCustomer[Create Customer]
        UpdateCustomer[Update Customer]
        DeleteCustomer[Delete Customer]
        ViewCustomers[View Customers]
    end

    CUSTOMER --> FLEET

    subgraph FLEET[Fleet Management Module]
        direction TB
        CreateFleet[Create Fleet]
        UpdateFleet[Update Fleet]
        DeleteFleet[Delete Fleet]
        ViewFleets[View Fleets]
    end

    FLEET --> LOCATION

    subgraph LOCATION[Location Management Module]
        direction TB
        CreateLocation[Create Location]
        UpdateLocation[Update Location]
        DeleteLocation[Delete Location]
        ViewLocations[View Locations]
    end

    LOCATION --> REPORT

    subgraph REPORT[Reports & Analytics Module]
        direction TB
        ViewDashboard[View Dashboard]
        GenerateReports[Generate Reports]
        ViewActivityLogs[View Activity Logs]
        ExportData[Export Data]
    end

    style Admin fill:#FF6B6B,stroke:#C92A2A,stroke-width:4px,color:#fff
    style AUTH fill:#FFE66D,stroke:#F59F00,stroke-width:3px
    style USER fill:#4ECDC4,stroke:#0B7285,stroke-width:3px
    style CUSTOMER fill:#95E1D3,stroke:#087F5B,stroke-width:3px
    style FLEET fill:#F38181,stroke:#C92A2A,stroke-width:3px
    style LOCATION fill:#AA96DA,stroke:#5F3DC4,stroke-width:3px
    style REPORT fill:#FCBAD3,stroke:#C2255C,stroke-width:3px
```

### 3.2 Use Case Diagram - Manager Role

```mermaid
flowchart TB
    Manager([MANAGER])

    Manager --> AUTH

    subgraph AUTH[Authentication Module]
        direction TB
        Login[Login]
        Logout[Logout]
    end

    AUTH --> CUSTOMER

    subgraph CUSTOMER[Customer Management Module]
        direction TB
        CreateCustomer[Create Customer]
        UpdateCustomer[Update Customer]
        ViewCustomers[View Customers]
    end

    CUSTOMER --> FLEET

    subgraph FLEET[Fleet Management Module]
        direction TB
        CreateFleet[Create Fleet]
        UpdateFleet[Update Fleet]
        ViewFleets[View Fleets]
        FleetMaintenance[Manage Fleet Maintenance]
    end

    FLEET --> LOCATION

    subgraph LOCATION[Location Management Module]
        direction TB
        CreateLocation[Create Location]
        UpdateLocation[Update Location]
        ViewLocations[View Locations]
    end

    LOCATION --> SHIPMENT

    subgraph SHIPMENT[Shipment Management Module]
        direction TB
        CreateShipment[Create Shipment]
        UpdateShipment[Update Shipment Status]
        AssignFleet[Assign Fleet to Shipment]
        ViewShipments[View Shipments]
    end

    SHIPMENT --> REPORT

    subgraph REPORT[Reports & Analytics Module]
        direction TB
        ViewDashboard[View Dashboard]
        GenerateReports[Generate Reports]
        ViewActivityLogs[View Activity Logs]
    end

    CreateShipment -.includes.-> ViewCustomers
    AssignFleet -.includes.-> ViewFleets

    style Manager fill:#845EC2,stroke:#5F3DC4,stroke-width:4px,color:#fff
    style AUTH fill:#FFE66D,stroke:#F59F00,stroke-width:3px
    style CUSTOMER fill:#95E1D3,stroke:#087F5B,stroke-width:3px
    style FLEET fill:#F38181,stroke:#C92A2A,stroke-width:3px
    style LOCATION fill:#AA96DA,stroke:#5F3DC4,stroke-width:3px
    style SHIPMENT fill:#00D2FC,stroke:#0B7285,stroke-width:3px
    style REPORT fill:#FCBAD3,stroke:#C2255C,stroke-width:3px
```

### 3.3 Use Case Diagram - Staff Role

```mermaid
flowchart TB
    Staff([STAFF])

    subgraph AUTH[Authentication Module]
        Login[Login]
        Logout[Logout]
    end

    subgraph CUSTOMER[Customer Management Module]
        ViewCustomers[View Customers]
    end

    subgraph SHIPMENT[Shipment Management Module]
        CreateShipment[Create Shipment]
        UpdateShipment[Update Shipment Status]
        TrackShipment[Track Shipment]
        ViewShipments[View Shipments]
    end

    subgraph REPORT[Dashboard Module]
        ViewDashboard[View Dashboard]
    end

    Staff --> Login
    Staff --> Logout
    Staff --> ViewCustomers
    Staff --> CreateShipment
    Staff --> UpdateShipment
    Staff --> TrackShipment
    Staff --> ViewShipments
    Staff --> ViewDashboard

    CreateShipment -.includes.-> ViewCustomers

    style Staff fill:#00C9A7,stroke:#087F5B,stroke-width:4px,color:#fff
    style AUTH fill:#FFE66D,stroke:#F59F00,stroke-width:2px
    style CUSTOMER fill:#95E1D3,stroke:#087F5B,stroke-width:2px
    style SHIPMENT fill:#00D2FC,stroke:#0B7285,stroke-width:2px
    style REPORT fill:#FCBAD3,stroke:#C2255C,stroke-width:2px
```

### 3.4 Use Case Diagram - Driver Role

```mermaid
flowchart TB
    Driver([DRIVER])

    subgraph AUTH[Authentication Module]
        Login[Login]
        Logout[Logout]
    end

    subgraph SHIPMENT[Shipment Operations Module]
        UpdateShipment[Update Shipment Status]
        TrackShipment[Track Shipment]
        ViewShipments[View Assigned Shipments]
    end

    subgraph REPORT[Dashboard Module]
        ViewDashboard[View Dashboard]
    end

    Driver --> Login
    Driver --> Logout
    Driver --> UpdateShipment
    Driver --> TrackShipment
    Driver --> ViewShipments
    Driver --> ViewDashboard

    style Driver fill:#FF6F59,stroke:#C92A2A,stroke-width:4px,color:#fff
    style AUTH fill:#FFE66D,stroke:#F59F00,stroke-width:2px
    style SHIPMENT fill:#00D2FC,stroke:#0B7285,stroke-width:2px
    style REPORT fill:#FCBAD3,stroke:#C2255C,stroke-width:2px
```

### 3.5 Use Case Diagram - System Overview (All Roles)

```mermaid
flowchart LR
    Admin([ADMIN])
    Manager([MANAGER])
    Staff([STAFF])
    Driver([DRIVER])

    subgraph SYSTEM[Logistic Management System]
        direction TB

        Auth[Authentication]
        UserMgmt[User Management]
        CustomerMgmt[Customer Management]
        FleetMgmt[Fleet Management]
        LocationMgmt[Location Management]
        ShipmentMgmt[Shipment Management]
        Reports[Reports & Analytics]
    end

    Admin -.Full Access.-> UserMgmt
    Admin -.Full Access.-> CustomerMgmt
    Admin -.Full Access.-> FleetMgmt
    Admin -.Full Access.-> LocationMgmt
    Admin -.Full Access.-> Reports

    Manager -.Manage.-> CustomerMgmt
    Manager -.Manage.-> FleetMgmt
    Manager -.Manage.-> LocationMgmt
    Manager -.Manage.-> ShipmentMgmt
    Manager -.View.-> Reports

    Staff -.Create/Update.-> ShipmentMgmt
    Staff -.View.-> CustomerMgmt

    Driver -.Update Status.-> ShipmentMgmt

    Admin --> Auth
    Manager --> Auth
    Staff --> Auth
    Driver --> Auth

    style Admin fill:#FF6B6B,stroke:#C92A2A,stroke-width:4px,color:#fff
    style Manager fill:#845EC2,stroke:#5F3DC4,stroke-width:4px,color:#fff
    style Staff fill:#00C9A7,stroke:#087F5B,stroke-width:4px,color:#fff
    style Driver fill:#FF6F59,stroke:#C92A2A,stroke-width:4px,color:#fff
    style SYSTEM fill:#F8F9FA,stroke:#495057,stroke-width:3px
```
