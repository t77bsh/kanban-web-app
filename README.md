# kanban-web-app

## Overview
 The Kanban web app is an intuitive and user-friendly task management tool designed to help users effortlessly organize and manage tasks for work or personal life. By creating customizable columns to represent various stages of progress, users can add tasks, subtasks, details and track their completion. The app's drag-and-drop interface makes it easy to move tasks between columns as they advance or change status. With the Kanban web app, users can streamline their workflow, stay organized, and effectively manage their projects and to-do lists.
 
### Demo:



### Built with:
Frontend: React JS, TypeScript, Tailwind CSS, Redux, React-beautiful-DnD

Backend: Node, Express, MongoDB, Firebase

# The journey:

Over the past month, I embarked on an exciting journey to create a Kanban web app as part of a portfolio project. Inspired by the simplicity and effectiveness of Kanban boards, I aimed to create a digital version that allows users to manage their tasks efficiently. The tech stack for this project was carefully chosen to provide a smooth and seamless user experience. I used React JS, TypeScript, Tailwind CSS, Redux, React-beautiful-DnD, Node, Express, MongoDB and Firebase to create a complete full-stack application.

### Challenges:

Managing the state of the application was a significant challenge. As the app grew in complexity, it became crucial to keep the state organized and easy to maintain. Initially, I tried to use React's built-in Context API for state management. However, it fell short in handling the increasing complexity with state in non-hierarchical component structures that did not share a parent-child like relation. Redux proved to be an excellent solution for this. It enabled me to manage the global state of the app effectively, making it easier to add new features and track changes while providing a more streamlined way to share state between unrelated components.

Handling errors effectively while making HTTP requests to the backend was crucial for a professional user experience. To tackle this, I implemented comprehensive error handling strategies using try-catch block and backend error handling middleware. This approach allowed me to gracefully catch and manage various error types, such as network issues, server errors, and invalid user inputs. By providing informative error messages and anticipating potential issues, I improved the app's stability and ensured a polished and reliable user experience.

Implementing secure user authentication was essential to ensure the privacy and safety of user data. Firebase provided a reliable and straightforward solution for handling user authentication. With its built-in authentication features and third-party Single Sign-On (SSO) options, I was able to quickly set up a robust sign-up and sign-in process.

Choosing the right database for storing boards data was crucial. MongoDB, with its flexible schema structure and high performance, turned out to be the perfect choice. By using Mongoose as an Object Data Modeling (ODM) library, I was able to create and manage board schemas easily and create intricate sub-schemas that allowed for storage of task details, status and subtasks.

One of the core features of the app is the ability to drag and drop tasks across columns. Implementing this was challenging, the native HTML5 Drag & Drop API lacked the behaviour I required, but react-beautiful-dnd provided an elegant solution. It allowed me to create a seamless and accessible drag-and-drop interface to provide an optimal user experience.

### Takeways & Learnings:

Choose the right tools: Picking the right tech stack and libraries significantly improved the development process. By using tools that are well-suited for the task at hand, I was able to save time and effort and add to my skills stack.

Plan and organize: A well-structured plan and organization is essential for managing complex projects. Breaking down the project by features and setting realistic deadlines helped me stay on track and build a full-stack application without being intimidated by its size.

Be prepared for challenges: Encountering challenges is inevitable when building a web app. Being open to learning from them and finding solutions is crucial for growth as a developer. I learned to train my persistence muscles and not give-up when encountering bugs and issues.

Embrace collaboration: Engaging with the developer community, seeking advice, and sharing knowledge can lead to better solutions and a more enjoyable development experience.
