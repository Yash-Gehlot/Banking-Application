🏦 ATM-Integrated Banking System
A comprehensive digital banking solution designed to reduce physical bank branch congestion by enabling customers to access essential banking services directly through ATM terminals.
📋 Problem Statement
The Challenge
Traditional banking systems face a critical bottleneck: long queues at physical bank branches. Customers often wait hours for services that could be digitized, leading to:

⏰ Wasted time for customers
😤 Frustration and poor customer experience
📉 Reduced operational efficiency for banks
🚶 Unnecessary foot traffic to branches
💰 Higher operational costs for banks

The Solution
This project reimagines banking accessibility by creating a full-featured banking system that can be deployed at ATM terminals. Instead of limiting ATMs to cash withdrawal, this system transforms them into comprehensive banking service points where customers can:

Check account balances
Deposit and withdraw money
Transfer funds to other accounts
View complete transaction history
Update profile information
Change passwords
Manage their accounts independently

Result: Customers get 24/7 access to banking services without visiting a branch, while banks reduce operational overhead and improve customer satisfaction.
✨ Features
Core Banking Operations

Account Management

Real-time balance inquiry
Account number display
Profile updates (name, email)


Transactions

Cash deposits
Cash withdrawals (with password verification)
Money transfers between accounts
Complete transaction history with pagination
Transaction categorization (debit, credit, deposit, withdrawal)


Security

JWT-based authentication
Password encryption using bcrypt
Transaction-level database locking
Password verification for sensitive operations


User Experience

Intuitive dashboard interface
Real-time balance updates
Transaction details with party information
Recent transactions overview
Responsive design for ATM screens



🛠️ Technology Stack
Backend

Node.js with Express.js - RESTful API server
MySQL - Relational database
Sequelize ORM - Database management and migrations
JWT - Secure authentication
bcryptjs - Password hashing

Frontend

Vanilla JavaScript - Client-side logic
HTML5 & CSS3 - Modern UI design
Responsive Design - Optimized for ATM terminals

Security

JWT token-based authentication
Password verification for withdrawals and account deletion
Database transactions for consistency
SQL injection prevention through ORM

📁 Project Structure
banking-system/
├── server.js                 # Application entry point
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables
│
├── src/
│   ├── config/
│   │   └── database.js       # Database configuration
│   │
│   ├── models/
│   │   ├── User.js           # User model
│   │   ├── Account.js        # Account model
│   │   ├── Transaction.js    # Transaction model
│   │   └── index.js          # Model relationships
│   │
│   ├── controllers/
│   │   ├── authController.js       # Registration & login
│   │   ├── accountController.js    # Balance, deposit, withdraw
│   │   ├── transactionController.js # Transfers & history
│   │   └── userController.js       # Profile management
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── accountRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js     # JWT verification
│   │   └── errorMiddleware.js    # Global error handler
│   │
│   ├── utils/
│   │   ├── asyncHandler.js       # Async error handling
│   │   └── generateAccountNo.js  # Account number generation
│   │
│   └── views/
│       ├── index.html            # Landing page
│       ├── dashboard.html        # Main dashboard
│       ├── transfer.html         # Money transfer
│       ├── transactions.html     # Transaction history
│       └── profile.html          # User profile
│
└── README.md
🚀 Getting Started
Prerequisites

Node.js (v14 or higher)
MySQL (v5.7 or higher)
npm or yarn package manager

Installation

Clone the repository

bashgit clone <repository-url>
cd banking-system

Install dependencies

bashnpm install

Configure environment variables

Create a .env file in the root directory:
envDB_NAME=banking_system
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
JWT_SECRET=your_jwt_secret_key

Create the database

sqlCREATE DATABASE banking_system;

Start the server

bash# Development mode with auto-restart
npm run dev

# Production mode
npm start
The server will start on http://localhost:3005
📡 API Endpoints
Authentication
POST /auth/register    - Register new user
POST /auth/login       - User login
Account Management
GET    /account/balance          - Get account balance
POST   /account/deposit          - Deposit money
POST   /account/withdraw         - Withdraw money
DELETE /account/delete           - Delete account
Transactions
POST /transactions/transfer      - Transfer money
GET  /transactions/history       - Get transaction history
User Profile
GET  /user/profile               - Get user profile
PUT  /user/profile               - Update profile
PUT  /user/change-password       - Change password
🔒 Security Features

Authentication: JWT tokens with expiration
Password Security: bcrypt hashing with salt rounds
Transaction Safety: Database transactions with rollback
Input Validation: Server-side validation for all inputs
Authorization: Middleware protecting all routes
Password Verification: Required for withdrawals and account deletion

💡 Usage Examples
Register a New User
javascriptPOST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure123"
}
Transfer Money
javascriptPOST /transactions/transfer
Headers: { Authorization: "Bearer <token>" }
{
  "toAccount": 12345,
  "amount": 500
}
View Transaction History
javascriptGET /transactions/history?page=1&limit=10
Headers: { Authorization: "Bearer <token>" }
🎯 Key Benefits
For Customers

✅ 24/7 access to banking services
✅ No waiting in long queues
✅ Complete control over accounts
✅ Instant transactions
✅ Detailed transaction records

For Banks

✅ Reduced branch operational costs
✅ Better resource allocation
✅ Improved customer satisfaction
✅ Scalable digital infrastructure
✅ Enhanced security with digital audit trails

🔮 Future Enhancements

 Mobile app integration
 Bill payment services
 Loan application processing
 Fixed deposit management
 Multi-language support
 Biometric authentication
 Receipt generation
 Statement downloads
 Scheduled transfers
 Budget tracking tools

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
📄 License
This project is open source and available under the MIT License.
👨‍💻 Developer
Yash Gehlot
📞 Support
For support or queries, please create an issue in the repository.

Note: This system is designed for ATM deployment but can also be accessed via web browsers for administrative purposes or as a standalone web banking platform.