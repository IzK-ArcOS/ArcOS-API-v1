# ArcOS Backend API
This API is used by the ArcOS frontend to access the file system and store user preferences in one centralized location.

## Running the API
### Dependencies
You must have the following components installed on your **linux** machine:
* Git (https://git-scm.com/)
* NodeJS (https://nodejs.org/)
* NPM or Yarn

### Installing
Follow these steps to build and run the ArcOS API. Do note that this API runs on NodeJS on port **3333**, make sure this port is free before you begin.
```sh
  # Clone the repository:
  $ git clone git@github.com:IzK-ArcOS/ArcOS-API-v1
  
  # Change to the API directory
  $ cd ArcOS-API-v1
  
  # Create the database and filesystem directories
  $ mkdir {db,fs}
  
  # Satisfy NPM dependencies
  $ npm i
  
  # Start the API on port 3333
  $ npm start
```

## Proxying with NGINX
You can proxy the ArcOS API like any other REST API as follows:
```
// . . .

http {
  // . . .
  
  server {
    listen 80;
    listen [::]:80;
    
    server_name subdomain.example.com;
    
    location / {
      proxy_pass http://localhost:3333;
    }
  }
  
  // . . .
}
```

## License
This project is licensed under GPLv3.
