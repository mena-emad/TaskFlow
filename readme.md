# TaskFlow — Smart To-Do List App

A modern, responsive task management application built with **HTML, CSS, and Vanilla JavaScript**. TaskFlow helps users organize their daily tasks, track progress, manage deadlines, and stay productive through a clean and intuitive interface.

## ✨ Features

- **Create Tasks:** Add tasks with a title, category, and due date.
- **Task Categories:** Organize tasks into Work, Study, Personal, and Other.
- **Task Completion:** Mark tasks as completed or active.
- **Delete Tasks:** Remove tasks you no longer need.
- **Search Tasks:** Find tasks instantly by title.
- **Filter Tasks:** View all tasks, active tasks, or completed tasks.
- **Persistent Storage:** Save tasks in the browser using `localStorage`.
- **Live Statistics:** Track total, active, and completed tasks.
- **Responsive Design:** Use the application across desktop, tablet, and mobile screen sizes.
- **Safe Rendering:** Render task titles using DOM APIs and `textContent` to reduce the risk of HTML injection.

## 🛠️ Built With

- **HTML5** — Semantic page structure and forms.
- **CSS3** — Responsive layouts, styling, animations, and visual effects.
- **JavaScript (ES6+)** — Application logic, DOM manipulation, event handling, and task management.
- **Web Storage API** — Persistent client-side data storage.

## 📸 Screenshots

Add screenshots of your application here.

```md
![TaskFlow Dashboard](./screenshots/dashboard.png)
```

To display a screenshot, create a `screenshots` folder in the project directory and place your image inside it.

## 🚀 Getting Started

### Prerequisites

You only need a modern web browser. No backend, database server, package installation, or build tools are required.

### Installation

1. Clone the repository:

   ```bash
   git clone YOUR_REPOSITORY_URL
   ```

2. Navigate to the project directory:

   ```bash
   cd todo-app
   ```

3. Open `index.html` in your browser, or launch the project using the **Live Server** extension in Visual Studio Code.

## 📂 Project Structure

```text
todo-app/
├── index.html    # Application structure
├── style.css     # Styling and responsive design
├── main.js      # Task management and application logic
└── README.md    # Project documentation
```

## 💡 How It Works

### Task Management

Each task contains an identifier, title, category, due date, and completion status.

```js
{
  id: crypto.randomUUID(),
  title: "Complete JavaScript practice",
  category: "Study",
  dueDate: "2026-10-25",
  completed: false
}
```

### Data Persistence

Task data is serialized into JSON and stored in the browser's `localStorage`. The application loads the saved tasks when initialized, allowing them to remain available after refreshing the page in the same browser.

### Search and Filtering

Task visibility is determined by combining the search keyword with the selected status filter. This allows users to search for a task while viewing only active or completed tasks.

## 🔒 Data and Privacy

Task data is stored locally in the browser rather than on a remote server. There is no account system or cloud synchronization. Clearing the browser's site data may remove saved tasks.

## 🎯 Project Goals

This project demonstrates practical frontend development skills, including:

- DOM manipulation and dynamic rendering.
- Array methods such as `map()`, `filter()`, and `find()`.
- Event handling and event delegation.
- CRUD operations.
- Working with browser storage.
- Form validation and user input handling.
- Responsive UI development.
- Safer handling of user-provided text.

## 🔮 Future Improvements

Potential enhancements include:

- Editing existing tasks.
- Sorting tasks by due date.
- Due-date reminders and overdue indicators.
- Drag-and-drop task organization.
- Dark and light theme switching.
- Exporting and importing tasks.
- Backend integration and user authentication.

## 👨‍💻 Author

**Mena Emad Sawares**

- GitHub: [@mena-emad](https://github.com/mena-emad)
- Portfolio: [menaemad.vercel.app](https://menaemad.vercel.app)
- LinkedIn: [Mena Emad](https://www.linkedin.com/in/mena-emad-166649373/)

---

Built with ❤️ using HTML, CSS, and Vanilla JavaScript.
