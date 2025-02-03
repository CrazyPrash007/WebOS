# Web-Based Windows GUI

This project is a browser-based operating system interface that mimics the functionality of a desktop operating system. It includes features such as a desktop with icons, a taskbar, window management, and various applications.

## Features

- Desktop environment with draggable icons
- Taskbar with start menu and application shortcuts
- Window management (open, close, minimize, maximize)
- File system with file explorer
- Text editor
- Calculator
- Terminal
- Screen capture tool
- Tic-Tac-Toe game
- Tabbed interface
- Theme toggling (light/dark mode)
- Notification system

## Technologies Used

- **Next.js**: React framework for server-side rendering and static site generation
- **React**: JavaScript library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Radix UI**: Primitives for building accessible and customizable UI components
- **Lucide Icons**: Icon library for React
- **html2canvas**: Library for capturing screenshots
- **react-rnd**: Library for resizable and draggable components
- **CryptoJS**: Library for encryption and decryption
- **react-hook-form**: Library for managing form state
- **react-day-picker**: Library for date picking
- **react-toast**: Library for toast notifications
- **Embla Carousel**: Library for building carousels
- **Dnd Kit**: Library for drag-and-drop interactions

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

## Installation

To install and run this project, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/CrazyPrash007/WebOS.git
   ```

2. Navigate to the project directory:
   ```
   cd Web-Based-Windows-GUI-
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Create a `.env.local` file in the root directory and add any necessary environment variables:
   ```
   NEXT_PUBLIC_API_URL=your_api_url_here
   ```

5. Build the project:
   ```
   npm run build
   ```

6. Start the production server:
   ```
   npm start
   ```

   Or, for development:
   ```
   npm run dev
   ```

7. Open your browser and visit `http://localhost:3000` to see the application running.

## Configuration

`next.config.mjs`
The Next.js configuration file includes settings for ESLint, TypeScript, and image optimization. It also merges user-specific configurations if available.

`package.json`
Contains the project metadata, scripts, and dependencies. Key scripts include:

`dev`: Starts the development server.
`build`: Builds the project.
`start`: Starts the production server.
`lint`: Runs ESLint.

## Usage

## Desktop Environment

The desktop environment includes draggable icons and a taskbar with application shortcuts. You can open, close, minimize, and maximize windows.

## Applications
The project includes several built-in applications:

**File Explorer**: Manage files and folders.
**Text Editor**: Edit text files.
**Calculator**: Perform basic calculations.
**Terminal**: Execute commands.
**Screen Capture**: Capture screenshots.
**Tic-Tac-Toe**: Play the Tic-Tac-Toe game.
**Snake Game**: Play the Snake game.
**Theme Toggling**: Toggle between light and dark modes using the theme provider.

## Notification System
Receive and manage notifications within the application.

## Contributing
Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## Acknowledgements

- Next.js
- React
- Tailwind CSS
- Radix UI
- Lucide Icons

## Contact
For any inquiries, please contact the project maintainer at prashantkr.sharma07@gmail.com. ```