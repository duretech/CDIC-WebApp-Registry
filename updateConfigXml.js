const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const APP_LOCALE = "PRODUCT";

const CONFIG_XML_PATH = path.join(__dirname, 'config.xml');

const API_URL = `${runtime.apiServiceKey}dataStore/ruleConfig/countyrule`;

const locale = APP_LOCALE; 
const RUNTIME_CONFIG_PATH = path.join(__dirname, 'public', 'runtime-config.json');

// Read runtime-config.json instead of window.RUNTIME_CONFIG
const runtime = JSON.parse(fs.readFileSync(RUNTIME_CONFIG_PATH, 'utf-8'));

async function updateConfigXml() {
  try {
    // Fetch the app name from the API
    const response = await fetch(API_URL, {
        headers: {
            'Authorization': runtime.basicAuth,  
            'Cache-Control': 'no-cache'
        }
    });
    const config = await response.json();
    const appName = config && config[locale] && config[locale]["configxml"] && config[locale]["configxml"]["appName"] ? config[locale]["configxml"]["appName"] : "  ";
    const appDescription = config && config[locale] && config[locale]["configxml"] && config[locale]["configxml"]["appDescription"] ? config[locale]["configxml"]["appDescription"] : "CDIC Description";
    const packageName = config && config[locale] && config[locale]["configxml"] && config[locale]["configxml"]["appPackageName"] ? config[locale]["configxml"]["appPackageName"] : "com.duretechnologies.apps.android.cdic";
    const androidPackageName = config && config[locale] && config[locale]["configxml"] && config[locale]["configxml"]["appAndroidPackageName"] ? config[locale]["configxml"]["appAndroidPackageName"] : "com.duretechnologies.apps.android.cdic";
    const iosPackageName = config && config[locale] && config[locale]["configxml"] && config[locale]["configxml"]["appIosPackageName"] ? config[locale]["configxml"]["appIosPackageName"] : "com.duretechnologies.apps.android.cdic";

    // Read config.xml
    const configXml = fs.readFileSync(CONFIG_XML_PATH, 'utf-8');

    // Update the app name
    let updatedConfigXml = configXml.replace(
      /<name>.*<\/name>/,
      `<name>${appName}</name>`
    );
    updatedConfigXml = updatedConfigXml.replace(
        /<description>.*<\/description>/,
        `<description>${appDescription}</description>`
      );
      updatedConfigXml = updatedConfigXml.replace(
        /id="[^"]+"/,
        `id="${packageName}"`
      );
      updatedConfigXml = updatedConfigXml.replace(
        /android-packageName="[^"]+"/,
        `android-packageName="${androidPackageName}"`
      );
      updatedConfigXml = updatedConfigXml.replace(
        /ios-CFBundleIdentifier="[^"]+"/,
        `ios-CFBundleIdentifier="${iosPackageName}"`
      );

    // Write the updated config.xml back to the file
    fs.writeFileSync(CONFIG_XML_PATH, updatedConfigXml, 'utf-8');
    console.log('config.xml has been updated with the new app details.');
  } catch (error) {
    console.error('Error updating config.xml:', error);
  }
}

updateConfigXml();