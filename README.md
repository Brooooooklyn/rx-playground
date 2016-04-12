## before you play

- git clone git@github.com:teambition/teambition-sdk.git
- cd teambition-sdk
- npm link
- cd rx-playground
- npm link teambition-sdk
- npm i
- touch auth.json 将 access_token 写在 token字段
- ts-node src/app.ts