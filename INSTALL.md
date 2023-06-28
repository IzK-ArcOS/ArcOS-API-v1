# Installing ArcAPI

Thank you for trying out ArcAPI: the API that powers the ArcOS project. Before we begin, please check that the following prerequisites are met:

- NodeJS version 18 or higher (check the version with `node -v`)
- Git for cloning the repository
- (optional) NGiNX or another web server if you want to port forward the API through a subdomain

## Installing

Choose the instructions that match your operating system:

<details>
  <summary>Installing on Windows</summary>

> NOTE: Before you continue, please make sure you meet the prerequisites mentioned above.

First, clone the repository:

```batch
git clone https://github.com/IzK-ArcOS/ArcOS-API-v1
```

Next, you'll need to create the data directories:

```batch
mkdir fs
mkdir db
```

Finally, satisfy the packages and run the API on port 3333:

```batch
npm install
npm start
```

> NOTE: Running the API will fail if the Node version is too old

</details>

<details>
  <summary>Installing on Linux</summary>
  
  
> NOTE: Before you continue, please make sure you meet the prerequisites mentioned above.

First, clone the repository:

```bash
git clone https://github.com/IzK-ArcOS/ArcOS-API-v1
```

Next, you'll need to create the data directories:

```bash
mkdir {fs,db}
```

Finally, satisfy the packages and run the API on port 3333:

```bash
npm install
npm start
```

> NOTE: Running the API will fail if the Node version is too old

</details>

## Troubleshooting

Does the API not start properly? Here are some steps you can take to troubleshoot the API:

#### Try running it again

NodeJS is a weird thing, so try running `npm start` again to see if that resolves the issue.

#### Check your NodeJS version

Enter `node -v` in your Terminal or CMD window and verify that it is above version `18.x.x`. If not, upgrade NodeJS, and try again.

#### Node gave back an `EACCESS` error

This means that NodeJS or ArcAPI doesn't have permission to access the filesystem. Neither try to install anything system-wide, so please make sure that you have permission to alter the contents of the directory that ArcAPI is hosted in, and then try again.

#### None of these worked for me

That's... not good. That means you've found a bug that hasn't yet been resolved. The best thing you can do now is [Create an Issue](https://github.com/IzK-ArcOS/ArcOS-API-v1/issues/new) and/or to talk to us about the problem on our Discord server [here](https://discord.gg/ARjRM6uNqf), channel `#⚠️-troubleshooting`
