# ClinicApp

A web application for managing clinic operations, including patient records, appointments, doctor availability, and vaccination tracking.

## Features
- Patient management
- Appointment booking
- Doctor availability
- Vaccination records
- Visit reports

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm start
   ```

## Project Structure
- `src/components/` - React components for various features
- `public/` - Static files

## License
MIT 

## Managing AWS Lambda Functions

Lambda function code is managed in the `lambda/` directory. Scripts for downloading and deploying Lambda functions are located in `lambda/scripts/`.

### Download All Lambda Function Code

This script downloads and extracts all Lambda function code from your AWS account into the `lambda/` folder:

```sh
cd lambda/scripts
./download_all_lambda_code.sh
```

- Requires AWS CLI, unzip, and curl to be installed and configured.
- Each Lambda's code will be extracted into its own folder under `lambda/`.

### Deploy a Lambda Function

To deploy (update) a Lambda function with code from its folder:

```sh
cd lambda/scripts
./deploy_lambda.sh <LambdaFunctionName>
```
- Replace `<LambdaFunctionName>` with the name of your Lambda function.
- The script zips the code in `lambda/<LambdaFunctionName>/` and updates the function in AWS.

--- 

## Frontend Build & Deploy Scripts

The following npm scripts are available for building and deploying the frontend:

### Build the App

Builds the React app for production:
```sh
npm run build
```
- Output is placed in the `build/` directory.

### Deploy to S3 and Invalidate CloudFront

Builds the app, uploads the build output to the S3 bucket, and invalidates the CloudFront distribution so users get the latest version:
```sh
npm run deploy
```
- Requires AWS CLI to be installed and configured with access to the S3 bucket and CloudFront distribution.
- S3 Bucket: `drsheelasclinic`
- CloudFront Distribution ID: `E2PLUVBGMZ4ZYL`

--- 

## API Endpoints, Lambda Functions, and React Component Mapping

| API Endpoint (Path & Method) | Lambda Function | Payload Example | Response Example | React Component(s) |
|------------------------------|-----------------|----------------|------------------|--------------------|
| `/signin` (POST) | authenticate | `{ "userid": "user", "password": "pass" }` | `{ "statusCode": 200, "body": "\"authenticated\"" }` or `{ "statusCode": 404, "body": "\"invalid username or password\"" }` | App.js (login logic) |
| `/patient` (POST) | getPatient | `{ "searchFor": "name or phone" }` | JSON array of patient objects (as string) | PatientList.js |
| `/patient` (PUT) | insertPatient | `{ "phone": "...", "patientName": "...", "parentName": "...", "dateOfBirth": "...", "gender": "...", "area": "..." }` | `{ "statusCode": 200, "body": "Item inserted successfully!" }` | PatientDetails.js, PatientUpload.js |
| `/vaccine` (POST) | getVaccine | `{}` | JSON array of vaccine objects (as string) | Vaccine.js, VisitDetails.js |
| `/vaccine` (PUT) | insertVaccine | `{ "vaccineName": "...", "sellingPrice": "..." }` | `{ "statusCode": 200, "body": "\"Item added to DynamoDB table\"" }` | Vaccine.js, VaccineDetails.js |
| `/vaccinegiven` (PUT) | insertVaccineGiven | `{ "phone": "...", "patientName": "...", "vaccineName": "...", "givenDate": "...", "vaccineCost": "...", "notes": "..." }` | `{ "statusCode": 200, "body": "vaccineGiven inserted successfully!" }` | VisitDetails.js |
| `/visit` (POST) | getVisit | `{ "phone": "...", "patientName": "...", "startDate": "...", "endDate": "..." }` | JSON array of visit objects (as string) | VisitDetails.js, VisitReport.js |
| `/visit` (PUT) | insertVisit | `{ "phone": "...", "patientName": "...", "visitDate": "...", "reason": "...", "consultationFee": "...", "totalVaccineFee": "...", "totalFee": "...", "paymentMode": "...", "notes": "...", "sessionNumber": "...", "entryTime": "..." }` | `{ "statusCode": 200, "body": "Visit inserted successfully!" }` | VisitDetails.js |
| `/visit` (DELETE) | deleteVisit | `{ "phoneAndPatientName": "...", "visitDate": "..." }` | `{ "statusCode": 200, "body": "\"Successfully deleted item: ... - ...\"" }` | VisitDetails.js |
| `/doctoravailability` (GET) | getDoctorAvailability | None | `{ "statusCode": 200, "body": [ ...slots... ] }` | DoctorAvailability.js |
| `/doctoravailability` (PUT) | updateDoctorAvailability | `{ "weekday": "...", "slot": "..." }` | (204 No Content or error) | DoctorAvailability.js |
| `/doctoravailability` (DELETE) | deleteDoctorAvailability | `{ "weekday": "...", "slot": "..." }` | (204 No Content or error) | DoctorAvailability.js |
| `/doctoravailability` (POST) | getAppointments | `{ "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD" }` | `{ "appointments": { "YYYY-MM-DD": [ { "appointmentTime": "...", "patientPhone": "...", "patientName": "..." }, ... ] } }` | BookedAppointments.js |
| `/vaccinegivenreport` (POST) | vaccineGivenReport | `{ "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD" }` | `{ "statusCode": 200, "body": "[ ...vaccineGiven objects... ]" }` | VisitReport.js |
| `/bookAppointment` (POST) | bookAppointment | `{ "appointmentDate": "...", "appointmentTime": "...", "patientName": "...", "patientEmail": "...", "patientPhone": "..." }` | `{ "statusCode": 200, "body": { "message": "...", "smsResponse": ... } }` | (Not directly mapped in current React code) |
| `/getAllEntities` (POST) | getAllEntities | `{ "entity": "tableName" }` | `{ "statusCode": 200, "body": "[ ...items... ]" }` | (Not directly mapped in current React code) |
| `/getDoctors` (POST) | getDoctors | `{ "phone": "...", "doctorName": "..." }` | `{ "statusCode": 200, "body": "[ ...doctor objects... ]" }` | (Not directly mapped in current React code) |
| `/getAvailableSlots` (POST) | getAvailableSlots | `{ "appointmentDate": "YYYY-MM-DD" }` | `{ "availableSlots": [ "HH:MM", ... ] }` | (Not directly mapped in current React code) |
| `/getExistingAppointment` (GET) | getExistingAppointment | Path param: `patientPhone` | `{ "statusCode": 200, "body": "{ ...latest appointment... }" }` | (Not directly mapped in current React code) |
| `/insertDoctor` (PUT) | insertDoctor | `{ "phone": "...", "doctorName": "...", "specialization": "...", "email": "..." }` | `{ "statusCode": 200, "body": "\"Data inserted successfully\"" }` | (Not directly mapped in current React code) |
| `/insertVaccine` (PUT) | insertVaccine | `{ "vaccineName": "...", "sellingPrice": "..." }` | `{ "statusCode": 200, "body": "\"Item added to DynamoDB table\"" }` | Vaccine.js, VaccineDetails.js |
| `/insertVisit` (PUT) | insertVisit | (see `/visit` PUT above) | (see `/visit` PUT above) | VisitDetails.js |
| `/loadPatients` (S3 event) | loadPatients | S3 event for Patients.csv | (Logs, no direct response) | PatientUpload.js (triggers via S3 upload) |
| `/createSchema` (POST) | createSchema | None | `{ "statusCode": 200, "body": "\"Schema created successfully\"" }` | (Not directly mapped in current React code) |
| `/createSchemaIDO` (POST) | createSchemaIDO | None | `{ "statusCode": 200, "body": "\"Table created successfully!\"" }` | (Not directly mapped in current React code) |
| `/CreateAppointmentsTable` (POST) | CreateAppointmentsTable | None | `{ "statusCode": 200, "body": { "message": "Table created successfully" } }` | (Not directly mapped in current React code) |

--- 

## DynamoDB Tables & Schema

| Table Name              | Partition Key (HASH)         | Sort Key (RANGE)           | Main Attributes / Notes                                  |
|-------------------------|------------------------------|----------------------------|----------------------------------------------------------|
| doctor                  | phone (S)                    | —                          | doctorName, email, specialization                        |
| patient                 | phone (S)                    | patientName (S)            | parentName, dateOfBirth, gender, area                    |
| vaccine                 | vaccineName (S)              | —                          | sellingPrice                                             |
| visit                   | phoneAndPatientName (S)      | visitDate (S)              | phone, patientName, reason, consultationFee, totalVaccineFee, totalFee, paymentMode, notes, sessionNumber, entryTime |
| vaccineGiven            | phoneAndPatientName (S)      | vaccineNameAndDate (S)     | phone, patientName, vaccineName, givenDate, vaccineCost, notes |
| appointments            | phone (S)                    | slot (S)                   | (used in createSchema)                                   |
| doctor_availability     | weekday (S)                  | slot (S)                   | (used in createSchema)                                   |
| appointments (alt)      | appointmentDate (S)          | appointmentTime (S)        | patientName, patientEmail, patientPhone (used in CreateAppointmentsTable) |
| charitable_organisations| name (S)                     | zip_code (S)               | (used in createSchemaIDO)                                |

**Notes:**
- Some tables (like `appointments`) appear with different key schemas in different Lambda functions. The main one for booking uses `appointmentDate` + `appointmentTime`.
- Composite keys like `phoneAndPatientName` and `vaccineNameAndDate` are constructed by concatenating fields with a pipe (`|`).
- Additional attributes may exist in each table, as inferred from the Lambda code.

--- 