# Website
## Setting Server URL
Set the following variable in `/website/js/scripts.js` to the URL of the server:
```js
const TEMP_SERVER_URL = 'http://localhost:8080';
```

## Admin Panel
Head to the admin page (via `Admin` on the navbar).
Enter your admin token and press authenticate.

### Database View
Click `All Users`

### Generating New Tokens
Enter the student number or seed into the student or admin token field and click `Submit`

### Changing Display Name Of A Student
Enter their `authToken` and the desired `displayName` and click `Submit`
