# Proofpoint-Office Verifier

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

![PowerShell](https://img.shields.io/badge/PowerShell-%235391FE.svg?style=for-the-badge&logo=powershell&logoColor=white)

![Microsoft Excel](https://img.shields.io/badge/Microsoft_Excel-217346?style=for-the-badge&logo=microsoft-excel&logoColor=white)

# Microsoft 365 & Proofpoint Essential Data Fetcher

This project is a script built using PowerShell and Node.js that connects to Microsoft 365 and Proofpoint Essential to fetch critical information. The script requires Microsoft 365 admin credentials and a Proofpoint admin account to operate.

| ![](https://res.cloudinary.com/echeniquer/image/upload/v1721295457/Proyectos/Office-Proofpoint/_95a02d33-198e-4f9d-a5b7-3362758d022d.jpg ) |
|:--:|
| *Image generated by AI* |

## Documentation

### Features
* **Fetch Data from Microsoft 365 and Proofpoint Essential**: Seamlessly gather information from both platforms using a single script.
* **Easy to Use**: Just ensure Node.js is installed, run the script, input your credentials, and get a merged digest file with the necessary data.

### Technologies Used:
* Node.js
* Axios
* PowerShell
* Exchange Connector

### Prerequisites
* Node.js installed on your computer
* Microsoft 365 admin credentials
* Proofpoint admin account

## Steps:

1. Ensure Node.js is Installed: Make sure Node.js is on your computer.
2. Run application.ps1: Execute the script.
3. Enter Credentials: First, input Microsoft 365 admin credentials, then Proofpoint admin credentials.

### Outcome:
A digest file is created with merged information from both platforms.

### Set Project

1. Clone this repository
```powershell
git clone https://github.com/Rodieche/office-proofpoint.git
```

2. Rename .env.template to .env
3. Set the environment vars as example
4. Install dependencies

```powershell
npm install
Install-Module -Name ImportExcel -Scope CurrentUser -Force
Install-Module -Name ExchangeOnlineManagement -Scope CurrentUser -Force
Import-Module -Name ImportExcel
Import-Module -Name ExchangeOnlineManagement
```

### Run Application

FIRST TIME STEPS
1. copy .env.template > .env
2. to PROOFPOINT_CREDENTIALS go to https://www.base64encode.org/ and encode your proofpoint email and password like "username:password" (without quotes) in the first box. Then click "Encode" button and copy and paste the result 
3. replace the enviroments var

NOW YOU CAN RUN THE APP EVERYTIME IS NECESSARY
4. Execute:
```powershell
.\application.ps1
```

### Testing

1. Run ps1 command on powershell (as admin)
.\src\powershell\v2Exchange.ps1

2. Execute:
```bash
npm run dev
```

# Tasks

- [X] Getting Microsoft 365 Information (https://portal.microsoft.com)
- [X] Getting Proofpoint Information (https://us4.proofpointessentials.com/)
- [X] Generating Excel files
- [x] Automate domain checking from Exchange files
- [X] Save user and password for automatic login 
- [ ] Automating Proofpoint actions

## Authors

- [@Rodieche](https://github.com/Rodieche)

