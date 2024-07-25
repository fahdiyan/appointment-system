## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
$ prisma db push
$ prisma generate
```

## Running the app

```bash
# first init
$ npm run start:dev
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Documentation

GET {base-url}/appointment/available-slots?:date
```bash
/**
 * Retrieves available slots for appointments based on the provided date.
 * Throws BadRequestException if the date query parameter is missing.
 * @param date - The date for which available slots are requested.
 * @returns An array of available slots for the specified date.
 */
```
POST {base-url}/appointment/available-slots?:date
```bash
/**
 * Book an appointment based on the provided date and time.
 * 
 * @param body An object containing the date and time for the appointment.
 * @returns A Promise that resolves to the booked Appointment.
 * @throws BadRequestException if date or time is missing.
 */
 
//sample payload request body
{
    "date": "2022-01-01",
    "time": "10:00"
}
```
GET {base-url}/config
```bash
/**
 * Retrieves the configuration by calling the 'getConfig' method of the 'ConfigService'.
 * @returns A promise that resolves with the configuration data.
 */
 
//sample response
{
    "id": 1,
    "slotDuration": 30,
    "maxSlotsPerAppointment": 1,
    "operationalStartTime": "09:00",
    "operationalEndTime": "18:00",
    "daysOff": [],
    "unavailableHours": [
        "12:00-13:00"
    ],
    "timezone": "Asia/Jakarta"
}
```
GET {base-url}/config
```bash
/**
 * Update the configuration with the provided data.
 * 
 * @param data - Partial<Config> object containing the updated configuration data.
 * @returns Promise that resolves to the updated Config object.
 */
 
//sample payload request body
{
    "slotDuration": 60,
    "maxSlotsPerAppointment": 1,
    "operationalStartTime": "10:00",
    "operationalEndTime": "17:00",
}
```