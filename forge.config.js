require("dotenv").config();

module.exports = {
  packagerConfig: {
    asar: true,
    env: {
      S2S_ACCOUNT_ID: process.env.S2S_ACCOUNT_ID,
      S2S_CLIENT_ID: process.env.S2S_CLIENT_ID,
      S2S_CLIENT_SECRET: process.env.S2S_CLIENT_SECRET,
      MEETING_ID: process.env.MEETING_ID,
    },
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {},
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
  ],
};
