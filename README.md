# Journal App

A minimal journaling app with a built-in calendar. Each day in the calendar links to an entry that is saved and locally encrypted using AES-GCM.

## Features
- Calendar grid to navigate by month/day  
- Journal entry textarea styled like lined paper  
- Local AES-GCM encryption with PBKDF2 key derivation  
- Entries saved as daily files (`MM-DD-YYYY.txt`)  
- Indicator dot on calendar days with entries  

## Tech Stack
- **HTML5** for structure  
- **CSS3** for styling (responsive grid + lined paper effect)  
- **JavaScript (ES6 modules)** for app logic and encryption  
- **Electron** for local desktop app functionality  
- **Node.js** (`fs`, `path`) for file storage  

## How It Works
1. Select a day from the calendar.  
2. Type your journal entry in the textarea.  
3. Press **Submit** → the text is encrypted and saved into a local file.  
4. If you revisit a day with an entry, it is decrypted and displayed automatically.  

## Encryption Details
- **Algorithm**: AES-GCM (256-bit key)  
- **Key derivation**: PBKDF2 with SHA-256, passphrase + random salt, 200,000 iterations  
- **Salt**: 16 random bytes, unique for every entry file  
- **IV (nonce)**: 12 random bytes per encryption  
- **Output format**: JSON containing Base64-encoded IV, salt, and ciphertext  

## Screenshots
### Calendar View
![Calendar Screenshot](docs\{29437100-04D9-4C0E-9B7E-02AD9A098C0F}.png)

## Usage
1. Clone this repo:  
   ```bash
   git clone https://github.com/yourusername/journal-app.git
   cd journal-app
