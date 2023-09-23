const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const axios = require("axios");
const open = require("better-opn");
require("dotenv").config();

const isMac = process.platform === "darwin";

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("./renderer/index.html");
};

app.whenReady().then(async () => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  ipcMain.on("start-zoom-meeting", async (event) => {
    const token = await getZoomToken();
    if (token) {
      await startZoomMeeting(token);
    }
  });
});

app.on("window-all-closed", () => {
  if (isMac) app.quit();
});

async function getZoomToken() {
  const accountId = process.env.S2S_ACCOUNT_ID;
  const clientId = process.env.S2S_CLIENT_ID;
  const clientSecret = process.env.S2S_CLIENT_SECRET;

  const base64Credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );
  const url = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`;

  try {
    const response = await axios.post(
      url,
      {},
      {
        headers: {
          Host: "zoom.us",
          Authorization: `Basic ${base64Credentials}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      console.log(`Failed to fetch, status: ${response.status}`);
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return undefined;
  }
}

async function startZoomMeeting(token) {
  const meetingId = process.env.MEETING_ID;
  const bearerToken = token.access_token;

  const url = `https://api.zoom.us/v2/meetings/${meetingId}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
    });
    if (response.status === 200) {
      const startUrl = response.data["start_url"];
      console.log("Start Url:", startUrl);
      open(startUrl);
    }
  } catch (error) {
    console.error("Error starting the meeting:", error);
  }
}
