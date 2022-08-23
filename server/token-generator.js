import cryptojs from 'crypto-js';
import process from 'process';

/**
 * Creates interactive TokenGenerator object
 * @param {String} key key used for HmacSHA256 encyption
 */
export default class TokenGenerator {
    constructor(key){
        if (!key) {
            console.error(`Please provide a key in the env variable 'AI_PLATFORM_SECRET_KEY'`);
            process.exit(1);
        }

        this.key = key;
        this.header = {
            'alg': 'HS256',
            'typ': 'JWT'
        }
    }

    /**
     * Method used to produce a singular JWT token with a give JSON payload.
     * @param {JSON | String | Object} payload JSON payload object
     * @returns {String} singular JWT
     */
    generateToken(payload) {
        const getBase64 = (json) => cryptojs.enc.Base64.stringify(cryptojs.enc.Utf8.parse(JSON.stringify(json)));
        const head64 = getBase64(this.header);
        const payload64 = getBase64(payload);
        const signature = cryptojs.HmacSHA256(`${head64}.${payload64}`,this.key);
        const token = `${head64}.${payload64}.${signature}`;
        return token;
    }

    /**
     * Method used as a generator taking in a input of required tokens and returning that same among of
     * randomised tokens.
     * @param {String[]} studentNumber the require number of tokens to be produced
     * @returns {{studentNumber: String, authToken: String}[]} an array of objects with the last token generated at the last index
     */
    generateTokens(studentNumbers) {
        return studentNumbers.map((number) => {
            return {
                studentNumber: number,
                authToken: this.generateToken(number),
            }
        });
    }
}
