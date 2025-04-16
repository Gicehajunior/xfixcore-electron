# xfixcore-electron | Desktop App Boilerplate (Powered by Electron)

A boilerplate to give you a head start in developing your own desktop application using modern technologies.

---

## 🚀 Tech Stack

This boilerplate includes:

- ⚡ **Electron** (for desktop app development)
- 🧠 **Sequelize ORM**
- 🟨 **Node.js**
- 🌐 **Vanilla JavaScript**
- 🎨 **HTML, CSS**, and **Bootstrap**

---

## 🗄️ Supported Databases

Currently tested with:

1. **MySQL**
2. **SQLite**

You can choose your preferred database — both are supported.  
> 🔹 *SQLite* can run in-memory or be stored in the project’s root directory.

_More databases will be supported in future updates._

---

## 🔧 Getting Started

Follow these steps to set up and run the project locally.

---

### 📥 Requirements

Ensure the following are installed:

- [Node.js](https://nodejs.org/en/download/)
- [Git](https://git-scm.com/downloads)

Set up Git on your machine using the [Git First-Time Setup Guide](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup).

---

### 🚦 Installation

1. **Clone the repository:**

   ```bash
   git clone -b main https://github.com/Gicehajunior/app-boilerplate-electron.git
   ```

   _Or download the [ZIP file](https://github.com/Gicehajunior/app-boilerplate-electron/archive/refs/heads/main.zip)_

2. **Move the project** to a directory of your choice.

3. **Open the project** in your preferred IDE.  
   > 💡 Recommended: [Visual Studio Code](https://code.visualstudio.com)

4. **Create a `.env` file** in the root directory.

5. **Copy contents** from `.env-example` into your `.env`.

6. **Set your environment variables** accordingly.

---

### 🧩 Database Configuration
Below include the databases tested on this boilerplate, but not limited on the types of databases the boilerplate supports out of the box

#### ➤ For SQLite:

```env
DB_CONN=sqlite
DB_NAME=your_sqlite_db_name
```

#### ➤ For MySQL:

```env
DB_CONN=mysql
DB_NAME=your_mysql_db_name
```

Choose based on your preference. Both work well.

---

### ▶️ Running the Application

After setup, run the app with:

```bash
cd your_project_directory
npm install
npm run build
npm start   # or use npm run dev for development mode
```

---

## 🧠 Application Architecture

This project follows the **MVC (Model-View-Controller)** pattern.  
Stay tuned to the repository for deeper insights and documentation.

---

## 🤝 Contribution

Want to contribute? Awesome!

- Fork the repo
- Create your branch
- Commit changes
- Submit a pull request

All valid PRs will be reviewed and merged.

---

## 🐞 Issues

Have an issue or suggestion?

- Open an [issue](https://github.com/Gicehajunior/app-boilerplate-electron/issues)
- Constructive feedback is welcome

> ⚠️ _Note: Criticism must be code-related. Irrelevant or personal comments will not be accepted._

---

## 📄 License

This project is licensed under the [MIT License](https://github.com/Gicehajunior/app-boilerplate-electron/blob/main/LICENSE).

---

Happy coding! 🎉
```
