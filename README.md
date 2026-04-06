# 📊 Personal Finance Dashboard

A modern, responsive, and interactive frontend application designed to help users track their financial activity, visualize spending patterns, and manage transactions. 

This project was built to demonstrate proficiency in frontend architecture, state management, component modularity, and modern UI/UX principles.

## ✨ Key Features

* **📈 Dashboard Overview**: A high-level summary of financial health, including Total Balance, Income, and Expenses, supported by responsive data visualizations.
* **💳 Transaction Management**: A unified "Statement" view combining both income and expenses. Features include pagination, type filtering, and a robust search engine that parses descriptions, amounts, and categories.
* **🔍 Global Search via URL Sync**: The sidebar includes a global search bar that synchronizes directly with URL parameters (`?search=term`). This allows for deep-linking and ensures the state is preserved across reloads.
* **🔐 Simulated Role-Based Access Control (RBAC)**: 
    * **Admin Role**: Has full CRUD capabilities (Add, Edit, Delete transactions).
    * **User Role**: Has read-only access (Viewer mode).
    * *Note: Roles can be hot-swapped dynamically in the User Profile page for demonstration purposes.*
* **🌗 Interactive Theming**: A physics-based, pull-string theme toggle (built with Framer Motion) that smoothly transitions the app between Light and Dark modes.
* **📥 Export to CSV**: Users can instantly export their currently filtered transaction views into a `.csv` file using native browser Blob generation.
* **🎨 Responsive Layout**: Built with a mobile-first approach. Features a collapsible sidebar, fluid grids, and adaptive tables to ensure a seamless experience on both desktop and mobile devices.

---

## 🛠️ Tech Stack

* **Framework**: React 18
* **Routing**: React Router v6 (using `createBrowserRouter` for modern data-routing)
* **Styling**: Tailwind CSS & DaisyUI (for consistent, themeable utility components)
* **Data Visualization**: Recharts (for dynamic, scalable SVG charts)
* **Animations**: Framer Motion (physics-based interactions and smooth UI transitions)
* **Icons**: React Icons (`fa` and `io5` sets)

---

## 🏗️ Architecture & State Management

To keep the application highly modular and scalable without introducing unnecessary boilerplate (like Redux), state is managed using the **React Context API**.

1.  **`DataContext`**: Serves as the single source of truth for the application's mock financial data (Income, Expenses, Settings, User Profile). It provides custom hooks (`useData`) to allow deeply nested components to read and mutate financial records without prop drilling.
2.  **`AuthContext`**: Manages the simulated user session and current RBAC role. It determines which UI elements (like Edit/Delete buttons and Add forms) are rendered to the DOM.

**Component Modularity**: 
Complex UI elements have been abstracted into reusable components. For example, the `EditTransactionModal` is a single, generic component shared across the Statement, Income, and Expenses pages, automatically adapting its form fields based on the transaction type passed to it.

---

## 🚀 Setup & Installation

To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <project-folder-name>
Install dependencies:

Bash
npm install
# or
yarn install
Start the development server:

Bash
npm run dev
# or
yarn dev
Open your browser:
Navigate to http://localhost:5173 (or the port specified in your terminal).

🔑 Demo Credentials
To evaluate the Role-Based Access Control (RBAC) features, please use the following mock credentials on the Login screen:

Admin Access (Full CRUD Permissions):

Email: admin

Password: admin

User Access (Read-Only Viewer):

Email: user

Password: user

(Note: Once logged in, you can also seamlessly toggle between roles directly from the User Profile page without needing to log out!)

💡 Design & UX Decisions
Empty States: The application handles empty data sets gracefully. If a search yields no results, a clean, formatted "Not Found" UI is presented rather than an empty table or broken layout.

Color Psychology: The application utilizes a deliberate color palette. Income is heavily associated with greens/primary colors, while Expenses utilize warm reds/oranges to allow users to visually distinguish financial flow at a glance.

Non-Blocking Updates: When utilizing the global search or filtering, the table updates in real-time on keystroke without requiring a hard page reload or form submission, providing a highly responsive "app-like" feel.

Effect Optimization: React useEffect cascades were actively avoided. Search and pagination resets are handled synchronously during the render phase or within event handlers to ensure maximum performance.

📂 Project Structure Overview
Plaintext
src/
├── Components/       # Reusable UI elements (SideBar, Modals, Chart Widgets)
├── Context/          # Global State Management (DataContext, AuthContext, ThemeContext)
├── Error/            # Custom Error Boundary pages (404 Page Not Found)
├── Layouts/          # Structural wrappers (MainLayout combining Sidebar & Outlet)
├── pages/            # Core route views (Summary, Statement, Income, Expenses, User)
└── App.jsx           # Application entry point and Provider wrapping