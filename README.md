# How to run

- [Install Git](https://git-scm.com/downloads)
- Verify installation
  ```bash
  git --version
  ```
- Configure git
  ```bash
  git config --global user.name "Your Name" &&
  git config --global user.email "youremail@gmail.com" &&
  git config --global init.defaultBranch main
  ```
- Clone the repository
  ```bash
  git clone https://github.com/mrpraajeet/Studemy.git
  ```
- [Install Node.js](https://nodejs.org/en)
- Verify installation
  ```bash
  node --version &&
  npm --version
  ```
- [Create a MongoDB Atlas account](https://cloud.mongodb.com)
- Create a project and a cluster for it
- Copy the connection string from Overview menu
- [Create a Cloudinary account](https://cloudinary.com)
- Create a product
- Generate API key and copy it along with Secret
- [Create a Razorpay account](https://razorpay.com)
- Generate API key and copy it along with Secret
- Create a .env file inside backend
- Add the following environment variables to it
  ```dotenv
  PORT=8080
  
  #Any random string
  JWT_SECRET=...
  
  #Paste the necessary details obtained from previous steps
  MONGODB_URL=...
  CLOUDINARY_CLOUD_NAME=...
  CLOUDINARY_API_KEY=...
  CLOUDINARY_API_SECRET=...
  RAZORPAY_KEY_ID=...
  RAZORPAY_KEY_SECRET=...
  ```
- [Install Docker](https://docs.docker.com/engine/install/)
- Verify installation
  ```bash
  docker --version
  ```
- Build the image
  ```bash
  docker build -t imagename --no-cache=true . 
  ```
- Run a container
  ```bash
  docker run --name containername --env-file ./backend/.env -p 8080:8080 imagename
  ``` 
- View the app in [localhost](http://localhost:8080)
- Stop the container
  ```bash
  docker stop containername
  ```
- (Optional) Run the container again
  ```bash
  docker start containername
  ```
- (Optional) Make changes to the app and build again
