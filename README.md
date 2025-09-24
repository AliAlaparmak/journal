A minimal journaling app with a built-in calendar. Each day in the calendar links to an entry that is saved and locally encrypted using AES-GCM.

## Features
- Calendar grid to navigate by month/day  
- Journal entry textarea styled like lined paper  
- Local AES-GCM encryption with PBKDF2 key derivation  
- Entries saved as daily files (`MM-DD-YYYY.txt`)  
- Indicator dot on calendar days with entries  

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
