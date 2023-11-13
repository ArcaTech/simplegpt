# simplegpt

It's just a simple ChatGPT frontend. Does text conversation and image generation.


## Setup/Building/Running

### .env File

Create an .env file in the root of the project with the following variables:

- OPENAI_KEY
- DEFAULT_CHAT_MODEL (gpt-3.5-turbo is recommended)
- DEFAULT_IMAGE_MODEL (dall-e-2 is recommended)
- SERVER_PORT (default 3000)


### Building the frontend

Run `npm run build` whenever you make changes to anything on the frontend (in src/app).


### Web Server

Run `npm install` to pull the dependencies, then `npm run serve` to start/restart the web server (which is in /src/server).


### Usage

Once the server is running, go to https://localhost:3000 (or whatever port you used) to view the page.



## Technical

### Overview

SimpleGPT is a web app with a React frontend and Express (Node.js) backend. The backend exposes three API endpoints (`/chat`, `/chat-stream`, and `/image`) for the frontend to use. Those backend API endpoints themselves call the OpenAI APIs.

The app was set up this way so that it can be safely deployed on the web without exposing the OpenAI API key to users. The backend also exposes an easier interface to the OpenAI API to the frontend.

Both the frontend and backend use Typescript. The code for both are in seperate directories, but there is a shared directory of Typescript types (`src/types`) that they both use.


### Frontend

The frontend (`src/app`) is a standard Typescript React app. The build process transpiles the Typescript code to Javascript, and the SCSS files to CSS. The entry point is at `src/app/index.tsx`.


### Backend

The backend (`src/server/index.ts`) is a standard Express backend that serves the frontend files (HTML, Javascript, CSS), and exposes three API endpoints for the frontend.
