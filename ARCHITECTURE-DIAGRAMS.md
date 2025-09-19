# 📊 Diagramas de Arquitectura - Sistema ERP JLC

## 🏗️ Diagrama de Arquitectura General

```mermaid
graph TB
    subgraph "Frontend - React SPA"
        A[App.js<br/>Componente Raíz] --> B[Login Screen]
        A --> C[Welcome Modules<br/>por Departamento]
        A --> D[Main Application<br/>Task Management]

        C --> C1[FinanceWelcome.js]
        C --> C2[TechnicalWelcome.js]
        C --> C3[OperatorWelcome.js]
        C --> C4[DevelopmentWelcome.js]
    end

    subgraph "Services Layer"
        S[taskService.js] --> S1[getUserTasks]
        S --> S2[saveUserTasks]
        S --> S3[addTask]
        S --> S4[calculateSummary]
        S --> S5[exportToJson]
    end

    subgraph "Utilities"
        U1[constants.js<br/>Roles & Config]
        U2[DateFormat.js<br/>Formatters]
        U3[KeyboardNavigation.js<br/>Navigation]
        U4[CopyClipboard.js<br/>Clipboard]
    end

    subgraph "Data Storage"
        LS[(localStorage<br/>Browser Storage)]
        JSON[JSON Files<br/>Import/Export]
    end

    A --> S
    S --> LS
    S --> JSON
    A --> U1
    A --> U2
    A --> U3
    A --> U4
```

## 👥 Diagrama de Roles y Flujo de Usuario

```mermaid
stateDiagram-v2
    [*] --> Login

    Login --> RoleDetermination: Autenticación exitosa

    RoleDetermination --> FinanceWelcome: Rol = FINANZAS
    RoleDetermination --> TechnicalWelcome: Rol = TECNICO
    RoleDetermination --> OperatorWelcome: Rol = OPERARIO
    RoleDetermination --> DevelopmentWelcome: Rol = DESARROLLO
    RoleDetermination --> AdminWelcome: Rol = ADMIN

    FinanceWelcome --> TaskManagement: Acceder Dashboard
    TechnicalWelcome --> TaskManagement: Gestionar OTs
    OperatorWelcome --> TaskManagement: Registrar Horas
    DevelopmentWelcome --> TaskManagement: Ver Estado Sistema
    AdminWelcome --> TaskManagement: Acceso Completo

    TaskManagement --> Logout: Cerrar Sesión
    Logout --> [*]

    note right of RoleDetermination
        Función: getUserRole(userName)
        Determina rol basado en lista de usuarios
    end note
```

## 🔄 Diagrama de Flujo de Datos

```mermaid
flowchart TD
    subgraph "User Interface"
        UI1[Login Form] --> Auth[Authentication]
        UI2[Welcome Modules] --> Nav[Navigation]
        UI3[Task Management] --> CRUD[CRUD Operations]
    end

    subgraph "Business Logic"
        Auth --> RoleSvc[Role Service]
        Nav --> StateMgr[State Management]
        CRUD --> TaskSvc[Task Service]
    end

    subgraph "Data Layer"
        TaskSvc --> Storage[localStorage]
        TaskSvc --> ExportSvc[Export Service]
        RoleSvc --> UserDB[User Database]
    end

    subgraph "External Systems"
        ExportSvc --> JSON[JSON Files]
        ExportSvc --> Clipboard[Clipboard API]
        ExportSvc --> Share[Web Share API]
    end

    Storage -.-> Backup[Backup Files]
    UserDB -.-> Config[Configuration]
```

## 🧩 Diagrama de Componentes y Dependencias

```mermaid
classDiagram
    class App {
        +currentView: string
        +currentTheme: string
        +userRole: string
        +isLoggedIn: boolean
        +userName: string
        +taskGroups: TaskGroup[]
        +handleLogin()
        +handleLogout()
        +handleNavigate()
        +handleThemeChange()
    }

    class WelcomeModules {
        <<interface>>
        +userName: string
        +onNavigate: function
        +onThemeChange: function
        +currentTheme: string
    }

    class TaskService {
        +getUserTasks(userName): TaskGroup[]
        +saveUserTasks(userName, tasks): void
        +addTask(tasks, date, time, desc): TaskGroup[]
        +calculateSummary(tasks): Summary[]
        +exportToJson(tasks): string
        +shareData(tasks, user, summary): string
    }

    class Constants {
        +USER_ROLES: object
        +defaultUsersWithRoles: User[]
        +sectors: string[]
        +getUserRole(userName): string
    }

    App --> WelcomeModules: renders
    App --> TaskService: uses
    App --> Constants: uses

    WelcomeModules <|-- FinanceWelcome
    WelcomeModules <|-- TechnicalWelcome
    WelcomeModules <|-- OperatorWelcome
    WelcomeModules <|-- DevelopmentWelcome

    TaskService --> localStorage: persists
    Constants --> User: defines roles
```

## 🔐 Diagrama de Seguridad y Roles

```mermaid
graph TD
    subgraph "Authentication Layer"
        Login[User Login] --> Validate[Validate Credentials]
        Validate --> RoleCheck[Determine User Role]
    end

    subgraph "Authorization Matrix"
        RoleCheck --> Finance[FINANZAS Role]
        RoleCheck --> Technical[TECNICO Role]
        RoleCheck --> Operator[OPERARIO Role]
        RoleCheck --> Development[DESARROLLO Role]
        RoleCheck --> Admin[ADMIN Role]
    end

    subgraph "Access Control"
        Finance --> FinanceTools[Financial Tools Only]
        Technical --> TechnicalTools[Technical Tools Only]
        Operator --> OperatorTools[Field Tools Only]
        Development --> DevelopmentTools[Dev Tools Only]
        Admin --> AllTools[All Tools Access]
    end

    subgraph "Data Isolation"
        FinanceTools --> FinanceData[Financial Data]
        TechnicalTools --> TechnicalData[Technical Data]
        OperatorTools --> OperatorData[Field Data]
        DevelopmentTools --> SystemData[System Data]
        AllTools --> AllData[All Data Access]
    end

    Login -.-> Session[Session Management]
    Session -.-> Timeout[Auto Logout]
```

## 📱 Diagrama de Navegación y Estados

```mermaid
stateDiagram-v2
    [*] --> LoginState: App Start

    LoginState --> WelcomeState: Login Success
    LoginState --> LoginState: Login Failed

    WelcomeState --> TaskState: Navigate to Tasks
    WelcomeState --> WelcomeState: Theme Change
    WelcomeState --> LoginState: Logout

    TaskState --> TaskState: CRUD Operations
    TaskState --> WelcomeState: Home Button (Alt+H)
    TaskState --> LoginState: Logout

    note right of WelcomeState
        Estado condicional basado en userRole:
        - FINANZAS → FinanceWelcome
        - TECNICO → TechnicalWelcome
        - OPERARIO → OperatorWelcome
        - DESARROLLO → DevelopmentWelcome
        - ADMIN → WelcomeModule
    end note

    note right of TaskState
        Funcionalidad completa:
        - Gestión de tareas
        - Reportes
        - Exportación
        - Configuración
    end note
```

## 🔧 Diagrama de Servicios y Utilidades

```mermaid
graph TB
    subgraph "Core Services"
        TS[Task Service] --> Persistence[Data Persistence]
        TS --> Calculation[Business Logic]
        TS --> Export[Data Export]
    end

    subgraph "Utility Services"
        DateFmt[Date Format Utils] --> Formatting[Date Formatting]
        DateFmt --> Validation[Date Validation]

        Keyboard[Keyboard Navigation] --> Shortcuts[Keyboard Shortcuts]
        Keyboard --> Focus[Focus Management]

        Clipboard[Clipboard Utils] --> Copy[Copy to Clipboard]
        Clipboard --> Share[Web Share API]
    end

    subgraph "Configuration"
        Config[Constants] --> Roles[User Roles]
        Config --> Defaults[Default Values]
        Config --> Settings[App Settings]
    end

    subgraph "Integration Layer"
        ERP[ERP Module] --> API[API Exports]
        ERP --> Components[Component Exports]
        ERP --> Services[Service Exports]
    end

    TS --> DateFmt
    TS --> Config
    ERP --> TS
    ERP --> Config
```

## 📊 Diagrama de Flujo de Trabajo Departamental

```mermaid
flowchart LR
    subgraph "Finanzas"
        F1[Emitir Facturas] --> F2[Controlar Pagos]
        F2 --> F3[Reportes Financieros]
    end

    subgraph "Técnico"
        T1[Planificar Mantenimiento] --> T2[Crear Órdenes de Trabajo]
        T2 --> T3[Asignar Técnicos]
        T3 --> T4[Seguimiento OTs]
    end

    subgraph "Operarios"
        O1[Recibir OTs] --> O2[Ejecutar Tareas]
        O2 --> O3[Registrar Horas]
        O3 --> O4[Reportar Incidencias]
    end

    subgraph "Desarrollo"
        D1[Integrar APIs] --> D2[Soporte Técnico]
        D2 --> D3[Capacitación]
        D3 --> D4[Reportes de Sistema]
    end

    F1 -.-> T1
    T2 -.-> O1
    O4 -.-> T4
    D2 -.-> F3
    D2 -.-> T4
    D2 -.-> O4

    style F1 fill:#10b981
    style T1 fill:#3b82f6
    style O1 fill:#f59e0b
    style D1 fill:#8b5cf6
```

## 🗂️ Diagrama de Estructura de Archivos

```mermaid
graph LR
    subgraph "Root Level"
        ROOT[app-horas-jlc/]
    end

    subgraph "Source Code"
        SRC[src/]
    end

    subgraph "Components"
        COMP[components/]
    end

    subgraph "Services"
        SERV[services/]
    end

    subgraph "Utilities"
        UTIL[utils/]
    end

    subgraph "Public Assets"
        PUB[public/]
    end

    ROOT --> SRC
    ROOT --> PUB
    ROOT --> package.json
    ROOT --> README-ERP.md
    ROOT --> PROJECT-ARCHITECTURE.md

    SRC --> App.js
    SRC --> App.css
    SRC --> App.test.js
    SRC --> index.js
    SRC --> erp-module.js

    SRC --> COMP
    SRC --> SERV
    SRC --> UTIL

    COMP --> WelcomeModule.js
    COMP --> FinanceWelcome.js
    COMP --> TechnicalWelcome.js
    COMP --> OperatorWelcome.js
    COMP --> DevelopmentWelcome.js
    COMP --> DatePicker.js
    COMP --> FileUploader.js
    COMP --> GroupVisibilityManager.js
    COMP --> InputManager.js
    COMP --> VersionInfo.js

    SERV --> taskService.js

    UTIL --> constants.js
    UTIL --> DateFormat.js
    UTIL --> CopyClipboard.js
    UTIL --> DomUtils.js
    UTIL --> KeyboardNavigation.js

    PUB --> index.html
    PUB --> manifest.json
    PUB --> favicon.ico
```

## 🔄 Diagrama de Ciclo de Vida de Componentes

```mermaid
sequenceDiagram
    participant U as Usuario
    participant A as App.js
    participant W as Welcome Module
    participant T as Task Service
    participant S as localStorage

    U->>A: Ingresar credenciales
    A->>A: Validar login
    A->>A: Determinar rol de usuario
    A->>W: Renderizar módulo de bienvenida específico
    W->>U: Mostrar herramientas del departamento

    U->>W: Hacer clic en "Comenzar"
    W->>A: Navegar a vista de tareas
    A->>T: Solicitar datos de usuario
    T->>S: Leer datos de localStorage
    S-->>T: Retornar datos
    T-->>A: Datos de tareas
    A->>U: Renderizar aplicación completa

    U->>A: Realizar operaciones CRUD
    A->>T: Ejecutar operaciones
    T->>S: Persistir cambios
    T-->>A: Confirmación
    A-->>U: Actualizar UI
```

## 🎨 Diagrama de Sistema de Estilos

```mermaid
graph TD
    subgraph "CSS Architecture"
        CSS[App.css] --> Variables[CSS Variables<br/>--column-width, --colors]
        CSS --> Themes[Theme System<br/>.welcome-module, .tool-card]
        CSS --> Responsive[Responsive Design<br/>@media queries]
    end

    subgraph "Component Styles"
        CompCSS[Component CSS] --> Welcome[Welcome Modules<br/>.department-badge, .tool-card]
        CompCSS --> Main[Main App<br/>.task-table, .summary-item]
        CompCSS --> Utils[Utility Classes<br/>.button, .popup-overlay]
    end

    subgraph "Theme Variants"
        Light[Light Theme<br/>Background: #f8fafc<br/>Text: #1e293b]
        Dark[Dark Theme<br/>Background: #1e293b<br/>Text: #f8fafc]
        Auto[Auto Theme<br/>System preference]
    end

    Variables --> Light
    Variables --> Dark
    Variables --> Auto

    CSS --> CompCSS
    Themes --> Light
    Themes --> Dark
    Themes --> Auto
```

## 📈 Diagrama de Escalabilidad

```mermaid
graph TD
    subgraph "Current Architecture"
        CA[Monolithic SPA] --> Components[React Components]
        CA --> Services[Service Layer]
        CA --> Storage[localStorage]
    end

    subgraph "Scalability Path"
        SP[Microservices Ready] --> API[REST API Layer]
        SP --> DB[Database Layer]
        SP --> Cache[Caching Layer]
        SP --> CDN[CDN Assets]
    end

    subgraph "Integration Points"
        ERP[ERP Integration] --> API
        ERP --> Components
        ERP --> Services
    end

    subgraph "Future Extensions"
        Mobile[Mobile App] --> API
        Webhooks[External Webhooks] --> API
        Reports[Advanced Reports] --> DB
        Analytics[Analytics Dashboard] --> Cache
    end

    CA -.-> SP
    SP -.-> ERP
    SP -.-> Mobile
    SP -.-> Webhooks
    SP -.-> Reports
    SP -.-> Analytics
```

---

## 📋 Leyenda de Diagramas

### Formas y Colores
- 🔵 **Azul**: Componentes principales, navegación
- 🟢 **Verde**: Servicios y lógica de negocio
- 🟡 **Amarillo**: Utilidades y helpers
- 🟠 **Naranja**: Datos y persistencia
- 🔴 **Rojo**: Seguridad y autenticación
- 🟣 **Morado**: Integración y APIs

### Tipos de Conexión
- **→**: Flujo de datos directo
- **-->**: Respuesta/return
- **-.->**: Conexión opcional/futura
- **==>**: Transformación de datos

### Estados
- **[*]**: Estado inicial/final
- **Estado**: Estados normales del sistema
- **note**: Notas explicativas

---

**Herramientas utilizadas para diagramas**: Mermaid.js
**Formato**: Markdown con sintaxis Mermaid
**Actualización**: Septiembre 2024