## Self-hosted website for reading local manga 📚

### Features ✨

- [x] Read manga from /public folder 📖
- [x] Minimalistic UI 🎨
- [x] Resume reading with the last read page (local storage) 📌
- [x] Image preloading & optimization for faster navigation 🚀
- [x] Keyboard navigation (left/right arrow keys) ⌨️
- [x] Mobile friendly 📱
- [x] Black mode for OLED screens 🌑
- [x] Reel full screen mode using all available space for the images 🖼️

### Languages 🌐

- [x] French (fr) 🇫🇷
- [ ] English (en) (work in progress) 🚧

### How to use 🚀

You need to rename your manga folder to the name of the manga and in there are the Tome folders named like "Tome 01", "Tome 02", etc. Inside the Tome folders are the images of the pages which should be named like "1-001.webp", "1-002.webp", etc (the first number is the chapter and the second is the page number).
I recommend using AI like ChatGPT to create a python script to rename the images for you and convert if it's needed to webp format.
Next put the manga folder in the public folder of the project and make an `npm run build` and an `npm run start` to start the server, and you can read your manga on localhost:3000. 🚀
