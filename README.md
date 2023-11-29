# Project Name

Webpage Application with map and table

## Installation and Setup

### Prerequisites

- **Node.js:** Ensure Node.js is installed on your system. If not, download and install it from the [Node.js official website](https://nodejs.org/).

### Installation Steps

1. **Clone the Repository:**
    ```bash
    git clone github.com/dspan98/AC_webpage
    ```
2. **Navigate to the Project Directory:**
    ```bash
    cd [project folder path]
    ```
    Change the directory to src (or any other folder within the project should work)
3. **Install Dependencies:**
    ```bash
    npm install
    ```
    This process may take a while
4. **Set Up Google Maps API Key:** You need to set your Google Maps API key. There are two ways to do this:

    a) **Environment Variable (Recommended for Development):**
   
       ```
       $env:VUE_APP_API_KEY='MY_API_KEY'; npm run dev
       ```
       Replace `MY_API_KEY` with the API key.

    b) **.env File:**
       Locate the `.env` file in your project directory (or create one in the project root folder) and modify the line:
   
        ```
       VUE_APP_API_KEY=''
       ```
       to
   
        ```
       VUE_APP_API_KEY='MY_API_KEY'
       ```
       After modifying the `.env` file, start the development server with:
       ```bash
       npm run dev
       ```
##Because this is a public project, I don't feel comfortable leaving my API keys laying around. For my own development environment I added the key within .env file but left it out when I pushed the project to git.##

### Running Tests

I also added some jest testing setup, run tests using the command:
```bash
npm test
```
