import fetch from 'node-fetch'

const SERVER_API = 'http://194.195.253.84:8080/api'

class API {
    static async authenticate(agentToken) {
        const response = await fetch(SERVER_API + '/authentication', {
            method: 'POST', 
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ agentToken })
        });

        const data = await response.json()
        const authorised = data['authorised']
        
        return authorised
    }
}

export default API
