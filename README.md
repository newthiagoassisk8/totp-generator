# TOTP Generator

A modern, responsive web app to generate Time-based One-Time Passwords (TOTP), built with React and TypeScript.

## Video References

- Technical explanation in English: https://www.youtube.com/watch?v=PM2qVtTS474
- Technical explanation in Portuguese: https://youtu.be/KkZsXKPP1R0?si=G_m50jHSX940U-h_

## Related Backend

This frontend has a dedicated backend API available at: https://github.com/newthiagoassisk8/totp-service/

## Project Origin

This frontend repository is a fork of the original project at https://github.com/Rani-Wehbe/totp-generator. The backend is a new, independent project created by `newthiagoassisk8`.

## Features

- **Real-time TOTP generation**: codes update automatically
- **Configurable parameters**:
  - Secret key (Base32-encoded)
  - Digits (6 or 8)
  - Time period (30 or 60 seconds)
  - Hash algorithm (SHA1, SHA256, SHA512)
- **Responsive design**: works on desktop, tablet, and mobile
- **Modern UI**: clean interface with smooth animations
- **TypeScript**: full static typing and improved DX

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build tool**: Vite
- **TOTP library**: otplib
- **Styling**: CSS3 with modern features and responsive design

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd totp-generator
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser at `http://localhost:5173`

### Production Build

```bash
npm run build
```

The output files will be in the `dist` directory.

## Usage

1. **Enter the secret key**: provide your Base32-encoded secret key in the configuration form
2. **Configure parameters**: select the number of digits, time period, and hash algorithm
3. **Generate TOTP**: the app will automatically generate and display TOTP codes
4. **Auto-refresh**: codes update automatically based on the selected period

## Project Structure

```
src/
├── components/
│   └── TOTPGenerator/
│       ├── TOTPGenerator.tsx      # Main component
│       ├── TOTPForm.tsx           # Configuration form
│       ├── TOTPDisplay.tsx        # TOTP display and timer
│       ├── TOTPGenerator.css      # Main styles
│       ├── TOTPForm.css           # Form styles
│       └── TOTPDisplay.css        # Display styles
├── types/
│   └── TOTPTypes.ts               # TypeScript interfaces
├── utils/
│   └── totpUtils.ts               # TOTP generation utilities
├── App.tsx                        # App root component
├── main.tsx                       # Entry point
└── index.css                      # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests, if applicable
5. Open a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Security Note

This app generates TOTP codes locally in your browser. Your secret keys are never sent to external servers. Still, always use it on a trusted device and network.
