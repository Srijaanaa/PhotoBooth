# Photobooth App 

This is a web-based photobooth application built with HTML, CSS, and JavaScript. It allows users to capture single or triple photos using their webcam, apply filters (grayscale, sepia, bright, dark, contrast, blur), flip photos horizontally, and download the captured images. The app is designed to run in any modern web browser and is deployed using GitHub Pages.

## Features
- **Live Webcam Preview**: Displays a real-time feed from your webcam.
- **Capture Modes**: Choose between capturing a single photo or three photos with a countdown.
- **Filters**: Apply filters to photos (No Filter, Grayscale, Sepia, Bright, Dark, Contrast, Blur).
- **Flip Toggle**: Flip photos horizontally.
- **Download Option**: Download captured photos as PNG files.
- **Responsive Design**: Adapts to different screen sizes (stacks vertically on mobile devices).

## Prerequisites
- A modern web browser (e.g., Chrome, Firefox, Edge) with webcam support.
- A webcam connected to your computer.

## Installation
1. **Clone or Download the Repository**:
   - Clone the repository:
     ```
     git clone https://github.com/Srijaanaa/PhotoBooth.git
     ```
   - Replace `your-username` and `your-repository` with your GitHub username and repository name (e.g., `srijana-lohani/srijana-lohani-photobooth`).
   - Alternatively, download the ZIP file from the repository and extract it.

2. **File Structure**:
   - The project includes three files:
     - `index.html`: The main HTML structure.
     - `style.css`: The CSS for styling and layout.
     - `script.js`: The JavaScript logic for webcam access and photo capture.

3. **Deploy to GitHub Pages** (Optional for Local Testing):
   - If you want to host it locally for testing, open `index.html` in a browser.
   - For deployment, follow the GitHub Pages setup below.

## Usage
1. **Run the App**:
   - Visit the deployed site (e.g., `https://your-username.github.io/your-repository/`) after setting up GitHub Pages.
   - Alternatively, open `index.html` in a browser for local testing (note: webcam access may require HTTPS for some features).

2. **Interact with the App**:
   - **Camera Preview**: The left section shows the live webcam feed.
   - **Controls** (below the preview):
     - **Capture Mode Dropdown**: Select "Single Photo" or "Three Photos."
     - **Filter Dropdown**: Choose a filter to apply (No Filter, Grayscale, etc.).
     - **Flip Toggle**: Toggle to flip the photo horizontally.
     - **Capture Button**: Click "Capture Photo(s)" to take photos.
   - **Captured Photo**: The right section displays the captured photo(s) after capture.
   - **Download Button**: Click to download the captured photo(s) as a PNG file.
   - **Countdown**: In triple mode, a 3-second countdown appears before each photo.

3. **Deploy to GitHub Pages**:
   - **Create a Repository**:
     - Log in to GitHub and create a new repository (e.g., `photobooth`).
     - Set it to "Public" and add a README file.
   - **Upload Files**:
     - Upload `index.html`, `style.css`, and `script.js` to the repository root.
     - Commit the changes.
   - **Enable GitHub Pages**:
     - Go to the repository’s “Settings” tab.
     - Scroll to the “Pages” section, select the `main` branch as the source, and save.
     - Wait for deployment (URL will be `https://your-username.github.io/your-repository/`).
   - Test the deployed site in your browser.

## Troubleshooting
- **Webcam Not Working**:
  - Ensure your webcam is connected and not in use by another application.
  - Grant webcam permissions when prompted by the browser.
  - Use HTTPS (e.g., via GitHub Pages) as some browsers block webcam access on HTTP.
  - Check the browser console (right-click > Inspect > Console) for errors (e.g., "Permission denied").
- **Black Screen**:
  - Ensure the `autoplay` attribute is present in the `<video>` tag in `index.html`.
  - Verify `video.play()` is called in `script.js` (already included).
- **Files Not Loading**:
  - Check that `style.css` and `script.js` paths in `index.html` match the repository structure (e.g., update paths if files are in a subfolder).
- **Download Not Working**:
  - Ensure the browser supports the `download` attribute on the `<a>` tag.
  - Test in a different browser if the download fails.

## Limitations
- **HTTPS Requirement**: Webcam access requires a secure context (HTTPS). Local testing may fail unless using a local server (e.g., `python -m http.server`).
- **Performance**: The blur filter can be slow on low-end devices. Consider reducing resolution if needed.
- **Browser Support**: Best tested on Chrome and Firefox. Older browsers may lack full support.

## Contributing
Feel free to fork this project, enhance it (e.g., add more filters or improve UI), and submit pull requests. Bug reports and feature suggestions are welcome!

## License
This project is open-source and available under the MIT License.


---

### How to Use the README
1. **Save the README**:
   - Copy the content from the artifact above and save it as `README.md` in the same directory as `index.html`, `style.css`, and `script.js`.

2. **Add to GitHub Repository**:
   - If you’re using GitHub (e.g., `srijana-lohani/srijana-lohani-photobooth`):
     - Go to your repository on GitHub.
     - Click “Add file” > “Upload files.”
     - Upload `README.md` and commit the changes.
   - GitHub will render the Markdown as the repository’s main page.

3. **Local Use**:
   - Open `README.md` in a Markdown viewer (e.g., VS Code with a Markdown extension) to read the formatted instructions.

---

### Why This README?
- **Project-Specific**: Tailored to the JavaScript photobooth app, including details about GitHub Pages deployment and browser-specific issues.
- **User-Friendly**: Provides clear steps for installation, usage, and troubleshooting, suitable for beginners and developers.
- **Comprehensive**: Covers all key aspects, including limitations and contribution guidelines.

