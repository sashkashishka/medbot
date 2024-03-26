/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`src/plugins/api/utils/__tests__/time.spec.ts > TAP > should exclude occupied times from range > must match snapshot 1`] = `
Array [
  Object {
    "endTime": "2024-01-07T16:00:00.000Z",
    "id": "2024-01-07T15:00:00.000Z",
    "startTime": "2024-01-07T15:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-07T17:00:00.000Z",
    "id": "2024-01-07T16:00:00.000Z",
    "startTime": "2024-01-07T16:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-07T20:00:00.000Z",
    "id": "2024-01-07T19:00:00.000Z",
    "startTime": "2024-01-07T19:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-08T11:00:00.000Z",
    "id": "2024-01-08T10:00:00.000Z",
    "startTime": "2024-01-08T10:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-08T13:00:00.000Z",
    "id": "2024-01-08T12:00:00.000Z",
    "startTime": "2024-01-08T12:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-08T14:00:00.000Z",
    "id": "2024-01-08T13:00:00.000Z",
    "startTime": "2024-01-08T13:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-08T15:00:00.000Z",
    "id": "2024-01-08T14:00:00.000Z",
    "startTime": "2024-01-08T14:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-08T17:00:00.000Z",
    "id": "2024-01-08T16:00:00.000Z",
    "startTime": "2024-01-08T16:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-08T18:00:00.000Z",
    "id": "2024-01-08T17:00:00.000Z",
    "startTime": "2024-01-08T17:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-08T19:00:00.000Z",
    "id": "2024-01-08T18:00:00.000Z",
    "startTime": "2024-01-08T18:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-08T20:00:00.000Z",
    "id": "2024-01-08T19:00:00.000Z",
    "startTime": "2024-01-08T19:00:00.000Z",
  },
]
`

exports[`src/plugins/api/utils/__tests__/time.spec.ts > TAP > should return first slot 2 hours after current time > must match snapshot 1`] = `
Array [
  Object {
    "endTime": "2024-01-07T16:00:00.000Z",
    "id": "2024-01-07T15:00:00.000Z",
    "startTime": "2024-01-07T15:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-07T17:00:00.000Z",
    "id": "2024-01-07T16:00:00.000Z",
    "startTime": "2024-01-07T16:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-07T18:00:00.000Z",
    "id": "2024-01-07T17:00:00.000Z",
    "startTime": "2024-01-07T17:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-07T19:00:00.000Z",
    "id": "2024-01-07T18:00:00.000Z",
    "startTime": "2024-01-07T18:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-07T20:00:00.000Z",
    "id": "2024-01-07T19:00:00.000Z",
    "startTime": "2024-01-07T19:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-07T21:00:00.000Z",
    "id": "2024-01-07T20:00:00.000Z",
    "startTime": "2024-01-07T20:00:00.000Z",
  },
]
`

exports[`src/plugins/api/utils/__tests__/time.spec.ts > TAP > should return right times between 10 and 22 > must match snapshot 1`] = `
Array [
  Object {
    "endTime": "2024-01-07T10:00:00.000Z",
    "id": "2024-01-07T09:00:00.000Z",
    "startTime": "2024-01-07T09:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-07T11:00:00.000Z",
    "id": "2024-01-07T10:00:00.000Z",
    "startTime": "2024-01-07T10:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-07T12:00:00.000Z",
    "id": "2024-01-07T11:00:00.000Z",
    "startTime": "2024-01-07T11:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-07T13:00:00.000Z",
    "id": "2024-01-07T12:00:00.000Z",
    "startTime": "2024-01-07T12:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-07T14:00:00.000Z",
    "id": "2024-01-07T13:00:00.000Z",
    "startTime": "2024-01-07T13:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-07T15:00:00.000Z",
    "id": "2024-01-07T14:00:00.000Z",
    "startTime": "2024-01-07T14:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-07T16:00:00.000Z",
    "id": "2024-01-07T15:00:00.000Z",
    "startTime": "2024-01-07T15:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-07T17:00:00.000Z",
    "id": "2024-01-07T16:00:00.000Z",
    "startTime": "2024-01-07T16:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-07T18:00:00.000Z",
    "id": "2024-01-07T17:00:00.000Z",
    "startTime": "2024-01-07T17:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-07T19:00:00.000Z",
    "id": "2024-01-07T18:00:00.000Z",
    "startTime": "2024-01-07T18:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-07T20:00:00.000Z",
    "id": "2024-01-07T19:00:00.000Z",
    "startTime": "2024-01-07T19:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-07T21:00:00.000Z",
    "id": "2024-01-07T20:00:00.000Z",
    "startTime": "2024-01-07T20:00:00.000Z",
  },
]
`

exports[`src/plugins/api/utils/__tests__/time.spec.ts > TAP > should return slots for next days > must match snapshot 1`] = `
Array [
  Object {
    "endTime": "2024-01-07T10:00:00.000Z",
    "id": "2024-01-07T09:00:00.000Z",
    "startTime": "2024-01-07T09:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-07T11:00:00.000Z",
    "id": "2024-01-07T10:00:00.000Z",
    "startTime": "2024-01-07T10:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-07T12:00:00.000Z",
    "id": "2024-01-07T11:00:00.000Z",
    "startTime": "2024-01-07T11:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-07T13:00:00.000Z",
    "id": "2024-01-07T12:00:00.000Z",
    "startTime": "2024-01-07T12:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-07T14:00:00.000Z",
    "id": "2024-01-07T13:00:00.000Z",
    "startTime": "2024-01-07T13:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-07T15:00:00.000Z",
    "id": "2024-01-07T14:00:00.000Z",
    "startTime": "2024-01-07T14:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-07T16:00:00.000Z",
    "id": "2024-01-07T15:00:00.000Z",
    "startTime": "2024-01-07T15:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-07T17:00:00.000Z",
    "id": "2024-01-07T16:00:00.000Z",
    "startTime": "2024-01-07T16:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-07T18:00:00.000Z",
    "id": "2024-01-07T17:00:00.000Z",
    "startTime": "2024-01-07T17:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-07T19:00:00.000Z",
    "id": "2024-01-07T18:00:00.000Z",
    "startTime": "2024-01-07T18:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-07T20:00:00.000Z",
    "id": "2024-01-07T19:00:00.000Z",
    "startTime": "2024-01-07T19:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-07T21:00:00.000Z",
    "id": "2024-01-07T20:00:00.000Z",
    "startTime": "2024-01-07T20:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-08T10:00:00.000Z",
    "id": "2024-01-08T09:00:00.000Z",
    "startTime": "2024-01-08T09:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-08T11:00:00.000Z",
    "id": "2024-01-08T10:00:00.000Z",
    "startTime": "2024-01-08T10:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-08T12:00:00.000Z",
    "id": "2024-01-08T11:00:00.000Z",
    "startTime": "2024-01-08T11:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-08T13:00:00.000Z",
    "id": "2024-01-08T12:00:00.000Z",
    "startTime": "2024-01-08T12:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-08T14:00:00.000Z",
    "id": "2024-01-08T13:00:00.000Z",
    "startTime": "2024-01-08T13:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-08T15:00:00.000Z",
    "id": "2024-01-08T14:00:00.000Z",
    "startTime": "2024-01-08T14:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-08T16:00:00.000Z",
    "id": "2024-01-08T15:00:00.000Z",
    "startTime": "2024-01-08T15:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-08T17:00:00.000Z",
    "id": "2024-01-08T16:00:00.000Z",
    "startTime": "2024-01-08T16:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-08T18:00:00.000Z",
    "id": "2024-01-08T17:00:00.000Z",
    "startTime": "2024-01-08T17:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-08T19:00:00.000Z",
    "id": "2024-01-08T18:00:00.000Z",
    "startTime": "2024-01-08T18:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-08T20:00:00.000Z",
    "id": "2024-01-08T19:00:00.000Z",
    "startTime": "2024-01-08T19:00:00.000Z",
  },
  Object {
    "endTime": "2024-01-08T21:00:00.000Z",
    "id": "2024-01-08T20:00:00.000Z",
    "startTime": "2024-01-08T20:00:00.000Z",
  },
]
`
