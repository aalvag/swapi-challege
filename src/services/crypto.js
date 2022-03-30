import CryptoJs from "crypto-js";

const key = "Star*Wars*SWAPI*-Test/2022-03-27";

export const encrypt = (text) => {
  return CryptoJs.AES.encrypt(text, key).toString();
};

export const decrypt = (text) => {
  return CryptoJs.AES.decrypt(text, key).toString(CryptoJs.enc.Utf8);
};
