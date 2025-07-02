# BLETalk
_Connecting Devices, Empowering Innovation Seamlessly_

<p align="center">
  <img src="assets/icon.png" alt="BLETalk Application Icon" width="150" />
</p>

![Last Commit](https://img.shields.io/github/last-commit/BirdRa1n/BLETalk?style=flat&logo=git&logoColor=white&color=0080ff)
![Top Language](https://img.shields.io/github/languages/top/BirdRa1n/BLETalk?style=flat&color=0080ff)
![Language Count](https://img.shields.io/github/languages/count/BirdRa1n/BLETalk?style=flat&color=0080ff)

_Built with the following tools and technologies:_

![JSON](https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E.svg?style=flat&logo=Prettier&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black)
![Ajv](https://img.shields.io/badge/Ajv-23C8D2.svg?style=flat&logo=Ajv&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-000020.svg?style=flat&logo=Expo&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3.svg?style=flat&logo=ESLint&logoColor=white)
![date-fns](https://img.shields.io/badge/datefns-770C56.svg?style=flat&logo=date-fns&logoColor=white)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**BLETalk** is a powerful React Native toolkit designed to streamline Bluetooth Low Energy (BLE) interactions in cross-platform mobile applications. It enables developers to create connected apps with seamless device management, real-time messaging, and a polished, customizable UI. Built for scalability and developer experience, BLETalk supports iOS, Android, and web platforms via Expo.

**Why Choose BLETalk?**

BLETalk combines robust BLE functionality with a modern development stack, making it ideal for rapid prototyping and production-ready IoT or connected mobile applications. For a complete BLE testing experience, pair BLETalk with its companion firmware project, [**BLETalk_ESP32**](https://github.com/BirdRa1n/BLETalk_ESP32), which demonstrates BLE communication with an ESP32 device.

---

## Features

- 🧩 **Effortless BLE Management**: Scan, pair, and communicate with BLE devices using an intuitive API.
- 🌈 **Cross-Platform Styling**: Achieve a consistent look with Tailwind CSS, NativeWind, and Expo configurations.
- 📱 **Reusable UI Components**: Modular buttons, containers, headers, and navigation for rapid development.
- 🚀 **Developer-Friendly Tools**: TypeScript, ESLint, Prettier, and Babel ensure clean, maintainable code.
- 🔒 **Permissions & Notifications**: Simplified handling of Bluetooth, location permissions, and background notifications.
- ⚙️ **Flexible Architecture**: Configurable setup for iOS, Android, and web with minimal overhead.
- 🌙 **Light & Dark Mode**: Automatically adapts to the device's theme settings for a seamless user experience.

---

## Screenshots

Explore BLETalk's user interface in both light and dark modes:

| Home Screen (Light) | Home Screen (Dark) | Device Details (Light) | Device Details (Dark) |
|---------------------|--------------------|------------------------|-----------------------|
| ![Home Screen Light](screenshots/IMG_0076-portrait.png) | ![Home Screen Dark](screenshots/IMG_0072-portrait.png) | ![Device Details Light](screenshots/IMG_0077-portrait.png) | ![Device Details Dark](screenshots/IMG_0075-portrait.png) |
| *List of BLE devices in light mode* | *List of BLE devices in dark mode* | *Device details in light mode* | *Device details in dark mode* |

*Note*: Two additional screenshots (`IMG_0076-portrait.png`, `IMG_0077-portrait.png`) are available and can be added upon request.

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js**: Version 16 or higher
- **npm**: Version 8 or higher
- **TypeScript**: For type-safe development
- **Expo CLI**: For running and building the app (`npm install -g expo-cli`)
- **Git**: For cloning the repository

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/BirdRa1n/BLETalk
   cd BLETalk
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Environment**:

   - Create a `.env` file in the project root for BLE or API configurations (e.g., `BLE_UUID` for service UUIDs, if required).
   - Ensure Bluetooth and location permissions are enabled in your development environment (check Expo documentation for setup).

### Usage

1. **Run the App**:

   ```bash
   npm start
   ```

   Use Expo CLI to launch the app on iOS, Android, or web via the Expo Go app or a browser.

2. **Build for Production**:

   ```bash
   expo build:android
   expo build:ios
   ```

### Testing

Run tests to ensure functionality:

```bash
npm test
```

For linting and formatting:

```bash
npm run lint
npm run format
```

---

## Contributing

We welcome contributions to BLETalk! To contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m "Add YourFeature"`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

Please adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) and ensure your code follows the project's ESLint and Prettier configurations.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
