# My GitHub Blog

Welcome to My GitHub Blog! This project is a Markdown-based blogging system designed to be hosted on GitHub Pages. It allows you to create, manage, and publish blog posts easily while providing a clean and responsive layout.

## Features

- **Markdown Support**: Write your posts in Markdown for easy formatting.
- **Ghost Import**: Import content from an existing Ghost blog using the provided scripts.
- **Customizable Layouts**: Modify the layouts to fit your style with HTML and SASS.
- **SEO Optimization**: Built-in SEO features to enhance visibility.
- **Static Pages**: Create static pages like About, Archive, and Tags.

## Project Structure

- `_posts`: Contains your published blog posts.
- `_drafts`: Contains drafts of posts that are not yet published.
- `_layouts`: HTML layouts for posts and pages.
- `_includes`: Reusable HTML snippets for headers, footers, and navigation.
- `_data`: Configuration data for the site.
- `_sass`: SASS files for styling.
- `assets`: Contains CSS and JavaScript files for the blog.
- `scripts`: Scripts for importing content from Ghost.
- `pages`: Static markdown pages.
- `_config.yml`: Configuration settings for the Jekyll site.
- `Gemfile`: Ruby gems required for the blog.
- `index.html`: The main entry point for the blog.
- `package.json`: JavaScript dependencies and scripts.
- `.github`: GitHub Actions for deployment.
- `.gitignore`: Files to be ignored by Git.

## Getting Started

### Prerequisites

- **Ruby** (with dev headers): On Ubuntu/WSL, run `sudo apt-get install ruby-full build-essential zlib1g-dev`
- **Bundler**: Run `gem install bundler`
- **Node.js** and **npm**

### Setup

1. **Clone the Repository**: Clone this repository to your local machine.
2. **Install Dependencies**: Run `bundle install` to install Ruby gems and `npm install` for JavaScript dependencies.
3. **Run the Blog Locally**: Use `bundle exec jekyll serve` to start a local server and view your blog.
4. **Import Content**: Use the scripts in the `scripts/ghost-import` directory to import content from your existing Ghost blog.

## Deployment

To deploy your blog to GitHub Pages, push your changes to the `main` branch. The GitHub Actions workflow will automatically build and deploy your site.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Acknowledgments

Thanks to the open-source community for providing the tools and resources that made this project possible.