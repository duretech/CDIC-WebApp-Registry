import { APP_LOCALE } from '../assets/data/config'; 
import _ from "lodash";
import moment from "moment";
import { decryptData, encryptData } from '../imon/encryption/AesEnc';

//TERMINOLOGIES
//fieldContext:- It is the name of the js file.
//localStorage:- Local storage in the browser
//appConfign:- It is the name of the key used to store the configuration json in local storage
//locale:- I is the name of the country or product referred from config.js
//------------------------------------------------------------------------------------------------------//

// This function uses the locale to fetch the appropriate settings from the configuration stored in localStorage.
// Parameters:
// fieldContext: A string that specifies the context within which to find the date format (e.g., 'createfield', 'createsearchfield').
//
// Returns:
// The date format string specified in the configuration for the given field context and locale. 
// If no specific format is found, it defaults to 'yyyy-MM-dd'.

export const getDateFormat = (fieldContext) => {
     // Retrieve the configuration JSON string from localStorage and parse it.
    const configRaw = localStorage.getItem('appConfign'); 
    const config = JSON.parse(configRaw);
    // Fetch the current locale set in the application.
    const locale = APP_LOCALE; 
    // Access the specific field configuration based on the locale and field context.
    const fieldConfig = config && config[locale] && config[locale][fieldContext];
    // Return the date format specified in the field configuration if available; otherwise, default to 'yyyy-MM-dd'.
    return fieldConfig ? fieldConfig.dateFormat : 'yyyy-MM-dd'; 
};

// Retrieves the validation field ID from the configuration for a given field context.
// This function uses the locale to access the appropriate configuration settings.
//
// Parameters:
// config: The configuration object containing all settings, typically fetched from local storage and parsed.
// fieldCon: A string identifier for the field context (e.g., 'createfield', 'updatefield'), specifying where to look for the validation field ID.
//
// Returns:
// The validation field ID if found within the specified context and locale. If no ID is found, returns null.

export const getValidationFieldID = (config,fieldCon) => {
    // Fetch the current application locale.
    const locale = APP_LOCALE;
    // Access the configuration for the given field context within the specified locale.
    const fieldConfig = config && config[locale] && config[locale][fieldCon];
    // Log the field configuration to the console for debugging purposes.
     // Return the validation field ID from the configuration if available, otherwise return null.
    return fieldConfig ? fieldConfig.validationFieldID : null;
};

// Evaluates specific conditions based on the validation field ID retrieved from the configuration.
// This function determines whether certain actions should be taken based on the attribute's ID and other contextual data.
// Parameters:
// config: The entire configuration object usually fetched from local storage.
// fieldContext: The context under which this function is called (e.g., 'createfield', 'editfield').
// values: An object containing current form values.
// customfieldobj: An object holding custom field mappings.
// fieldData: Data related to the current field, used to check certain conditions.
// Returns:
// Boolean value indicating whether the condition for the specified validation field ID is met.

export const checkFieldCondition = (config, fieldContext,  values, customfieldobj,fieldData) => {
     // Retrieve the validation field ID based on the context and configuration.
    const validationFieldID = getValidationFieldID(config,fieldContext);
    // Check conditions based on the retrieved validation field ID.
    if (validationFieldID === 'dobID') {
    // For 'dobID', return true if the field is mandatory and the current value is not set.
        return fieldData.mandatory && !values[fieldData.trackedEntityAttribute.id] ;
    } else if (validationFieldID === 'dateOfEnrollmentID') {
    // For 'dateOfEnrollmentID', return true if the current value is not set and the custom field object's date of enrollment ID matches the current field ID.
       return !values[fieldData.trackedEntityAttribute.id] && customfieldobj.dateOfEnrollmentID === fieldData.trackedEntityAttribute.id
    }

};

// Determines if custom field objects should be included based on specific configurations for a given field context.
// This function helps to decide dynamically if additional object properties should be considered in the rendering or logic.
//
// Parameters:
// fieldContext: The context or part of the application from where this function is called (e.g., 'createfield', 'createsearchfield').
//
// Returns:
// Boolean value indicating whether custom field objects should be included based on the configuration settings for the specified field context.

export const shouldIncludeCustomFieldObj = (fieldContext) => {
    // Retrieve the entire configuration from local storage.
    const configRaw = localStorage.getItem('appConfign'); 
    const config = JSON.parse(configRaw);
    // Fetch the current locale set in the application.
    const locale = APP_LOCALE;
    // Access the specific configuration for the given field context under the current locale.
    const fieldConfig = config && config[locale] && config[locale][fieldContext];
    // Return the 'formatDate' setting from the field configuration if it exists, otherwise default to false.
    return fieldConfig ? fieldConfig.formatDate : false;
};

// Calculates Body Mass Index (BMI) using the metric system.
// This function is suitable for inputs where the height is provided in meters.
//
// Parameters:
// weightKg: The weight of the person in kilograms.
// heightM: The height of the person in meters.
//
// Returns:
// The calculated BMI rounded to two decimal places as a string.

export function calculateBMIMetric(weightKg, heightM) {
    let bmi = weightKg / (heightM * heightM);
    // Convert the result to a string with two decimal places for readability.
    return bmi.toFixed(2);
}

// Calculates Body Mass Index (BMI) using the imperial system.
// This function is suitable for inputs where the height is provided in centimeters,
// which is then converted to meters for the calculation.
//
// Parameters:
// weightKg: The weight of the person in kilograms.
// heightCm: The height of the person in centimeters.
//
// Returns:
// The calculated BMI rounded to two decimal places as a string.

export function calculateBMIImperial(weightKg, heightCm) {
    // Convert height from centimeters to meters for calculation.
    const heightM = heightCm / 100;
    // BMI calculation using the formula: BMI = weight (kg) / [height (m)]^2
    let bmi = weightKg / (heightM * heightM);
    // Convert the result to a string with two decimal places for readability.
    return bmi.toFixed(2);
}

// Retrieves the weight calculation type ('imperial' or 'metric') from the application configuration
// for a specific field context. This determines the method to be used for BMI calculation.
//
// Parameters:
// config: The global configuration object parsed from local storage that contains settings for different locales.
// fieldCon: The specific context or section within the configuration from which to retrieve the BMI calculation type.
//
// Returns:
// The method of BMI calculation as a string ('imperial' or 'metric'), or null if not specified.

export const getweightcaltype = (config,fieldCon) => {
    // Retrieve the current locale setting from a global variable or configuration.
    const locale = APP_LOCALE;
    // Access the configuration specific to the current locale and field context.
    const fieldConfig = config && config[locale] && config[locale][fieldCon];
    // Return the bmiCalculation method from the field configuration if available, otherwise return null.
    return fieldConfig ? fieldConfig.bmiCalculation : null;
};

// Retrieves the appropriate BMI calculation function based on the configuration settings for a given field context.
// This function decides between different BMI calculation methods (e.g., imperial or metric) dynamically based on application settings.
//
// Parameters:
// fieldContext: The context or area within the application for which the BMI calculation method needs to be determined, 
// typically linked to specific configurations like different forms or user inputs.
//
// Returns:
// A function reference to either 'calculateBMIImperial' or 'calculateBMIMetric' based on the configured method.

export function getBMIFunction(fieldContext) {
    // Retrieve the configuration JSON string from local storage and parse it into an object.
    const configRaw = localStorage.getItem('appConfign'); 
    const config = JSON.parse(configRaw);
    // Fetch the specific weight calculation type ('imperial' or 'metric') from the configuration for the provided field context.
    const method = getweightcaltype(config,fieldContext);
    // Decide which BMI calculation function to use based on the fetched method.
    switch(method) {
        case 'imperial':
            // If the method is 'imperial', return the function that calculates BMI using imperial units.
            return calculateBMIImperial;
        case 'metric':
        default:
            // If the method is 'metric' or any other value (including undefined), return the function that calculates BMI using metric units.
            return calculateBMIMetric;
    }
}

// Determines whether BMI calculations should be performed based on specific configurations for a given field context.
// This function allows dynamic decision-making about performing BMI calculations based on the configurations stored in the application settings.
//
// Parameters:
// fieldContext: The context or area of the application from which this function is called, typically identifying the configuration related to specific operational parts like creating or searching fields.
//
// Returns:
// Boolean value indicating whether BMI calculations should be enabled based on the configuration settings for the specified field context.

export const shouldCalculateBMI = (fieldContext) => {
    // Retrieve the configuration JSON string from local storage and parse it into an object.
    const configRaw = localStorage.getItem('appConfign'); 
    const config = JSON.parse(configRaw);
    // Fetch the locale currently set in the application, which dictates the regional settings.
    const locale = APP_LOCALE;
    // Access the specific configuration for the given field context within the current locale.
    const fieldConfig = config && config[locale] && config[locale][fieldContext];
    // Return the 'calculateBMI' setting from the field configuration if available; otherwise, default to false.
    // This helps in enabling or disabling BMI calculations dynamically based on configuration.
    return fieldConfig ? fieldConfig.calculateBMI : false;
};

// Retrieves the registration key from the configuration based on the specified context.
// This function is used to dynamically fetch the key used for registration processes,
// which can vary depending on the locale and specific configuration settings.
//
// Parameters:
// fieldContext: A string that specifies the context within the configuration
//               where the registration key is defined, such as 'createfield' or 'formstructure'.
//
// Returns:
// The registration key as a string if it exists in the configuration for the current locale,
// otherwise returns null if not specified.
//
// Example Usage:
// let registrationKey = getRegistrationKey("formstructure");
// This would look for the 'registrationKey' in the 'formstructure' section of the configuration
// for the current locale set in APP_LOCALE.

export const getRegistrationKey = (fieldContext) => {
    // Fetch the configuration JSON string from local storage.
    const configRaw = localStorage.getItem('appConfign'); 
    // Parse the JSON string to convert it back into an object.
    const config = JSON.parse(configRaw);
    const locale = APP_LOCALE;
    const fieldConfig = config && config[locale] && config[locale][fieldContext];
    // Return the 'registrationKey' from the field configuration if available, otherwise return null.
    return fieldConfig ? fieldConfig.registrationKey : null;
};

// Determines whether the Date of Enrollment (DOE) should be handled based on the current configuration settings.
// This function checks the configuration for a specific field context to decide if the Date of Enrollment
// should be processed or manipulated in some way, depending on the locale-specific settings.
//
// Parameters:
// fieldContext: A string identifier for the context within the configuration from which to fetch the setting,
//               such as 'createfield' or 'formstructure'.
//
// Returns:
// A boolean value indicating whether handling the Date of Enrollment is enabled (true) or not (false).
// If the configuration doesn't specify, it defaults to false.
//
// Example Usage:
// let handleDOE = shouldHandleDOE("formstructure");
// This checks if the Date of Enrollment should be managed according to the 'formstructure' settings
// for the current locale specified in APP_LOCALE.

export const shouldHandleDOE = (fieldContext) => {
    // Retrieve the configuration JSON string from local storage.
    const configRaw = localStorage.getItem('appConfign'); 
    // Convert the JSON string into an object.
    const config = JSON.parse(configRaw);
    // Retrieve the current locale setting.
    const locale = APP_LOCALE;
    // Access the appropriate section of the configuration based on the locale and field context.
    const fieldConfig = config && config[locale] && config[locale][fieldContext];
    // Return the 'handleDateOfEnrollment' setting if it exists, otherwise default to false.
    return fieldConfig ? fieldConfig.handleDateOfEnrollment : false;
};

// Evaluates if handling the weight at CDIC entry is configured to be active based on locale and context-specific settings.
// This function retrieves the configuration settings to determine if weight measurements at the time of CDIC  
// entry should be actively managed or recorded, depending on the settings defined per locale.
//
// Parameters:
// fieldContext: A string identifier used to specify the context within the configuration object,
//               indicating where to look for the relevant settings, such as 'createfield' or 'formstructure'.
//
// Returns:
// A boolean value indicating whether the handling of weight at the time of CDIC entry is enabled (true) or not (false).
// Defaults to false if the setting is not explicitly configured.
//
// Example Usage:
// let handleWeightAtEntry = shouldHandleweightAtCdicEntry("formstructure");
// This function will check the configuration to see if managing weight data at CDIC entry is necessary based on
// the current locale's configuration specified in APP_LOCALE.

export const shouldHandleweightAtCdicEntry = (fieldContext) => {
    // Fetch the configuration JSON string from local storage.
    const configRaw = localStorage.getItem('appConfign'); 
    // Parse the JSON string into a JavaScript object.
    const config = JSON.parse(configRaw);
    // Retrieve the current locale from the APP_LOCALE variable.
    const locale = APP_LOCALE;
    const fieldConfig = config && config[locale] && config[locale][fieldContext];
    // Return the 'handleweightAtCdicEntry' configuration setting if available, otherwise default to false.
    return fieldConfig ? fieldConfig.handleweightAtCdicEntry : false;
};

// Determines whether height data at CDIC entry should be actively managed based on the configured settings for the locale.
// This function checks the configuration for a specific context to decide if the handling of height data at the time
// of entry into the CDIC is required, according to settings specified per locale.
//
// Parameters:
// fieldContext: A string that specifies the configuration context (e.g., 'createfield' or 'formstructure'),
//               which points to where in the configuration object the settings can be found.
//
// Returns:
// Boolean indicating whether managing height data at CDIC entry is active (true) or not (false). It defaults to false
// if the configuration is not specified or if the setting is absent in the configuration.
//
// Example Usage:
// let manageHeightAtEntry = shouldHandleheightAtCdicEntry("formstructure");
// This call checks the configuration to see if height data management upon CDIC entry is necessary based on the
// current locale’s configuration specified in the variable APP_LOCALE.
export const shouldHandleheightAtCdicEntry = (fieldContext) => {
    // Retrieve the configuration as a JSON string from local storage.
    const configRaw = localStorage.getItem('appConfign'); 
    // Convert the JSON string into an object for easier handling.
    const config = JSON.parse(configRaw);
    const locale = APP_LOCALE;
    const fieldConfig = config && config[locale] && config[locale][fieldContext];
    // Return the value of 'handleheightAtCdicEntry' if available; otherwise, return false as the default behavior.
    return fieldConfig ? fieldConfig.handleheightAtCdicEntry : false;
};

// Determines whether BMI data at CDIC entry should be actively managed based on the configured settings for the locale.
// This function checks the configuration for a specific context to decide if the handling of BMI data at the time
// of entry into the CDIC is required, according to settings specified per locale.
//
// Parameters:
// fieldContext: A string that specifies the configuration context (e.g., 'createfield' or 'formstructure'),
//               which points to where in the configuration object the settings can be found.
//
// Returns:
// Boolean indicating whether managing BMI data at CDIC entry is active (true) or not (false). It defaults to false
// if the configuration is not specified or if the setting is absent in the configuration.
//
// Example Usage:
// let manageBMIAtEntry = shouldHandlebmiAtCdicEntry("formstructure");
// This call checks the configuration to see if BMI data management upon CDIC entry is necessary based on the
// current locale’s configuration specified in the variable APP_LOCALE.

export const shouldHandlebmiAtCdicEntry = (fieldContext) => {
    // Retrieve the configuration as a JSON string from local storage.
    const configRaw = localStorage.getItem('appConfign'); 
    // Convert the JSON string into an object for easier handling.
    const config = JSON.parse(configRaw);
    const locale = APP_LOCALE;
    const fieldConfig = config && config[locale] && config[locale][fieldContext];
    // Return the value of 'handlebmiAtCdicEntry' if available; otherwise, return false as the default behavior.
    return fieldConfig ? fieldConfig.handlebmiAtCdicEntry : false;
};

// Checks if the most recent weight data should be actively managed based on the configured settings for the locale.
// This function accesses the configuration to determine if the management of the most recent weight data is enabled
// for the specific locale set in the application. This setting can be used to dynamically alter the behavior of the
// application based on localized configuration data.
//
// Parameters:
// fieldContext: A string that specifies the configuration context, such as 'createfield' or 'formstructure'.
//               This parameter helps identify the specific part of the configuration object that contains the required settings.
//
// Returns:
// A boolean value indicating whether the management of the most recent weight data is active (true) or not (false).
// It defaults to false if the configuration is undefined or if the setting is absent in the configuration.
//
// Example Usage:
// let manageRecentWeight = shouldHandleweightMostRecent("formstructure");
// This call evaluates whether the application should manage the most recent weight data based on the current locale's settings.

export const shouldHandleweightMostRecent = (fieldContext) => {
    // Retrieve the entire application configuration from local storage.
    const configRaw = localStorage.getItem('appConfign'); 
     // Parse the stored string to get a usable JavaScript object.
    const config = JSON.parse(configRaw);
    const locale = APP_LOCALE;
    const fieldConfig = config && config[locale] && config[locale][fieldContext];
    // Return the setting for managing the most recent weight data if available; otherwise, default to false.
    return fieldConfig ? fieldConfig.handleweightMostRecent : false;
};

// Determines whether the application should actively manage the most recent height data for a user.
// This function checks the application's configuration for settings specific to handling recent height records
// within the defined locale. It is useful for adapting the application's behavior to different regional needs or
// operational guidelines that may vary based on geographical or administrative requirements.
//
// Parameters:
// fieldContext: A string that identifies the specific section or context of the settings within the configuration
//               where the height management settings are defined. Examples include 'createfield' or 'formstructure'.
//
// Returns:
// A boolean value indicating if the application should handle recent height data based on the locale's configuration.
// It returns 'true' if handling is enabled, and 'false' otherwise (defaulting to 'false' if the setting is not specified).
//
// Example Usage:
// let manageRecentHeight = shouldHandleheightMostRecent("formstructure");
// This call determines whether to manage recent height measurements based on the configuration for the current locale.

export const shouldHandleheightMostRecent = (fieldContext) => {
    // Fetch the configuration from local storage as a JSON string.
    const configRaw = localStorage.getItem('appConfign'); 
    // Convert this JSON string into a JavaScript object to access its properties.
    const config = JSON.parse(configRaw);
    const locale = APP_LOCALE;
    const fieldConfig = config && config[locale] && config[locale][fieldContext];
    // Return the specific setting from the configuration; if it's not present, default to 'false'.
    return fieldConfig ? fieldConfig.handleheightMostRecent : false;
};

// Determines whether the application should manage the most recent BMI (Body Mass Index) data for a user.
// This function checks the application's configuration for settings related to handling recent BMI records
// within the defined locale context. This allows the application to adapt to different regional requirements or
// guidelines that may vary based on location or policy.
//
// Parameters:
// fieldContext: A string that identifies the specific section or context of the settings within the configuration
//               where BMI management settings are defined, such as 'createfield' or 'formstructure'.
//
// Returns:
// A boolean value indicating if the application should handle recent BMI data based on the configuration for the current locale.
// It returns 'true' if handling is enabled, and 'false' otherwise (defaulting to 'false' if the setting is not explicitly specified).
//
// Example Usage:
// let manageRecentBMI = shouldHandleBMIMostRecent("formstructure");
// This function call would check whether to manage recent BMI measurements based on settings for the current locale.

export const shouldHandleBMIMostRecent = (fieldContext) => {
    // Retrieve the configuration data from local storage as a JSON string.
    const configRaw = localStorage.getItem('appConfign'); 
    // Parse this JSON string into a JavaScript object to enable property access.
    const config = JSON.parse(configRaw);
    const locale = APP_LOCALE;
    const fieldConfig = config && config[locale] && config[locale][fieldContext];
    // Return the setting value for managing recent BMI; default to 'false' if it is not found.
    return fieldConfig ? fieldConfig.handleBMIMostRecent : false;
};

// Determines whether the application should manage height measurements in centimeters.
// This function retrieves configuration settings specific to height data handling within the
// designated context, which might vary by locale. This functionality is essential for adapting the application
// to accommodate different measurement units preferred across various regions or countries.
//
// Parameters:
// fieldContext: A string identifier for the part of the settings within the configuration related
//               to height data management. This could refer to a specific form or data entry section.
//
// Returns:
// A boolean value that indicates whether height measurements should be handled in centimeters according
// to the current locale's configuration. If true, the application will manage height in centimeters; otherwise,
// it defaults to false if the setting is unspecified.
//
// Example Usage:
// let manageHeightInCentimeters = shouldHandleheightidmetercm("createfield");
// This call checks whether height measurements in centimeters are to be handled, based on the settings
// for 'createfield' in the current locale's configuration.

export const shouldHandleheightidmetercm = (fieldContext) => {
    // Fetch the configuration data from local storage, stored as a JSON string.
    const configRaw = localStorage.getItem('appConfign'); 
    const config = JSON.parse(configRaw);
    const locale = APP_LOCALE;
    const fieldConfig = config && config[locale] && config[locale][fieldContext];
     // Return the configuration setting for handling height in centimeters, with a default of 'false'.
    return fieldConfig ? fieldConfig.handleheightIDmeterscms : false;
};

// Determines whether the application should manage height measurements in meters.
// This function retrieves configuration settings specific to height data handling within the
// designated context, which might vary by locale. This capability is crucial in adapting the application
// to support different measurement units preferred across various regions or countries.
//
// Parameters:
// fieldContext: A string identifier for the part of the settings within the configuration related
//               to height data management. This could refer to a specific form or data entry section.
//
// Returns:
// A boolean value that indicates whether height measurements should be handled in meters according
// to the current locale's configuration. If true, the application will manage height in meters; otherwise,
// it defaults to false if the setting is unspecified.
//
// Example Usage:
// let manageHeightInMeters = shouldHandleheightidmeter("createfield");
// This call checks whether height measurements in meters are to be handled, based on the settings
// for 'createfield' in the current locale's configuration.

export const shouldHandleheightidmeter = (fieldContext) => {
     // Fetch the configuration data from local storage, stored as a JSON string.
    const configRaw = localStorage.getItem('appConfign'); 
    // Convert this JSON string into a JavaScript object to facilitate property access.
    const config = JSON.parse(configRaw);
    const locale = APP_LOCALE;
    const fieldConfig = config && config[locale] && config[locale][fieldContext];
    // Return the configuration setting for handling height in meters, with a default of 'false'.
    return fieldConfig ? fieldConfig.handleheightIDmeters : false;
};

// Determines if the application should manage the "Any other" option within a specific context.
// This function fetches configuration settings that dictate whether additional, unspecified options
// should be included in data collection forms or interfaces, potentially varying by locale.
//
// Parameters:
// fieldContext: A string identifier for the specific part of the configuration that relates to
//               managing unspecified additional options in data entry sections.
//
// Returns:
// A boolean value indicating whether the "Any other" option should be handled according to the
// current locale's configuration settings. It returns true if "Any other" should be handled; otherwise,
// it defaults to false if the setting is not specified.
//
// Example Usage:
// let includeAnyOther = shouldHandleanyother("createfield");
// This would check whether to include an "Any other" option in the 'createfield' context based on the
// current locale's settings.

export const shouldHandleanyother = (fieldContext) => {
    const configRaw = localStorage.getItem('appConfign'); 
    const config = JSON.parse(configRaw);
    const locale = APP_LOCALE;
    const fieldConfig = config && config[locale] && config[locale][fieldContext];
    // Return whether the "Any other" option should be handled, defaulting to false if not specified.
    return fieldConfig ? fieldConfig.handleanyother : false;
};

// Determines if the application should manage the "Please Specify" option within a specific context.
// This function fetches configuration settings that dictate whether additional details should be
// requested when a particular option is selected, potentially varying by locale.
//
// Parameters:
// fieldContext: A string identifier for the specific part of the configuration that relates to
//               handling the "Please Specify" details in data entry sections.
//
// Returns:
// A boolean value indicating whether the "Please Specify" option should be handled according to the
// current locale's configuration settings. It returns true if it should be handled; otherwise,
// it defaults to false if the setting is not specified.
//
// Example Usage:
// let includePleaseSpecify = shouldHandleplsspecify("createfield");
// This would check whether to include a "Please Specify" option in the 'createfield' context based on the
// current locale's settings.

export const shouldHandleplsspecify = (fieldContext) => {
    const configRaw = localStorage.getItem('appConfign'); 
    const config = JSON.parse(configRaw);
    const locale = APP_LOCALE;
    const fieldConfig = config && config[locale] && config[locale][fieldContext];
     // Return whether the "Please Specify" option should be handled, defaulting to false if not specified.
    return fieldConfig ? fieldConfig.handleplsspecify : false;
};

// Determines if the application should sort events based on a specific context configuration.
// This is typically used to decide whether events or records should be displayed in a sorted order
// in various parts of the application, potentially varying by locale.
//
// Parameters:
// fieldContext: A string identifier for the specific part of the configuration that relates to
//               sorting events in the application. This could relate to various UI components
//               where event sorting is applicable.
//
// Returns:
// A boolean value indicating whether events should be sorted according to the configuration for
// the current locale. Returns true if sorting is enabled; otherwise, it defaults to false.
//
// Example Usage:
// let shouldSort = shouldSortEvents("eventDisplaySettings");
// This checks whether events should be sorted in the 'eventDisplaySettings' context based on the
// current locale's settings.

export const shouldSortEvents = (fieldContext) => {
    const configRaw = localStorage.getItem('appConfign'); 
    const config = JSON.parse(configRaw);
    const locale = APP_LOCALE;
    const fieldConfig = config && config[locale] && config[locale][fieldContext];
    return fieldConfig ? fieldConfig.sortEvents :false; // Fallback to false if not defined
};

// Determines whether the application should default to using the most recent event in a series
// based on the configuration for a specified context. This setting can affect how data is
// processed or displayed, particularly in scenarios where only the latest data is relevant.
//
// Parameters:
// fieldContext: A string that identifies the specific configuration context related to event handling
//               within the application. This helps tailor behavior based on different sections
//               or features of the application.
//
// Returns:
// A boolean indicating whether the most recent event should be used by default. If the configuration
// specifies that the last event should be used, it returns true. Otherwise, it defaults to false.
//
// Example Usage:
// let useLatest = shouldUseLastEvent("eventProcessing");
// This checks the configuration to see if the application should use the most recent event in the
// 'eventProcessing' context based on settings for the current locale.

export const shouldUseLastEvent = (fieldContext) => {
    const configRaw = localStorage.getItem('appConfign'); 
    const config = JSON.parse(configRaw);
    const locale = APP_LOCALE;
    const fieldConfig = config && config[locale] && config[locale][fieldContext];
     // Return whether to use the last event based on the locale-specific configuration,
    // defaulting to false if not explicitly specified.
    return fieldConfig ? fieldConfig.useLastEvent : false; // Fallback to true if not defined
};

// Determines whether the application should verify access permissions for follow-up actions
// based on the configuration settings for a specified context. This is often used in scenarios
// where follow-up actions require specific permissions or roles.
//
// Parameters:
// fieldContext: A string identifying the context within the configuration where this setting is defined,
//               allowing for different follow-up permission checks across various parts of the application.
//
// Returns:
// A boolean indicating whether access checks for follow-up actions are required. Returns true if
// the configuration specifies that checks are necessary, otherwise defaults to false.
//
// Example Usage:
// let requireAccessCheck = shouldCheckAccessForFollowup("patientFollowup");
// This checks if follow-up actions within the 'patientFollowup' context require access verification
// based on the settings for the current locale.

export const shouldCheckAccessForFollowup = (fieldContext) => {
     // Retrieve the configuration as a JSON string from local storage.
    const configRaw = localStorage.getItem('appConfign'); 
    const config = JSON.parse(configRaw);
    const locale = APP_LOCALE;
    const fieldConfig = config && config[locale] && config[locale][fieldContext];
     // Return whether access checks for follow-up actions are necessary based on the locale-specific
    // configuration, defaulting to false if not explicitly specified.
    return fieldConfig ? fieldConfig.checkAccessForFollowup : false; // Default to false if not defined
};

// Retrieves the database names from the configuration based on the specified field context.
// This allows dynamic database selection based on locale settings, useful for multi-regional
// applications where data storage requirements might vary by locale.
//
// Parameters:
// fieldContext: A string identifier for the specific configuration context, which determines
//               which database settings to use. This could correspond to different parts of the application
//               or different operational regions.
//
// Returns:
// An object containing database names. If specific database names are set in the configuration for
// the current locale and context, those are returned. Otherwise, default database names are provided.
//
// Example Usage:
// let dbNames = getDatabaseNames("userDataStorage");
// This retrieves the database configuration for storing user data, which might differ between locales.

export const getDatabaseNames = (fieldContext) => {
    const configRaw = localStorage.getItem('appConfign'); 
    const config = JSON.parse(configRaw);
    const locale = APP_LOCALE;
    const fieldConfig = config && config[locale] && config[locale][fieldContext];
    return fieldConfig || {
        defaultDB: 'CDIC_Generic_UI_DB', // Fallback default DB name
        appDB: 'CDIC_Generic_APP_DB'    // Fallback app DB name
    };
};

// Retrieves the header names for table or data display from the configuration based on the specified field context.
// This is useful in applications that require locale-specific header names which can vary based on the region
// or language preferences of the user.
//
// Parameters:
// fieldContext: A string that specifies the context within the configuration from which to fetch header names,
//               usually related to a specific feature or module within the application.
//
// Returns:
// An object containing header names. If header names are set in the configuration for the current locale
// and context, those are returned. Otherwise, default header names are provided.
//
// Example Usage:
// let headers = getHeaderNames("dataTableHeaders");
// This retrieves the headers for a data table which might be displayed differently in different locales.

export const getHeaderNames = (fieldContext) => {
    try {
        // Retrieve the configuration JSON string from local storage.
        const configRaw = localStorage.getItem('appConfign');
        if (configRaw) {
            const config = JSON.parse(configRaw);
            const locale = APP_LOCALE;
            if (config && config[locale] && config[locale][fieldContext]) {
                return config[locale][fieldContext].headers;
            }
        }
    } catch (error) {
        console.error("Failed to parse header configuration:", error);
    }
   // Fallback if there's no specific header configuration, providing default headers.
    return {
        patientName: "PatientName",
        gender: "Gender",
        age: "Age",
        dateOfRegistration: "Date of registration",
        uic: "UIC",
        phoneNumber: "phone number (permanent)",
        instance: "instance"
    };
};

// Retrieves UI settings from the configuration based on the specified field context.
// These settings determine visual elements such as whether to show images, the sources of the images,
// the CSS classes for images and text, and more. This function allows for dynamic UI customizations
// based on locale-specific configurations.
//
// Parameters:
// fieldContext: A string that specifies the context within the configuration from which to fetch UI settings,
//               usually associated with a particular UI component or page in the application.
//
// Returns:
// An object containing the UI settings necessary for rendering components according to locale-specific
// or application-specific requirements.
//
// Example Usage:
// let uiSettings = getUISettings("dashboardComponent");
// This might return settings for displaying certain elements on the dashboard differently in different locales.

export const getUISettings = (fieldContext) => {
    const configRaw = localStorage.getItem('appConfign');

        const config = JSON.parse(configRaw);
        const locale = APP_LOCALE;
        // Retrieve UI settings from the configuration for the given field context and locale.
        // If not defined, provide default settings.
        const uiSettings = config[locale][fieldContext]?.uiSettings || {
            showImage: false,
            imageSrc: "",
            imageClass: "",
            typographyClass: "title"
    };

    return uiSettings;

};

// Retrieves search-related settings from a global configuration based on the specified field context.
// This function is designed to adjust search features such as date formatting dynamically based
// on the configuration tied to a specific locale or field context, ensuring that search parameters
// align with user expectations and regional standards.
//
// Parameters:
// fieldContext: A string that indicates the context or part of the application for which search settings
//               are to be retrieved, enabling context-specific search configurations.
//
// Returns:
// An object containing the search settings, such as whether dates should be formatted, providing
// tailored behavior based on locale-specific configurations or default settings if no specific
// settings are found.
//
// Example Usage:
// let searchSettings = getSearchSettings("userSearch");
// This might configure the search behavior differently for users based on their locale, such as
// formatting dates in the 'yyyy-MM-dd' format in one locale and 'dd/MM/yyyy' in another.

export const getSearchSettings = (fieldContext) => {
    const configRaw = localStorage.getItem('appConfign');
    const config = JSON.parse(configRaw);
    const locale = APP_LOCALE; // Dynamically determines the current locale

    const fieldConfig = config && config[locale] && config[locale][fieldContext];
    return fieldConfig && fieldConfig.searchSettings ? fieldConfig.searchSettings : { formatDates: false };

};

// buildSearchQuery constructs a search query string dynamically based on the provided parameters
// and settings determined by a specific field context. This function is useful for creating 
// customized query strings for API requests where search conditions may vary by locale or user settings,
// such as formatting dates appropriately per locale.

// Parameters:
// param - An object where keys are attribute names and values are the search criteria for those attributes.
// fieldContext - A string identifying the specific context or part of the application for which 
//                search settings should be applied, allowing for contextual customization of the search logic.

// Returns:
// A string that represents a search query, formatted appropriately based on dynamic settings 
// such as date formatting. This query can be appended to an API endpoint URL.

// Example:
// let userSearchParams = { startDate: '2021-01-01', name: 'John Doe' };
// let searchQuery = buildSearchQuery(userSearchParams, 'userSearch');
// This could result in a string like "&startDate:LIKE:2021-01-01&name:LIKE:John Doe", assuming the
// date needs to be formatted according to the specified locale settings.

export const buildSearchQuery = (param, fieldContext) => {
    // Fetch settings for how the search should be conducted from a centralized configuration,
    // which may include locale-specific formatting rules, such as date formats.
    const settings = getSearchSettings(fieldContext);
    let searchQuery = '';
    // Iterate over each attribute in the parameters object.
    for (var i in param) {
        let temp = _.cloneDeep(param[i])
        // If the configuration dictates that dates should be formatted and the provided value is a valid date,
        // format the date according to the settings and append to the query string.
        if (settings.formatDates && moment(temp).isValid()) {
           
            searchQuery += `&attribute=${i}:LIKE:${moment(temp).format('YYYY-MM-DD')}`;
        } else {
             // For non-date or invalid date values, append the value as is to the query string.
            searchQuery += `&attribute=${i}:LIKE:${temp}`;
        }
    }

    return searchQuery;
};

// getOUMapping retrieves the Organizational Unit (OU) mapping configuration for a specified field context.
// This configuration determines how certain organizational data is structured and displayed,
// allowing for flexibility across different locales or operational regions.

// Parameters:
// fieldContext - A string identifying the specific context or part of the application
//                for which the OU mapping configuration should be applied.

// Returns:
// The specific OU mapping settings for the given field context from the configuration.
// If the configuration for the specified context is not defined, it returns an empty object.

export const getOUMapping = (fieldContext) => {
    const configRaw = localStorage.getItem('appConfign');
    const config = JSON.parse(configRaw);
    const locale = APP_LOCALE; 
    
   
    const fieldConfig = config[locale][fieldContext]?.settings || {
      
};
    return fieldConfig 

};

// checkConfign verifies the existence of a configuration section for a specified field context and locale.
// This helps ensure that the required configuration is available before proceeding with operations
// that depend on this configuration.

// Parameters:
// fieldContext - A string that identifies the specific part of the application for which the configuration
//                should be checked.

// Returns:
// true if the configuration exists for the specified locale and field context,
// false otherwise, with an error logged to the console.

export const checkConfign = (fieldContext) => {
    const configRaw = localStorage.getItem('appConfign');
    const config = JSON.parse(configRaw);
    const locale = APP_LOCALE; 
    // Check if the configuration exists for the given locale and field context.
    // It's important to ensure that both 'config' and 'config[locale]' are not undefined
    // before attempting to access 'config[locale][fieldContext]'.
    if (config && locale && config[locale] && fieldContext) {
     
       return true;
    } else {
        console.error("Configuration error: Missing locale or field context.");
        return false;
    }


};

// getHeaderCheckSettings retrieves settings for checking header configurations based on the specified field context.
// This can be used to determine if additional checks like column existence need to be performed on data headers.

// Parameters:
// fieldContext - A string identifier for the specific part of the application or configuration section
//                related to header checks.

// Returns:
// An object containing the settings for header checks. If no specific settings are found,
// it defaults to { checkColumnExistence: false }.

export const getHeaderCheckSettings = (fieldContext) => {
    const configRaw = localStorage.getItem('appConfign');
    const config = configRaw ? JSON.parse(configRaw) : {};
    const locale = APP_LOCALE;
    
    const headerChecks = config[locale] && config[locale][fieldContext] ? config[locale][fieldContext].headerChecks : null;
      // Return the header check settings if found; otherwise, provide a default value indicating
    // that column existence checks should not be performed.
    return headerChecks || { checkColumnExistence: false }; // Default to not checking existence
};

// checkColumn checks if the specified column in an object matches a given column name, with an optional existence check.

// Parameters:
// obj - The object containing the column to check.
// columnName - The name of the column to match against the object's column property.
// checkExistence - A boolean flag to determine if the existence of the column property should be verified before matching.

// Returns:
// A boolean indicating whether the column matches the specified columnName. If checkExistence is true,
// it also verifies that the column property exists on the object.

export const checkColumn = (obj, columnName, checkExistence) => {
     // Construct the condition based on whether the existence check is enabled.
    // If checkExistence is true, ensure both that the column exists and it matches the specified columnName.
    // If false, only match the column name without checking for existence.
    return checkExistence ? obj.column && obj.column.trim() === columnName : obj.column.trim() === columnName;
  };


  export const shouldIncludeCustomFieldObj_ = (fieldContext) => {
    // Retrieve the entire configuration from local storage.
    const configRaw = localStorage.getItem('appConfign'); 
    const config = JSON.parse(configRaw);
    // Fetch the current locale set in the application.
    const locale = APP_LOCALE;
    // Access the specific configuration for the given field context under the current locale.
    const fieldConfig = config && config[locale] && config[locale][fieldContext];
    // Return the 'formatDate' setting from the field configuration if it exists, otherwise default to false.
    return fieldConfig ? fieldConfig.includeCustomFieldObj : false;
};

// {
//     "en": {
//         "accordionSettings": {
//             "dynamicIds": false,
//             "defaultAriaControls": "panel1a-content",
//             "defaultAriaId": "panel1a-header"
//         }
//     },
//     "fr": {
//         "accordionSettings": {
//             "dynamicIds": true
//         }
//     },
//     "es": {
//         "accordionSettings": {
//             "dynamicIds": true
//         }
//     }
// }
// Accordion Settings: Under each locale, you can define settings specific to the AccordionSummary components:
// dynamicIds: A boolean that indicates whether the IDs should be dynamically generated based on the section.id. 
//If true, the component will generate IDs like panel-${section.id}-content. 
//If false, it will use default IDs provided in the settings.
// defaultAriaControls and defaultAriaId: Default values used when dynamicIds is set to false. 
//These provide fallback or standard IDs and controls descriptions that can be universally applied if dynamic generation isn't needed or wanted.

export const getAccordionSettings = (fieldContext) => {
    const configRaw = localStorage.getItem('appConfign');
    if (!configRaw) {
        console.error('Accordion settings cannot be loaded: No configuration found in local storage.');
        return {
            dynamicIds: false,
            defaultAriaControls: "panel1a-content",
            defaultAriaId: "panel1a-header"
        };
    }
    const config = JSON.parse(configRaw);
    const locale = APP_LOCALE;
    if (!config[locale] || !config[locale][fieldContext]) {
        console.error(`Accordion settings not found for ${locale} or ${fieldContext}`);
        return {
            dynamicIds: false,
            defaultAriaControls: "panel1a-content",
            defaultAriaId: "panel1a-header"
        };
    }
    const settings = config[locale][fieldContext].accordionSettings || {
        dynamicIds: false,
        defaultAriaControls: "panel1a-content",
        defaultAriaId: "panel1a-header"
    };
    return settings;
};
  
// {
//   "PRODUCT": {
//     "roleBasedSections": {
//       "CDIC-HCP": {
    //     "enableRoleBasedAccess": true,
//         "historyscreeningStageId": ["Refer for Revascularization", "Color Arterial Doppler", "PAD Diagnosis ", "Diabetic Foot Diagnosis ", "Habit Information "],
//         "advancedinvestigationsStageId": ["Other Tests "]
//       },
//       "DROP-HCP": {
  //      "enableRoleBasedAccess": true,
//         "advancedinvestigationsStageId": ["Lab Values"]
//       }
//     }
//   },
//   "CC004": {
//     "roleBasedSections": {
//       "CDIC-HCP": {
//         "historyscreeningStageId": ["Refer for Revascularization"]
//       },
//       "DROP-HCP": {
//         "advancedinvestigationsStageId": ["Lab Values", "Other Tests"]
//       }
//     }
//   }
// }

export const shouldDisplaySection = (userRole, stageId, sectionName, fieldContext) => {
    const configRaw = localStorage.getItem('appConfign');
    const config = JSON.parse(configRaw);
    const locale = APP_LOCALE;
    
    // Access the global settings for role-based access
    const roleBasedAccessConfig = config[locale][fieldContext];
    if (!roleBasedAccessConfig || !roleBasedAccessConfig.enableRoleBasedAccess) {
        return true;  // Default to showing sections if role-based access isn't enabled
    }

    if (!roleBasedAccessConfig.enableRoleBasedAccess) {
        return true;  // Default to showing sections if role-based access isn't enabled
    }
   
    // Access specific role configuration
    const roleConfigs = roleBasedAccessConfig[userRole];
    if (!roleConfigs) {
        console.warn(`No configuration found for role: ${userRole}`);
        return true; // Show section if no specific role config exists
    }
    // Handle cases where stageId is not relevant
    if (!stageId || !roleConfigs[stageId]) {
        // Check if there's a general hide rule for this section under this role, regardless of stage
        const generalSectionsToHide = roleConfigs.general ? roleConfigs.general : [];
        return !generalSectionsToHide.includes(sectionName);
    }

    if (stageId && roleConfigs[stageId]) {
        const sectionsToHide = roleConfigs[stageId] || [];

        if (sectionsToHide.includes(sectionName)) {
            console.info(`Hiding section '${sectionName}' in stage '${stageId}'`);
            return false; // Hide section
        }
    }

    // Specific stage handling
    const sectionsToHide = roleConfigs[stageId];
    return !sectionsToHide.includes(sectionName);  // Hide if section is in the list
};

export const checkRoleBasedAccess = (fieldContext) => {
    const configRaw = localStorage.getItem('appConfign');
    const config = JSON.parse(configRaw);
    const locale = APP_LOCALE;

    // Access the global settings for role-based access
    const roleBasedAccessConfig = config[locale][fieldContext];
    return roleBasedAccessConfig ? roleBasedAccessConfig.enableRoleBasedAccess : false; // Default to false if not defined
};

export const checkFieldCondition_dhis = (config, fieldContext, values, customfieldobj, fieldData) => {
   
    // Check for 'isDefaultDate'
    const isDefaultDate = fieldData.trackedEntityAttribute.attributeValues?.find(
        attr => attr.attribute.name === 'isDefaultDate' && attr.value === 'true'
    );
  
    // Returning true if 'isDefaultDate' is set and true
    if (isDefaultDate) {
        return true;
    } else {
        return false;
    }
};

export const checkFieldCondition_dhis_ = (fieldData) => {
   
    // Check for 'isDefaultDate'
    const isDefaultDate = fieldData.dataElement?.attributeValues?.find(
        attr => attr.attribute.name === 'isDefaultDate' && attr.value === 'true'
    );

    // Returning true if 'isDefaultDate' is set and true
    if (isDefaultDate) {
        return true;
    } else {
        return false;
    }
};


export const checkregistartiondate = (config, fieldContext, values, customfieldobj, fieldData) => {
   
    // Check for 'isDefaultDate'
    const isDefaultDate = fieldData.trackedEntityAttribute.attributeValues?.find(
        attr => attr.attribute.name === 'regDate' && attr.value === 'true'
    );
  
    // Returning true if 'isDefaultDate' is set and true
    if (isDefaultDate) {
        return true;
    } else {
        return false;
    }
};


export const checktrackattributeval = (fieldData,attributename_) => {
    // Check for 'isDefaultDate'
    const attributenameo = fieldData.trackedEntityAttribute.attributeValues?.find(
        attr => attr.attribute.name === attributename_ && attr.value === 'true'
    );

    // Log the condition check
    // Returning true if 'isDefaultDate' is set and true, false otherwise
    if (attributenameo) {
        return true;
    } else {
        return false;
    }
};

export const checkAttribute = (attributeValues, attributename) => {
    const attribute = attributeValues.find(
        attr => attr.attribute.name === attributename && attr.value === 'true'
    );

    return !!attribute; 
};



/**
 * Generates the Google Places autocompletion request configuration based on the program data.
 * @param {Object} programData - The data object containing attribute values and other configurations.
 * @returns {Object} The configuration for the GooglePlacesAutocomplete component's autocompletion request.
 */
export const getAutocompletionRequest = (programData) => {
    // Extract geoCode value if it exists
    const geoCode = programData.attributeValues?.find(attr => attr.attribute.name === "geoCode")?.value;

    // Construct and return the autocompletion request
    const autocompletionRequest = {
        bounds: [
            { lat: 50, lng: 50 },
            { lat: 100, lng: 100 }
        ],
        ...(geoCode && {
            componentRestrictions: {
                country: [geoCode],
            }
        })
    };

    return autocompletionRequest;
};

export const findAttributeIdsWithFlags = (programSections) => {
    let results = {
        ageId: null,
        dobId: null,
        calCustomAge:null,
        regDate:null
    };

 
    programSections.forEach(section => {
        // Looping through each trackedEntityAttribute in the section
        section.trackedEntityAttributes.forEach(attribute => {
         
            const ageFlag = attribute.attributeValues.find(av => 
                av.attribute.name === "ageFieldFlag" && av.value === "true"
            );
            if (ageFlag) {
                results.ageId = attribute.id;  
            }

          
            const dobFlag = attribute.attributeValues.find(av => 
                av.attribute.name === "dobFieldFlag" && av.value === "true"
            );
            if (dobFlag) {
                results.dobId = attribute.id;  
            }

            const customageFlag = attribute.attributeValues.find(av => 
                av.attribute.name === "calCustomAge" && av.value === "true"
            );
            if (customageFlag) {
                results.calCustomAge = attribute.id;  
            }

            const regdateFlag = attribute.attributeValues.find(av => 
                av.attribute.name === "regDate" && av.value === "true"
            );
            if (regdateFlag) {
                results.regDate = attribute.id;  
            }
        });
    });

    return results;
};

export const getKeyByValue = (object, searchValue) => {
    for (const [key, value] of Object.entries(object)) {
        if (value === searchValue) {
            return key; 
        }
    }
    return null; 
};

/**
 * Checks if the "CalcBMI" attribute is set to true for a matched stage.
 * @param {Object} fieldData - Object containing the current field data including the programStage info.
 * @param {Array} stagesList - Array of all stages from which to find the matching stage.
 * @returns {Boolean} - Returns true if the CalcBMI condition is met, false otherwise.
 */
export const checkCalcBMI = (fieldData, stagesList) => {
    const programStageId = fieldData.programStage?.id;

    // Find the matching stage from the stages list
    const matchedStage = stagesList.find(stage => stage.id === programStageId);

    if (!matchedStage) {
        return false;
    }

    // Check for the CalcBMI attribute and its value
    const calcBMIAttribute = matchedStage.attributeValues.find(attr => attr.attribute.name === "CalcBMI" && attr.value === "true");

    if (calcBMIAttribute) {
        return true;
    } else {
        return false;
    }
};

/**
 * Finds and returns the dataElement ID where the attribute "BMIFlag" is set to true.
 * @param {Object} fieldData - Field data containing dataElement and attribute values.
 * @returns {String|null} - The ID of the dataElement if the condition is met, null otherwise.
 */
export const getDataElementIdForBMIFlag = (fieldData,attributen) => {
    if (!fieldData.dataElement) {
        return null;
    }

    // Check if any attributeValues match the BMIFlag condition
    const hasBMIFlag = fieldData.dataElement.attributeValues?.some(
        attr => attr.attribute.name === attributen && attr.value === "true"
    );

    if (hasBMIFlag) {
        return fieldData.dataElement.id;
    } else {
        return null;
    }
};

/**
 * Retrieves the value of the specified attribute from the attributeValues array.
 * @param {Object[]} attributeValues - The array of attribute values from program data.
 * @param {String} attributeName - The name of the attribute to search for.
 * @returns {String|null} - The value of the attribute if found, null otherwise.
 */
export const getAttributeValue = (attributeValues, attributeName) => {
    const attribute = attributeValues.find(attr => attr.attribute.name === attributeName);
    if (attribute) {
        return attribute.value;
    } else {
        return null;
    }
};

/**
 * Calculates BMI based on the weight, height, and unit of measurement.
 * @param {number} weightKg - The weight of the person in kilograms.
 * @param {number} height - The height of the person in meters or centimeters.
 * @param {string} unit - The unit of height ('m' for meters, 'cm' for centimeters).
 * @returns {string} - The calculated BMI rounded to two decimal places as a string.
 */
export const dynamiccalculateBMI = (weightKg, height, unit) => {
    if (unit === 'm') {
        // If height is in meters, use the metric BMI calculation.
        return calculateBMIMetric(weightKg, height);
    } else if (unit === 'cm') {
        // If height is in centimeters, convert to meters and calculate using imperial method.
        return calculateBMIImperial(weightKg, height);
    } else {
        console.error('Unknown unit for BMI calculation:', unit);
        return 'Unknown unit';  
    }
};


export const getHtmlConfig = () => {
    const configRaw = localStorage.getItem('appConfign');
    if (configRaw) {
        const config = JSON.parse(configRaw);
        const locale = APP_LOCALE; // Ensure this is set to the correct locale
        if (config && config[locale] && config[locale].html) {
            return config[locale].html;
        }
    }
    return {
        metacontent: "Meta Content",
        title: "CDIC"
    };
};



/**
 * Gets the login configuration from appConfign based on the locale.
 * @returns {Object} - The login configuration.
 */
export const getLoginConfig = () => {
    const configRaw = localStorage.getItem('appConfign');
    const locale = APP_LOCALE; 
    
    if (!configRaw) {
        return null;
    }
    const config = JSON.parse(configRaw);
    
   
    if (config[locale] && config[locale].login) {
        return config[locale].login;
    }

  
    return config.login || {};
};

/**
 * Gets the login configuration from appConfign based on the locale.
 * @returns {Object} - The login configuration.
 */
export const getLangConfig = () => {
    const configRaw = localStorage.getItem('appConfign');
    const locale = APP_LOCALE; 
    
    if (!configRaw) {
        return null;
    }
    const config = JSON.parse(configRaw);
    
   
    if (config[locale] && config[locale].languagepref) {
        return config[locale].languagepref;
    }

  
    return config.languagepref || {};
};

//Only for Form Structure
// export const getDataElementIdByAttribute = (stage, attributeName) => {
//     const element = stage.find(el => {
//         return el.dataElement.attributeValues.some(attr => attr.attribute.name === attributeName && attr.value === 'true');
//     });
//     return element ? element.dataElement.id : null;
// };

// export const getDataElementIdByAttribute = (dataElements, attributeName) => {
//     // Ensure dataElements is an array
//     if (!Array.isArray(dataElements)) {
//         console.error("Expected an array of data elements");
//         return null;
//     }

//     const element = dataElements.find(el => {
//         return el.dataElement.attributeValues?.some(attr => attr.attribute.name === attributeName && attr.value === 'true');
//     });

//     return element ? element.dataElement.id : null;
// };

export const getDataElementIdByAttribute = (dataElement, attributeName) => {
    // Ensure dataElement is an object with the expected structure
    if (!dataElement || !dataElement.dataElement || !Array.isArray(dataElement.dataElement.attributeValues)) {
        console.error("Expected a data element with attributeValues array");
        return null;
    }

    const attributeValue = dataElement.dataElement.attributeValues.find(attr => 
        attr.attribute.name === attributeName && attr.value === 'true'
    );

    return attributeValue ? dataElement.dataElement.id : null;
};

export const getRangeValues = (currentStage, dataElementId) => {

    const dataElementObj = currentStage.programStageDataElements.find(element => element.dataElement.id === dataElementId);

    if (dataElementObj) {
     
        const rangeEnabled = dataElementObj.dataElement.attributeValues.find(attr => attr.attribute.name === 'rangeEnabled' && attr.value === 'true');
        
        if (rangeEnabled) {
        
            const lowRangeAttr = dataElementObj.dataElement.attributeValues.find(attr => attr.attribute.name === 'lowRange');
            const highRangeAttr = dataElementObj.dataElement.attributeValues.find(attr => attr.attribute.name === 'highRange');

         
            if (lowRangeAttr && highRangeAttr) {
                const lowRange = parseFloat(lowRangeAttr.value);
                const highRange = parseFloat(highRangeAttr.value);
                return { lowRange, highRange };
            } else {
                console.warn('Low range or high range attribute not found.');
                return null;
            }
        } else {
            console.warn('Range enabled attribute is not set to true.');
            return null;
        }
    } else {
        console.warn('Data element not found.');
        return null;
    }
};

/**
 * Gets the cookie configuration from appConfign based on the locale.
 * @returns {Object} - The login configuration.
 */
export const getCookieConfig = () => {
    const configRaw = localStorage.getItem('appConfign');
    const locale = APP_LOCALE; 
    
    if (!configRaw) {
        return null;
    }
    const config = JSON.parse(configRaw);
    
   
    if (config[locale] && config[locale].cookies) {
        return config[locale].cookies;
    }

  
    return config.cookies || {};
};

export const getPrivacypolicyConfig = () => {
    const configRaw = localStorage.getItem('appConfign');
    const locale = APP_LOCALE; 
    
    if (!configRaw) {
        return null;
    }
    const config = JSON.parse(configRaw);
    
   
    if (config[locale] && config[locale].privacypolicy) {
        return config[locale].privacypolicy;
    }

  
    return config.privacypolicy || {};
};

export const getUserconsentConfig = () => {
    const configRaw = localStorage.getItem('appConfign');
    const locale = APP_LOCALE; 
    
    if (!configRaw) {
        return null;
    }
    const config = JSON.parse(configRaw);
    
   
    if (config[locale] && config[locale].userconsent) {
        return config[locale].userconsent;
    }

  
    return config.userconsent || {};
};

export const getTermsConfig = () => {
    const configRaw = localStorage.getItem('appConfign');
    const locale = APP_LOCALE; 
    
    if (!configRaw) {
        return null;
    }
    const config = JSON.parse(configRaw);
    
   
    if (config[locale] && config[locale].termsofuse) {
        return config[locale].termsofuse;
    }

    return config.termsofuse || {};
};

// Function to find the matching id
export const findAgeFieldFlagId=(programData)=> {
    // Loop through each trackedEntityAttribute in the program
    const attributes = programData.programs[0].programTrackedEntityAttributes;
    
    for (const attributeObj of attributes) {
        const { trackedEntityAttribute } = attributeObj;
        
        // Check if attributeValues array contains an object with description 'ageFieldFlag'
        const hasAgeFieldFlag = trackedEntityAttribute.attributeValues.some(
            (attrValue) => attrValue.attribute.description === "ageFieldFlag"
        );
        
        // If ageFieldFlag is found, return the trackedEntityAttribute.id
        if (hasAgeFieldFlag) {
            return trackedEntityAttribute.id;
        }
    }
    
    // Return null or undefined if no match found
    return null;
}

// Function to find and compare ageFieldFlagId with keys in valuetosave
export const getValueForAgeFieldFlagId = (ageFieldFlagId, valuetosave) => {
    // Log the ageFieldFlagId for debugging

    // Check if the ageFieldFlagId exists as a key in valuetosave
    if (valuetosave.hasOwnProperty(ageFieldFlagId)) {
        // Return the value associated with the ageFieldFlagId key
        return valuetosave[ageFieldFlagId];
    }

    // If no match is found, return null
    return null;
};

// Function to find the value of the "ageLimit" attribute in programData
export const getAgeLimitValue = (programData) => {
    // Access the first program in the programs array
    const program = programData.programs[0];

    // Check if attributeValues exist
    if (program && program.attributeValues) {
        // Iterate over attributeValues to find the "ageLimit" attribute
        const ageLimitAttribute = program.attributeValues.find(
            (attributeValue) => attributeValue.attribute.name === "ageLimit"
        );

        // If ageLimit is found, return its value
        if (ageLimitAttribute) {
            return ageLimitAttribute.value;
        }
    }

    // Return null or undefined if "ageLimit" is not found
    return null;
};

export const maskText = (text) => {
    const length = text.length;
    const maskableLength = Math.ceil(length * 0.3); // 30% of the length
    const visibleLength = length - maskableLength;
    
    // If the length is less than 3 characters, mask the entire string
    if (length <= 3) return 'XXX';
    
    const visiblePart = text.slice(0, visibleLength); // Get the visible part
    const maskedPart = 'X'.repeat(maskableLength); // Create the mask

    return visiblePart + maskedPart;
};


export const setEncryptedItem = (key, value) => {
    try {
        const encryptedValue = encryptData(value);
        localStorage.setItem(key, encryptedValue);
    } catch (error) {
        console.error('Error setting item to local storage:', error);
    }
};


export const getDecryptedItem = (key) => {
    try {
        const encryptedValue = localStorage.getItem(key);
        if (encryptedValue) {
            return decryptData(encryptedValue);
        }
        return null;
    } catch (error) {
        console.error('Error getting item from local storage:', error);
        return null;
    }
};


export const isAccordionExpanded = () => {
    // Fetch the configuration JSON string from local storage.
    const configRaw = localStorage.getItem('appConfign'); 
    const locale = APP_LOCALE; 
    // Check if configRaw exists and parse it safely
    if (!configRaw) return false;
    
    const config = JSON.parse(configRaw);
    // Check if the necessary data exists in the config object
  

    if (config[locale] && config[locale].otherConfigs && config[locale].otherConfigs.accordianOpen) {
        return config[locale].otherConfigs.accordianOpen === "Yes";
    }

    // Default to false if the key is missing
    return false;
};

export const isDownloadPrescriptionEnabled = () => {
    // Fetch the configuration JSON string from local storage
    const configRaw = localStorage.getItem('appConfign'); 
    const locale = APP_LOCALE; 
    // If no configuration found, return false
    if (!configRaw) return false;
    
    try {
        // Parse the JSON string safely
        const config = JSON.parse(configRaw);

        // Check if the necessary key exists and normalize the value
       // const prescriptionValue = config[locale]?.otherConfigs?.downloadPrescription?.trim()?.toLowerCase();
        const prescriptionValue = config?.[locale]?.otherConfigs?.downloadPrescription?.trim()?.toLowerCase();

        return prescriptionValue === "yes" ? "Yes" : "No";
    } catch (error) {
        console.error("Error parsing appConfign from local storage:", error);
        return false;
    }
};


export const getHospitalName = () => {
    // Fetch the configuration JSON string from local storage
    const configRaw = localStorage.getItem('appConfign'); 
    const locale = APP_LOCALE; 
    // If no configuration found, return a default value
    if (!configRaw) return "";

    try {
        // Parse the JSON string safely
        const config = JSON.parse(configRaw);

        // Access and clean the hospital name
        let hospitalName = config?.[locale]?.otherConfigs?.hospitalName || "";
        // Remove unnecessary escape characters and trim spaces
        hospitalName = hospitalName.replace(/^"(.*)"$/, '$1').trim();

        return hospitalName;
    } catch (error) {
        console.error("Error parsing hospital name from appConfign:", error);
        return "";
    }
};

export const getHospitalAddress = () => {
    // Fetch the configuration JSON string from local storage
    const configRaw = localStorage.getItem('appConfign'); 
    const locale = APP_LOCALE; 
    // If no configuration found, return a default value
    if (!configRaw) return "";

    try {
        // Parse the JSON string safely
        const config = JSON.parse(configRaw);

        // Access and clean the hospital name
        let hospitalAddress = config?.[locale]?.otherConfigs?.hospitalAddress || "";
        // Remove unnecessary escape characters and trim spaces
        hospitalAddress = hospitalAddress.replace(/^"(.*)"$/, '$1').trim();

        return hospitalAddress;
    } catch (error) {
        console.error("Error parsing hospital name from appConfign:", error);
        return "";
    }
};

export const findAndReturnDataElement = (descriptionValue,dataElementArray) => {
    let dataElement = _.find(dataElementArray, function(item) {
        return item.dataElement.description == descriptionValue; 
    })
    return dataElement;
}

export const getPhonecodevalidations = () => {
    const configRaw = localStorage.getItem('appConfign');
    const locale = APP_LOCALE; 
    
    if (!configRaw) {
        return null;
    }
    const config = JSON.parse(configRaw);
    
   
    if (config[locale] && config[locale].phoneCodes) {
        return config[locale].phoneCodes;
    }

    return config.phoneCodes || {};
};

export const getLabexcludevalues = () => {
    const configRaw = localStorage.getItem('appConfign');
    const locale = APP_LOCALE; 
    
    if (!configRaw) {
        return null;
    }
    const config = JSON.parse(configRaw);
    
   
    if (config[locale] && config[locale].excludelabtest) {
        return config[locale].excludelabtest;
    }

    return config.excludelabtest || {};
};

export const getGlucoseSettings = () => {
    const configRaw = localStorage.getItem('appConfign');
    const locale = APP_LOCALE; 
    
    if (!configRaw) {
        return null;
    }
    const config = JSON.parse(configRaw);
    
   
    if (config[locale] && config[locale].glucoseMonitoring) {
        return config[locale].glucoseMonitoring;
    }

    return config.glucoseMonitoring || {};
};

//GET BMI CATEGORY

export const getBMICategory = () => {
    const configRaw = localStorage.getItem('appConfign');
    const locale = APP_LOCALE;

    if (!configRaw) {
        return null;
    }

    const config = JSON.parse(configRaw);

    if (config[locale] && config[locale].BMICATEGORY) {
        return config[locale].BMICATEGORY;
    }

    return config.BMICATEGORY || [];
};

//GET BMI Z CATEGORY

export const getBMIZScoreCategory = () => {
    const configRaw = localStorage.getItem('appConfign');
    const locale = APP_LOCALE;

    if (!configRaw) {
        return null;
    }

    const config = JSON.parse(configRaw);

    if (config[locale] && config[locale].ZSCORECATEGORY) {
        return config[locale].ZSCORECATEGORY;
    }

    return config.ZSCORECATEGORY || [];
};

