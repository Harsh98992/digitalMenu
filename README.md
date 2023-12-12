# DigitalMenu

## Description

This is a website like a digital menu for a restaurant.

## Installation

1. clone the repository
2. run `npm install`
3. run `ng serve` to run the project

or paste the following command in your terminal

```bash
git clone
cd DigitalMenu
npm install
ng serve
```


## firebase setup

<!-- [5:31 PM, 12/11/2023] Himanshu Sharma Depaak Ka Bhai: npm run dev
[5:31 PM, 12/11/2023] Himanshu Sharma Depaak Ka Bhai: firebase use staging
[5:31 PM, 12/11/2023] Himanshu Sharma Depaak Ka Bhai: firebase deploy -->

1. create a firebase project
2. enable firestore and storage
3. create a web app
4. copy the firebase config and paste it in the environment.ts file
5. run `npm run dev` to run the project in development mode
6. run `firebase use staging` to use the staging environment
7. run `firebase deploy` to deploy the project

or paste the following command in your terminal

```bash
npm run dev
firebase use qrsay-c617e --- prod
firebase deploy




```

for staging

```bash
npm run dev
firebase use staging
firebase deploy

```


## Usage

1. go to the login page by visiting the url `localhost:4200/admin/login`
2. login with the credentials
    username: admin
    password: admin
3. after login you will be redirected to the dashboard

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Added some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

## Credits

1. [ngx-scanner-qrcode](https://www.npmjs.com/package/ngx-scanner-qrcode)
