# Inscription Scolaire Frontend

The frontend of the Inscription Scolaire system is a React application that provides user interfaces for students and administrators to interact with the school enrollment management system.

## 🎯 Overview

This frontend application provides:
- User authentication (login/register)
- Student dashboard for enrollment process
- Admin dashboard for managing enrollments and users
- Program browsing and enrollment
- Document upload functionality
- Payment processing interface
- Real-time notifications
- Responsive design for all devices

## 🏗️ Architecture

### System Architecture
The frontend follows a component-based architecture with a unidirectional data flow:

```
App Root
├── Layout Components
├── Page Components
├── Feature Components
├── Service Layer
└── State Management
```

### Key Architectural Principles

1. **Component-Based Architecture**: Reusable, self-contained UI components
2. **Unidirectional Data Flow**: Predictable state management
3. **Separation of Concerns**: Clear division between UI, logic, and data layers
4. **Responsive Design**: Mobile-first approach with Tailwind CSS
5. **Role-Based Access Control**: Different views for students and administrators

### Design Patterns Used
- **Container/Presentational Pattern**: Separation of data fetching and UI rendering
- **Custom Hooks**: Reusable logic encapsulation
- **Context API**: Global state management
- **Higher-Order Components**: Cross-cutting concerns like authentication
- **Service Layer**: Abstraction of API calls

### Folder Structure and Organization
```
src/
├── components/          
│   ├── adminDashboard/  # Admin-specific UI components
│   ├── common/          # Shared/reusable components
│   ├── dashboard/       # Dashboard layout components
│   ├── layout/          # Global layout components (header, footer)
│   ├── sections/        # Page section components
│   └── studentDashboard/# Student-specific UI components
├── contexts/            # React context providers for state management
├── hooks/               # Custom React hooks for reusable logic
├── pages/               # Page-level components that correspond to routes
├── services/            # API service layers and business logic
├── utils/               # Utility functions and helpers
├── App.jsx              # Main application component with routing
├── main.jsx             # Application entry point
└── index.css            # Global styles
```

### State Management
- **React Context API**: For global state like user authentication
- **Component State**: For local UI state management
- **Service Layer State**: For API response caching and error handling

### Data Flow
```
User Action → Component → Service Layer → API → Service Layer → Context → Component → UI Update
```

## 🏗️ Technologies

- **Framework**: React 19 with Vite
- **Language**: JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Notifications**: react-hot-toast
- **Payment Processing**: Stripe Elements
- **Build Tool**: Vite
- **Form Handling**: Controlled components with validation
- **Real-time**: WebSocket integration

## ⚙️ Environment Configuration

The frontend application requires certain environment variables. Create a `.env` file in the frontReact root directory:

### Required Environment Variables

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:9090

# Stripe Public Key (for payment processing)
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## ▶️ Running the Application

### Prerequisites
- Node.js 16+
- npm or yarn

### Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables** in a `.env` file:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

   The application will be available at http://localhost:5173

### Building for Production

1. **Create a production build**:
   ```bash
   npm run build
   ```

2. **Preview the production build**:
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── adminDashboard/  # Admin-specific components
│   ├── common/          # Shared components
│   ├── dashboard/       # Dashboard components
│   ├── layout/          # Layout components (header, footer)
│   ├── sections/        # Page sections
│   └── studentDashboard/# Student-specific components
├── contexts/            # React context providers
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── services/            # API service layers
├── utils/               # Utility functions
├── App.jsx              # Main application component
├── main.jsx             # Application entry point
└── index.css            # Global styles
```

## 🎨 UI Components

### For Students:
- Multi-step enrollment form (5 steps)
- Dashboard with enrollment status
- Program browsing and details
- Document upload interface
- Payment processing
- Notifications center

### For Administrators:
- Dashboard with statistics
- Enrollment management
- User management
- Program management
- Module management
- Notification system

## 🔄 API Integration

The frontend communicates with the backend API through service files located in `src/services/`. All API calls are handled by these service files which use Axios for HTTP requests.

### Base Configuration
The API base URL is configured through the `VITE_API_BASE_URL` environment variable.

### Authentication
- JWT tokens are stored in localStorage
- Authentication state is managed through React Context
- Protected routes are implemented with a ProtectedRoute component

## 🎨 Styling

The application uses Tailwind CSS for styling with a consistent design system:
- Responsive design for all screen sizes
- Consistent color palette
- Reusable component classes
- Dark mode support where applicable

## 🧪 Testing

Run the test suite:

```bash
npm run test
```

## 🛠️ Development Tools

- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast development server with HMR

## 📖 Documentation

### Component Documentation
Each major component has inline documentation explaining its purpose and usage.

### Service Documentation
API service files contain documentation for each endpoint and its expected parameters.

## 🚀 Deployment

The application can be deployed to any static hosting service (Netlify, Vercel, etc.) since it's a client-side React application.

### Environment-specific Builds
Different environments can be configured by changing the `VITE_API_BASE_URL` variable:
- Development: http://localhost:9090
- Production: https://your-production-api.com

## 🤝 Integration Points

- **Backend**: Spring Boot REST API
- **Authentication**: JWT-based authentication
- **Payment Processing**: Stripe Elements
- **Notifications**: Toast notifications via react-hot-toast

## 📞 Support

For issues or questions regarding the frontend, please contact the development team.