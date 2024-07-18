# Proofpoint-Office Verifier

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

![PowerShell](https://img.shields.io/badge/PowerShell-%235391FE.svg?style=for-the-badge&logo=powershell&logoColor=white)

![Microsoft Excel](https://img.shields.io/badge/Microsoft_Excel-217346?style=for-the-badge&logo=microsoft-excel&logoColor=white)

This project was designed to compare information between Proofpoint and Microsoft 365 Exchange, ensuring that Proofpoint remains updated.

When a new user is created, there are instances where we might overlook adding them to Proofpoint. Therefore, it is crucial to keep this information current and conduct periodic checks to avoid such oversights.

| ![](https://res.cloudinary.com/echeniquer/image/upload/v1721295457/Proyectos/Office-Proofpoint/_95a02d33-198e-4f9d-a5b7-3362758d022d.jpg ) |
|:--:|
| *Image generated by AI* |

## Documentation

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

Execute:
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

## Authors

- [@Rodieche](https://github.com/Rodieche)

