# ArcOS Backend API

> **NOTE**: This API is outdated and should not be used. Please use [v2](https://github.com/IzK-ArcOS/ArcOS-API-Rewritten).

This API is used by the ArcOS frontend to access the file system and store user preferences in one centralized location.

## Running the API

You can find detailed installation instructions for your operating system at [INSTALL.md](./INSTALL.md)

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
