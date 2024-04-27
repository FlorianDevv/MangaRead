# Manga Reader 📚

![GitHub stars](https://img.shields.io/github/stars/FlorianDevv/MangaRead?style=social)
![GitHub forks](https://img.shields.io/github/forks/FlorianDevv/MangaRead?style=social)
![GitHub issues](https://img.shields.io/github/issues/FlorianDevv/MangaRead)
![GitHub pull requests](https://img.shields.io/github/issues-pr/FlorianDevv/MangaRead)
![GitHub License](https://img.shields.io/github/license/FlorianDevv/MangaRead)

A self-hosted website for reading local manga and watching anime videos.

![Manga Reader](readme/image/pres.webp)

## Table of Contents

- [Manga Reader 📚](#manga-reader-)
  - [Table of Contents](#table-of-contents)
  - [Status 🚦](#status-)
  - [Features ✨](#features-)
  - [Upcoming Features 📅](#upcoming-features-)
  - [Usage 🚀](#usage-)
    - [Manga](#manga)
    - [Anime](#anime)
  - [Self-Hosting 🖥️](#self-hosting-️)
  - [Contributing 🤝](#contributing-)
  - [Contributors ✨](#contributors-)
  - [Tech Stack 🛠️](#tech-stack-️)
  - [Lighthouse 🦅](#lighthouse-)
  - [License 📝](#license-)

## Status 🚦

🚧 WORK IN PROGRESS 🚧

_Please note that this project is currently under active development. The project's architecture and other aspects may undergo changes, which could potentially break some functionalities, particularly those related to files in the `/public` directory._

## Features ✨

- Read manga from /public folder 📖
- Watching anime videos 📺
- Automatically bookmark your last read page or the second where you paused watching, allowing you to resume seamlessly (utilizing local storage). 📌
- Image preloading & optimization for faster navigation 🚀
- Keyboard navigation (left/right arrow keys) ⌨️
- Mobile App PWA 📱
- Full screen mode using all available space for the images 🖼️
- Advanced search bar 🔎
- English, french and custom language support 🌐
- .env file for preselected settings ⚙️

## Upcoming Features 📅

- Docker for self-hosting 🐳

## Usage 🚀

> Note: For a practical example of a manga and anime folder structure, refer to the public folder of this project. You can have a folder who have a manga and anime folder inside it.

### Manga

Follow these steps to set up your manga:

1. Rename your main manga folder to match the name of the manga. Inside this main folder, create another folder named "manga". Within this "manga" folder, create subfolders for each volume, following the naming convention "Volume 01", "Volume 02", and so on.
2. Within each volume folder, add the images for each page. The images should be named in the format "01-001.webp", "01-002.webp", etc. The first number represents the chapter, while the second number represents the page number.

### Anime

Follow these steps to set up your anime:

1. Rename your main anime folder to match the name of the anime. Inside this main folder, create another folder named "anime". Within this "anime" folder, create subfolders for each season, following the naming convention "Season 01", "Season 02", and so on.
2. Within each season folder, add the video files for each episode. The video files should be named in the format "01-001.mp4", "01-002.mp4", etc. The first number represents the season, while the second number represents the episode number.

After setting up your manga and anime folders, you can run the following commands to install dependencies, build the project, and start the server:

```bash
npm install
npm run build
npm run start
```

> Note: You have to rebuild the project every time you add a new manga but for anime videos you don't have to rebuild the project since the videos are loaded dynamically via api.

> Tips: You can use AI like ChatGPT to create a python script to rename the images for you and convert them to webp format if needed.

## Self-Hosting 🖥️

Support for Docker is currently under development. In the meantime, you can host the website on your own server by following the usage instructions provided above.

## Contributing 🤝

We love contributions from everyone. Here are a few guidelines to help you get started:

1. **Fork the Repository**: Start by forking this repository to your own GitHub account. This allows you to propose changes and create Pull Requests.

2. **Clone the Repository**: After forking, clone the repository to your local machine to start making changes. Use `git clone https://github.com/<your-username>/<repo-name>.git` to clone the repository.

3. **Create a New Branch**: Always create a new branch for your changes. This keeps the project history clean and makes it easier to manage your changes. Use `git checkout -b <branch-name>` to create and switch to a new branch.

4. **Make Your Changes**: Make your changes in the new branch. Try to keep your changes small and focused on fixing a specific issue or adding a specific feature.

5. **Commit Your Changes**: After making your changes, commit them to your branch. Write a clear and concise commit message describing what changes you made.

6. **Push Your Changes**: After committing your changes, push them to your fork on GitHub. Use `git push origin <branch-name>` to push your changes.

7. **Create a Pull Request**: Once your changes are pushed, navigate to your fork on GitHub and click the "New Pull Request" button. Fill out the Pull Request template and then submit the Pull Request.

## Contributors ✨

<a href="https://github.com/FlorianDevv/MangaRead/graphs/contributors" style="display: flex; justify-content: center;">
  <img src="https://contrib.rocks/image?repo=FlorianDevv/MangaRead" />
</a>

## Tech Stack 🛠️

This project uses the following technologies:

- ![Next.js](https://img.shields.io/badge/-Next.js-000000?style=flat&logo=next.js)
- ![React](https://img.shields.io/badge/-React-61DAFB?style=flat&logo=react&logoColor=white)
- ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
- ![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
- ![shadcn/ui](https://img.shields.io/badge/-Shadcn/ui-000000?style=flat&logo=shadcn/ui&logoColor=white)

## Lighthouse 🦅

![Lighthouse Image](readme/image/lighthouse.png)
Performance is the main focus of this project to ensure a smooth reading experience. The website is optimized for mobile and desktop devices, with a focus on image optimization and preloading.

## License 📝

This project is licensed under the terms of the [MIT license](LICENSE).
