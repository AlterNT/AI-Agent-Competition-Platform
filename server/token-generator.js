import cryptojs from "crypto-js";
import process from "process";
import config from "./config.js";

/**
 * Creates interactive TokenGenerator object
 * @param {String} key key used for HmacSHA256 encyption
 */
class TokenGenerator {
  constructor() {
    this.key = config.database.aiPlatformSecretKey;
    if (!this.key) {
      console.error(
        "You must have a secret key at config.database.aiPlatformSecretKey"
      );
      process.exit(1);
    }

    this.header = {
      alg: "HS256",
      typ: "JWT",
    };
  }

  /**
   * Method used to produce a singular JWT token with a give JSON payload.
   * @param {JSON | String | Object} payload JSON payload object
   * @returns {String} singular JWT
   */
  generateToken(payload) {
    const getBase64 = (json) =>
      cryptojs.enc.Base64.stringify(
        cryptojs.enc.Utf8.parse(JSON.stringify(json))
      );
    const head64 = getBase64(this.header);
    const payload64 = getBase64(payload);
    const signature = cryptojs.HmacSHA256(`${head64}.${payload64}`, this.key);
    const token = `${head64}.${payload64}.${signature}`;
    return token;
  }

  /**
   * Method used as a generator taking in a input of required tokens and returning that same among of
   * randomised tokens.
   * @param {String[]} studentNumber the require number of tokens to be produced
   * @returns {{studentNumber: String, authToken: String}[]} an array of objects with the last token generated at the last index
   */
  computeStudentTokens(studentNumbers) {
    return studentNumbers.map((number) => {
      return {
        studentNumber: number,
        authToken: this.generateToken(
          `${number}${config.database.aiPlatformSalt}`
        ),
      };
    });
  }
}

export default TokenGenerator;
