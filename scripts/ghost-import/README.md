# Ghost Import Scripts

This directory contains scripts for importing content from an existing Ghost blog into the new Markdown-based blog system hosted on GitHub Pages.

## Overview

The import process involves three main scripts:

1. **import.js**: The main script that orchestrates the import process. It handles the overall workflow of importing posts, pages, and other content from the Ghost blog.

2. **transform.js**: This script contains functions that transform the content retrieved from the Ghost blog into the Markdown format used by the new blog system. It ensures that all necessary metadata and formatting are preserved during the conversion.

3. **download-images.js**: This script is responsible for downloading images from the Ghost blog and saving them in the appropriate format for the new blog. It ensures that all media assets are correctly linked in the imported content.

## Setup Instructions

To set up the import process, follow these steps:

1. **Clone the Repository**: Start by cloning the repository containing the new blog system to your local machine.

2. **Install Dependencies**: Navigate to the project directory and install any required dependencies. If you're using Node.js, you may need to run:
   ```
   npm install
   ```

3. **Configure Ghost API**: Update the configuration in `import.js` to include your Ghost blog's API URL and access credentials.

4. **Run the Import**: Execute the import script to start the process. You can run the script using Node.js:
   ```
   node scripts/ghost-import/import.js
   ```

## Usage Examples

- To import all posts from your Ghost blog, simply run the import script as described above.
- If you need to customize the import process, you can modify the functions in `transform.js` to suit your formatting needs.

## Notes

- Ensure that your Ghost blog is accessible and that you have the necessary permissions to retrieve content.
- Review the imported content in the `_posts` directory to verify that everything has been imported correctly.

For further assistance, please refer to the main README file or consult the documentation for each individual script.