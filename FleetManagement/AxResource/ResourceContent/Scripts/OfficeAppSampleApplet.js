/*!
// <copyright file="SampleApplet.js" company="Microsoft">
//     Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
*/

/// <var type="Object">
/// This is a sample of how to implement an applet. Grouping functions of an applet gives the benefit
/// of not muddying up the global scope and can aid in testability.
/// </var>
var sampleApplet = {

    /// <field type="Object">The settings for the applet.</field>
    Settings: undefined,

    /// <field type="Object">The options leveraged internally within the applet.</field>
    Options: {

        /// <field type="String">An example string option that can be used to alter flow within the applet.</field>
        StringOption: "Default String Value"
    },

    /// <field type="Object">The controls used within the applet.</field>
    Controls: {

        /// <field type="jQuery">The label for the input control.</field>
        ExcelInputLabel: undefined,

        /// <field type="jQuery">The input control used to proxy values between the workbook and the applet.</field>
        ExcelInput: undefined,

        /// <field type="jQuery">The button that applies the value from the input back to the workbook.</field>
        ApplyButton: undefined,

        /// <field type="jQuery">The button that converts the value from the input into upper case.</field>
        ToUpperCaseButton: undefined,

        /// <field type="jQuery">The button that converts the value from the input into lower case.</field>
        ToLowerCaseButton: undefined
    },

    /// <field type="Object">
    /// This contains keys for label resolution. The globalize functionality only requires a string, by using a label key
    /// object helps avoid scattered string literals throughout the file. Each string label should be unique within the applet,
    /// so if multiple JavaScript files are in use within the applet, prefixing a label with the file name helps ensure the
    /// labels remain unique.
    /// </field>
    LabelKeys: {

        /// <field type="String">The key for the applet title label.</field>
        AppletTitle: "SampleApplet_AppletTitle",

        /// <field type="String">The key for the Excel input label.</field>
        ExcelInputLabel: "SampleApplet_ExcelInputLabel",

        /// <field type="String">The key for the apply button label.</field>
        ApplyButtonLabel: "SampleApplet_ApplyButtonLabel",

        /// <field type="String">The key for the to upper case label.</field>
        ToUpperCaseButtonLabel: "SampleApplet_ToUpperCaseButtonLabel",

        /// <field type="String">The key for the to lower case label.</field>
        ToLowerCaseButtonLabel: "SampleApplet_ToLowerCaseButtonLabel",

        /// <field type="String">The key for the sample option group label.</field>
        SampleOptionGroup: "SampleApplet_SampleOptionGroup",

        /// <field type="String">The key for the sample option label.</field>
        SampleOption: "SampleApplet_SampleOption",

        /// <field type="String">The key for the configured applet notification label.</field>
        ConfiguredAppletNotification: "SampleApplet_ConfiguredAppletNotification",

        /// <field type="String">The key for the initializing applet error label.</field>
        InitializingAppletError: "SampleApplet_InitializingAppletError",

        /// <field type="String">The key for the document event subscription error label.</field>
        DocumentEventSubscriptionError: "SampleApplet_DocumentEventSubscriptionError",

        /// <field type="String">The key for the save settings error format label.</field>
        SaveSettingsErrorFormat: "SampleApplet_SaveSettingsErrorFormat",

        /// <field type="String">The key for the unable to set document value error label.</field>
        UnableToSetDocumentValueError: "SampleApplet_UnableToSetDocumentValueError",

        /// <field type="String">The key for the convert to upper case confirmation message label.</field>
        ConvertToUpperCaseConfirmationMessage: "SampleApplet_ConvertToUpperCaseConfirmationMessage",

        /// <field type="String">The key for the convert to lower case confirmation message label.</field>
        ConvertToLowerCaseConfirmationMessage: "SampleApplet_ConvertToLowerCaseConfirmationMessage",

        /// <field type="String">The key for the options updated notification format label.</field>
        OptionsUpdatedNotificationFormat: "SampleApplet_OptionsUpdatedNotificationFormat"
    }
};

// This is how we add labels for an applet. It's important to avoid using string literals in the applet so we can properly localize
// the strings for the current culture. Each of the earlier defined label keys should be assigned a label in the createLabels()
// function below. We can then leverage $label([label key]) to resolve a label. Furthermore, if formatting is required, we can use
// $format([format string], args...) to replace format parameters with argument values. For example we can use $format like the
// following:
// var message = $format("This is the {0} applet", "sample");
// Which would resolve to: "This is the sample applet". We can combine labels and formats together to achieve localized format strings.
Globalize.addCultureInfo("EN-US", {
    messages: function createLabels() {
        var labels = {};
        labels[sampleApplet.LabelKeys.AppletTitle] = "Sample Applet";
        labels[sampleApplet.LabelKeys.ExcelInputLabel] = "Excel value";
        labels[sampleApplet.LabelKeys.ApplyButtonLabel] = "Apply";
        labels[sampleApplet.LabelKeys.ToUpperCaseButtonLabel] = "To Upper Case";
        labels[sampleApplet.LabelKeys.ToLowerCaseButtonLabel] = "To Lower Case";
        labels[sampleApplet.LabelKeys.SampleOptionGroup] = "Sample Group";
        labels[sampleApplet.LabelKeys.SampleOption] = "Sample String Option";
        labels[sampleApplet.LabelKeys.ConfiguredAppletNotification] = "Configured sample applet";
        labels[sampleApplet.LabelKeys.InitializingAppletError] = "Error initializing Sample Applet";
        labels[sampleApplet.LabelKeys.DocumentEventSubscriptionError] = "Unable to subscribe to document selection changed";
        labels[sampleApplet.LabelKeys.SaveSettingsErrorFormat] = "Unable to save {0}'s updated options";
        labels[sampleApplet.LabelKeys.UnableToSetDocumentValueError] = "Unable to set value into document";
        labels[sampleApplet.LabelKeys.ConvertToUpperCaseConfirmationMessage] = "Are you sure you want to convert the value to upper case?";
        labels[sampleApplet.LabelKeys.ConvertToLowerCaseConfirmationMessage] = "Are you sure you want to convert the value to lower case?";
        labels[sampleApplet.LabelKeys.OptionsUpdatedNotificationFormat] = "String option was updated to \"{0}\"";
        return labels;
    }()
});

sampleApplet.onDocumentReady = function () {
    /// <summary>
    /// This is the function that we configured in the HTML to execute once Office is initialized. It will
    /// configure the applet's messaging. At this point in the app, no messaging can be performed to the app,
    /// the app has to request to configure the applet first.
    /// </summary>

    // We configure messaging by providing the following callbacks:
    // - First a callback used to configure the applet, which takes the applet's settings as a parameter and returns the
    //   options for the applet (an array of appletMessaging.OptionsGroup objects).
    // - Second a callback used to initialize the applet. This is the first point where messaging to the app can be
    //   performed. This callback can be used to perform any additional setup like subscribing to Office events.
    // - Third a callback that is performed whenever the applet's options are changed. The callback takes the applet's
    //   current options (an array of appletMessaging.OptionsGroup objects) as its only parameter.
    // - Fourth a callback that is performed whenever the app's language is changed. The callback takes a string representing
    //   the new app language as its only parameter.
    appWrapper.configureMessaging(
        sampleApplet.configure,
        sampleApplet.initialize,
        sampleApplet.optionsChanged,
        sampleApplet.languageChanged);
};

sampleApplet.configure = function (settings, language, configuredCallback) {
    /// <summary>
    /// This is the function that is called once the app has requested to configure the applet. It takes the applet's settings
    /// and the current language as parameters and returns the applet's options (an array of appletMessaging.OptionsGroup objects).
    //  At this point the applet still cannot safely perform messaging to the app, so should not leverage appWrapper or 
    /// officeWrapper. The method should likely store off the settings (if applicable), initialize any controls, apply any labels, 
    /// and perform any other setup that doesn't require communication with the app; try to do as much setup here as possible as once 
    /// this method completes the app may make the applet visible, so the applet should apply any labels or styling before this
    /// method completes.
    /// </summary>
    /// <param name="settings" type="Object">
    /// The applet's current settings. This may be undefined if there are no settings currently stored for the applet, or if the applet
    /// doesn't use settings.
    /// </param>
    /// <param name="language" type="String">
    /// A string representing the app's current language. This should be used to localize any user-facing labels displayed by the applet.
    /// </param>
    /// <param name="configuredCallback" type="Function">
    /// The callback to perform once the applet is configured. The callback takes as its only parameter the configuration information for 
    /// the applet including the applet's options.
    /// </param>

    resources.setLanguage(language, "../../OfficeApps/Resources", "../../OfficeApps/Public/ext/globalize", function languageConfigured(setLanguage) {

        // It's possible no settings will be provided, namely if this is the first time launching the applet. As such
        // handle the settings accordingly, and likely save them off so the applet can save them back to the applet later.
        if (settings === undefined) {
            settings = {
                Options: sampleApplet.Options
            };
        }

        sampleApplet.Settings = settings;
        if (sampleApplet.Settings.Options === undefined) {
            sampleApplet.Settings.Options = sampleApplet.Options;
        } else {
            sampleApplet.Options = sampleApplet.Settings.Options;
        }

        // Find controls
        sampleApplet.Controls.ExcelInputLabel = $("#valueInputLabel");
        sampleApplet.Controls.ExcelInput = $("#valueInput");
        sampleApplet.Controls.ApplyButton = $("#applyButton");
        sampleApplet.Controls.ToUpperCaseButton = $("#toUpperCaseButton");
        sampleApplet.Controls.ToLowerCaseButton = $("#toLowerCaseButton");

        // Apply control labels. Note that we leverage the label keys and $label() to resolve labels for the controls
        // instead of hard coding strings for the labels here or in the HTML.
        sampleApplet.Controls.ExcelInputLabel.text($label(sampleApplet.LabelKeys.ExcelInputLabel));
        sampleApplet.Controls.ApplyButton.text($label(sampleApplet.LabelKeys.ApplyButtonLabel));
        sampleApplet.Controls.ToUpperCaseButton.text($label(sampleApplet.LabelKeys.ToUpperCaseButtonLabel));
        sampleApplet.Controls.ToLowerCaseButton.text($label(sampleApplet.LabelKeys.ToLowerCaseButtonLabel));

        // Bind control event handlers
        sampleApplet.Controls.ApplyButton.click(sampleApplet.applyValue);
        sampleApplet.Controls.ToUpperCaseButton.click(sampleApplet.toUpper);
        sampleApplet.Controls.ToLowerCaseButton.click(sampleApplet.toLower);

        // Determine options
        var sampleOption = new appletMessaging.OptionInformation(appletMessaging.OptionInformation.Types.String, $label(sampleApplet.LabelKeys.SampleOption), sampleApplet.Options.StringOption);
        var sampleOptionsGroup = new appletMessaging.OptionsGroup($label(sampleApplet.LabelKeys.SampleOptionGroup));
        sampleOptionsGroup.Options.push(sampleOption);

        // Return back the configuration for the applet, containing the applet's options
        configuredCallback(new appWrapper.AppletConfig([sampleOptionsGroup]));
    });
};

sampleApplet.initialize = function () {
    /// <summary>
    /// This is the function that initializes the applet. This is the first point where messaging can be safely sent to the app.
    /// This is a good place to wrap up any initialization of the applet like subscribing to Office events or communicating
    /// with resources.
    /// </summary>

    // This is how to add a notification; you can provide additional customization by providing options
    appWrapper.addNotification($label(sampleApplet.LabelKeys.ConfiguredAppletNotification));

    // This is how to subscribe to document events. There is an additional mechanism to subscribe to table binding events. The
    // method takes an array of subscriptions that tie callbacks to Office events and a callback to perform when all the event
    // subscriptions have completed. The callback can be used to display errors or continue workflows within the applet.
    officeWrapper.subscribeToDocumentEvents(
        [new officeWrapper.EventSubscription(officeWrapper.EventType.DocumentSelectionChanged, sampleApplet.documentSelectionChanged)],
        function documentEventsSubscribed(officeResult) {

            // The office result contains a success indicator, among other properties, which can be used to easily determine
            // if an operation succeeded or failed
            if (!officeResult.Success) {

                // This is how to display an error to the user; you can provide additional customization by providing options
                appWrapper.showError(
                    $label(sampleApplet.LabelKeys.InitializingAppletError),
                    {
                        Details: $label(sampleApplet.LabelKeys.DocumentEventSubscriptionError)
                    });
            }
        });
};

sampleApplet.optionsChanged = function (options) {
    /// <summary>
    /// This is the function that is called when the applet's options have been changed. It is sent the applet's current options
    /// (an array of appletMessaging.OptionsGroup objects). This is a good place to apply the option internally and save the option
    /// through whatever mechanism is used to save the applet's options (quite possibly the document's settings).
    /// </summary>
    /// <param name="options" type="Array" elementType="appletMessaging.OptionsGroup">
    /// The applet's current options, one or more of which have just been updated.
    /// </param>

    // Apply the option internally. You index the option first by the index of the option group, then by the index of the option
    // within that option group. In this case we only had one option group which contained only one option.
    sampleApplet.Settings.Options.StringOption = options[0].Options[0].Value;

    // This is how to add a notification; you can provide additional customization by providing options
    appWrapper.addNotification(
        $format($label(sampleApplet.LabelKeys.OptionsUpdatedNotificationFormat), sampleApplet.Settings.Options.StringOption),
        {
            IncludeTimeStamp: false
        });

    // Save the settings
    appWrapper.saveSettings(sampleApplet.Settings, function (appResult) {

        // The app result contains a success indicator, among other properties, which can be used to easily determine
        // if an operation succeeded or failed
        if (!appResult.Success) {

            // This is another example of how to display an error to the user. Additionally, it shows how to use $format() in conjunction with
            // $label() to format a label with format parameters. In this case we're providing the applet's title as the format parameter.
            appWrapper.showError($format($label(sampleApplet.LabelKeys.SaveSettingsErrorFormat), $label(sampleApplet.LabelKeys.AppletTitle)));
        }
    });
};

sampleApplet.languageChanged = function (language) {
    /// <summary>
    /// This is the function that is called when the user changes the app's language. It is sent a string representing the new language.
    /// This function should update the applet's UI elements to display labels in the new language.
    /// </summary>
    /// <param name="language" type="String">The new language.</param>

    // TODO: Need to work through localization (TFS#3325426)
};

sampleApplet.documentSelectionChanged = function (eventArgs) {
    /// <summary>
    /// This is the function we subscribed to the document selection changed event in the initialize() method. This function will be
    /// executed any time a selection changes within the document, and sent a clone of the event args (see Apps for Office 
    /// Document.SelectionChanged event); the event args will omit any members that aren't cloneable, like functions.
    /// </summary>
    /// <param name="eventArgs" type="DocumentSelectionChangedEventArgs">
    /// A clone of the event args encountered from the document selection changed event.
    /// </param>

    // This is an example of how to retrieve the document's current selection (see Apps for Office Document.getSelectedDataAsync()).
    // The callback for most Office wrapper operations, including getSelectedDocumentData(), takes a single officeWrapper.OfficeResult object,
    // which indicates success of the operation, and contains all results from the operation.
    officeWrapper.getSelectedDocumentData(officeWrapper.CoercionType.Matrix, function getSelectedDataCompleted(officeResult) {

        // The Office result contains a method to retrieve the final result, which is guaranteed to return a cloned Office AsyncResult (either
        // the last result encountered or a generated result if errors occurred during the Office operation). Typically an applet would
        // retrieve the final result and then check the status of the result to ensure the operation was successful before acting on the result.
        var asyncResult = officeResult.getFinalResult();

        // We verify the result succeeded and that only one row and one column is selected before we enable the controls; otherwise we clear
        // the input value and disable all controls. How an applet acts on a selection is up to that applet, this is just an example of how
        // we can interrogate the value of the result an alter behavior accordingly.
        if (asyncResult.status === officeWrapper.AsyncResultStatus.Succeeded && asyncResult.value.length === 1 && asyncResult.value[0].length === 1) {

            // Set the input value to the selection value and enable all controls (removing the "disabled" attribute)
            sampleApplet.Controls.ExcelInput.val(asyncResult.value[0]);
            sampleApplet.Controls.ExcelInput.removeAttr("disabled");
            sampleApplet.Controls.ApplyButton.removeAttr("disabled");
            sampleApplet.Controls.ToUpperCaseButton.removeAttr("disabled");
            sampleApplet.Controls.ToLowerCaseButton.removeAttr("disabled");
        } else {

            // Clear the input value and disable all controls (adding a "disabled" attribute set to "disabled")
            sampleApplet.Controls.ExcelInput.val("");
            sampleApplet.Controls.ExcelInput.attr("disabled", "disabled");
            sampleApplet.Controls.ApplyButton.attr("disabled", "disabled");
            sampleApplet.Controls.ToUpperCaseButton.attr("disabled", "disabled");
            sampleApplet.Controls.ToLowerCaseButton.attr("disabled", "disabled");
        }
    });
};

sampleApplet.applyValue = function () {
    /// <summary>
    /// This is the function we bound to the apply button's click event in configure(). Whenever the apply button is clicked
    /// this function will apply the input's current value to the document's selection.
    /// </summary>

    // This is an example of how to set the document's current selection value (see Apps for Office Document.setSelectedDataAsync()).
    // The callback for most Office wrapper operations, including getSelectedDocumentData(), takes a single officeWrapper.OfficeResult object,
    // which indicates success of the operation, and contains all results from the operation.
    officeWrapper.setSelectedDocumentData(sampleApplet.Controls.ExcelInput.val(), function setSelectedDataCompleted(officeResult) {

        // Retrieve the final cloned Office AsyncResult, which we can determine success from
        var asyncResult = officeResult.getFinalResult();

        // If the set selected document data operation was unsuccessful, display an error to the user
        if (asyncResult.status !== officeWrapper.AsyncResultStatus.Succeeded) {
            appWrapper.showError($label(sampleApplet.LabelKeys.UnableToSetDocumentValueError));
        }
    });
};

sampleApplet.toUpper = function () {
    /// <summary>
    /// This is the function we bound to the to upper case button's click event in configure(). Whenever the to upper case button is clicked
    /// this function will prompt the user to verify they want to convert the value to upper case, and upon a user indicating they do, will 
    /// convert the input's current value to upper case.
    /// </summary>

    // This is an example of how to prompt the user for a boolean response. The verbiage should be worded as a question. The callback will be
    // sent a boolean response indicated if the user clicked "Yes" (a value of true) or "No" (a value of false).
    appWrapper.promptUser($label(sampleApplet.LabelKeys.ConvertToUpperCaseConfirmationMessage), function (userResponse) {

        // If the user indicated they want to convert the value to upper case, convert the input's value to upper case
        if (userResponse) {
            sampleApplet.Controls.ExcelInput.val(sampleApplet.Controls.ExcelInput.val().toUpperCase());
        }
    });
};

sampleApplet.toLower = function () {
    /// <summary>
    /// This is the function we bound to the to lower case button's click event in configure(). Whenever the to lower case button is clicked
    /// this function will prompt the user to verify they want to convert the value to lower case, and upon a user indicating they do, will 
    /// convert the input's current value to lower case.
    /// </summary>

    // This is an example of how to prompt the user for a boolean response. The verbiage should be worded as a question. The callback will be
    // sent a boolean response indicated if the user clicked "Yes" (a value of true) or "No" (a value of false).
    appWrapper.promptUser($label(sampleApplet.LabelKeys.ConvertToLowerCaseConfirmationMessage), function (userResponse) {

        // If the user indicated they want to convert the value to lower case, convert the input's value to lower case
        if (userResponse) {
            sampleApplet.Controls.ExcelInput.val(sampleApplet.Controls.ExcelInput.val().toLowerCase());
        }
    });
};
// SIG // Begin signature block
// SIG // MIInKQYJKoZIhvcNAQcCoIInGjCCJxYCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // b0dlQhhxd2eeawoNk1/mgK3FgbeoAkdFlQOoWUQ88nWg
// SIG // ggy6MIIF9TCCA92gAwIBAgITMwAAAh1NGchO1w9XSAAA
// SIG // AAACHTANBgkqhkiG9w0BAQsFADBXMQswCQYDVQQGEwJV
// SIG // UzEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBTaWduaW5n
// SIG // IFBDQSAyMDI0MB4XDTI2MDQxNjE4NTk0M1oXDTI3MDQx
// SIG // NTE4NTk0M1owdDELMAkGA1UEBhMCVVMxEzARBgNVBAgT
// SIG // Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
// SIG // BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEeMBwG
// SIG // A1UEAxMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMIIBIjAN
// SIG // BgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0L3sF8cf
// SIG // YGWRQumLNVgWsvASfJBgOCUJx+QjGn6jgEpU6SvR/KOW
// SIG // V017dHGlUEzTFD7eOOcF2A/nRbWilk8A59SOdqFEqwvb
// SIG // yYp9RrKrfs8iiS+Q4N3kF20DUetQ5jMttBi0yDt0hXnf
// SIG // UX4v6KYYAixhSw0d69Crx48DG/42FktHHpVf+C89uy3w
// SIG // HpJvL/ROSF2nol2wFGGSitPdJ+AlZdyQbWzfvQ7SPUjb
// SIG // v8o76M1udv7u0V/07aWvyg5abqJGfmXG75rXfbq/YBS7
// SIG // 2c4eNaPTLBP3JULXWhVhr7qOibmv57aYJHstxOf7wRXv
// SIG // jCTxuqYXZ7qOq+e2bnQrnYiNWwIDAQABo4IBmzCCAZcw
// SIG // DgYDVR0PAQH/BAQDAgeAMB8GA1UdJQQYMBYGCisGAQQB
// SIG // gjdMCAEGCCsGAQUFBwMDMB0GA1UdDgQWBBR+kLjMKnDx
// SIG // tIUJUOnOYwrU0y61XjBFBgNVHREEPjA8pDowODEeMBwG
// SIG // A1UECxMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMRYwFAYD
// SIG // VQQFEw0yMzAwMTIrNTA3NTU5MB8GA1UdIwQYMBaAFH9Z
// SIG // P1Qh2q1P7wXl5qPXLQaUEggxMGAGA1UdHwRZMFcwVaBT
// SIG // oFGGT2h0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2lv
// SIG // cHMvY3JsL01pY3Jvc29mdCUyMENvZGUlMjBTaWduaW5n
// SIG // JTIwUENBJTIwMjAyNC5jcmwwbQYIKwYBBQUHAQEEYTBf
// SIG // MF0GCCsGAQUFBzAChlFodHRwOi8vd3d3Lm1pY3Jvc29m
// SIG // dC5jb20vcGtpb3BzL2NlcnRzL01pY3Jvc29mdCUyMENv
// SIG // ZGUlMjBTaWduaW5nJTIwUENBJTIwMjAyNC5jcnQwDAYD
// SIG // VR0TAQH/BAIwADANBgkqhkiG9w0BAQsFAAOCAgEASk22
// SIG // Do88Exvw1xms/bOvn0Hmk7Q3BZjGPuVMlRQso+z7/uYt
// SIG // +6n1/JUi/7QSH2EH1rDLgUJX2bqyQ+q+B1Sdgnh/tX4I
// SIG // qvHXB3VSqGd0mtql6F93KvYkvHFW9Oge/uf1yeyNDsRx
// SIG // /Xw7Lyd098OVf2bQCBZi65fj9ArRvvdrs0bJ9J023RYz
// SIG // pCzC1jywFN0x6ISkZUhDIBSaT5JuZ+VAGd+cV+hVgqwy
// SIG // 7Eim+eeW04n8GvJiQcHZaH9G5n2InR/ncWdRXQ8by5zZ
// SIG // fc3irAOJHo2miKqiD4LocALYuUJewZUzaCTcMQrwZqlt
// SIG // jEC5wpGDf1VVLEd1dsf63Ezc6AX/2f0qUTr3WgNmTjnd
// SIG // boqFybd7XS0O7x6aqYm9Cn1q/xVl1tdKt/FcXwp0UAas
// SIG // 20rs7Ue5xDLs1+wpPgf12jw13daoe9vkGMgdGdlc1pjv
// SIG // c7J2/VKv3cLvCxnkKp8ruu0gxgAr514otn2/flEuPdlU
// SIG // 510pxSsqsIM1MhTLWStf7B2E7+mxuE7UFMoEMUzfmVfm
// SIG // iSJSjtjKme2yqwJzs0vZujYKE3VjqtdW0zmcCpSBFfxI
// SIG // VfUlpA5naUf4Tz09r+kxI+BfD0/8x40XsyFOXPwxpbf1
// SIG // YWP6StF5CbRMjJpktQTLY1P66gWVTCJt3Z8ULP0wQcq/
// SIG // gn/Gda+2on0FUPlkqs4wgga9MIIEpaADAgECAhMzAAAA
// SIG // OTu2Nxm/Bh1nAAAAAAA5MA0GCSqGSIb3DQEBDAUAMIGI
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMTIwMAYDVQQDEylNaWNy
// SIG // b3NvZnQgUm9vdCBDZXJ0aWZpY2F0ZSBBdXRob3JpdHkg
// SIG // MjAxMTAeFw0yNDA4MDgyMDU0MThaFw0zNjAzMjIyMjEz
// SIG // MDRaMFcxCzAJBgNVBAYTAlVTMR4wHAYDVQQKExVNaWNy
// SIG // b3NvZnQgQ29ycG9yYXRpb24xKDAmBgNVBAMTH01pY3Jv
// SIG // c29mdCBDb2RlIFNpZ25pbmcgUENBIDIwMjQwggIiMA0G
// SIG // CSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQDYAZwe4zjH
// SIG // qpUWBzWtuub+CGPXx/EyoXph3zyDXtYKS2ld3YYN9uFs
// SIG // B9Oi3B26Z7AbpAgzYra8qNHbUvxFuiP8hC/2y0mPISqW
// SIG // 30LlrrAT6/ams2HA8Qlv6p42+SbCNbPGzToN21QE70FS
// SIG // +LXH9N2k8nLM/EHgnTNJf8h0TmyfUKmszNa+lTxDieyy
// SIG // /rhBG+98OkArobPPWtbr9c3qzmDJ7J3kUcAm6cltdSHI
// SIG // IFNHESgw6taY1ScyGyBevqIl120XjrIHiPM7tRckHytH
// SIG // 1ZGsmvEplR0P7Tn9t5meFvZNEYttkFvad1IEguTlA5LS
// SIG // scXAphi+rVy3zhklhyCFeGK0yU0+jzbcuURKIxybmRwK
// SIG // 5BfVZx0xEVqE4wM3yN5D/uW+GpVHYYAGe7bTrtW1Z13x
// SIG // 2qj2Jdqz7NtI4tNyzlVrIf62nYBNe3rOYS/repVdHlR6
// SIG // 1YbLLETlibs9jFzAre4sO5RTxvS1yho7JqJ59oKLRnRy
// SIG // LhIOSZyTCVZosXeS0ZZJoGEWSs4cUgsMqBiKtD4WgO2P
// SIG // lT3LeaQh5Io3CCA5tJ5ZCvtCsnqaJXKhptE/xmEETIRy
// SIG // ZRjjplUKKd+sFFVGJJVMvvrw1nhIBKOLO4cTepiG39jE
// SIG // iEP4iHzGYCcQuvaLpDFFwqzgt0pBP8SJIKX5dtjDNYrZ
// SIG // Gd+ZzV5DKJVNZQIDAQABo4IBTjCCAUowDgYDVR0PAQH/
// SIG // BAQDAgGGMBAGCSsGAQQBgjcVAQQDAgEAMB0GA1UdDgQW
// SIG // BBR/WT9UIdqtT+8F5eaj1y0GlBIIMTAZBgkrBgEEAYI3
// SIG // FAIEDB4KAFMAdQBiAEMAQTAPBgNVHRMBAf8EBTADAQH/
// SIG // MB8GA1UdIwQYMBaAFHItOgIxkEO5FAVO4eqnxzHRI4k0
// SIG // MFoGA1UdHwRTMFEwT6BNoEuGSWh0dHA6Ly9jcmwubWlj
// SIG // cm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1Jv
// SIG // b0NlckF1dDIwMTFfMjAxMV8wM18yMi5jcmwwXgYIKwYB
// SIG // BQUHAQEEUjBQME4GCCsGAQUFBzAChkJodHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY1Jvb0Nl
// SIG // ckF1dDIwMTFfMjAxMV8wM18yMi5jcnQwDQYJKoZIhvcN
// SIG // AQEMBQADggIBABSUHzgoT+6J5+nyyDCq0pTdVmCsAxYA
// SIG // HXcpjlDtxazPHewf1v4kOg8V7A5+w+VuMDMGHi8rLXBK
// SIG // n5I8+DVEUYGs8jLuckc0IeC6owOLUrU3CYdaKRMaO55+
// SIG // T7jwWJ27tPkx0rlR03tFU0z1YYpcv6Yhaw6N2sUPT+Av
// SIG // jpecnrftoE33pCAkucUvnGH0iL4J9CZLFQVTGFSOUBbv
// SIG // 6oZy4bBBRFMxvH779IY4JDvpZKVfbcuhpDeL3Z3e8muk
// SIG // Omkfct+GojNapsWsQYujlJ8jZen5Lrp/3YkxZ2Ay06aT
// SIG // pK/5oOVknwog1TDQsbY+MDyguTph5tQ0CLfzDaJG2x91
// SIG // BrBT9UG87C6HLkqiwrx9PSKN3wz05rHEfWO+RuKl+0U1
// SIG // /AHQT6NCOjhKI39/c7hWbdKjh5uuWFkBOvXGTNrnhNTA
// SIG // dOXTTYByvYExO8yryv34PAdqo1vPDE/1heVebr2Rramv
// SIG // RUi9kWswKwPqwz7n+iRmM+B6YDGRweEurM1kimAb9FYr
// SIG // As38YHlPnarl1vW3dGrmJTgefAz3DmCnXN0nveIPsS+K
// SIG // XBIWweeCToAJMGE7v/XS3h9qQ6niWQAAVQ1kUAml3zuS
// SIG // 4MisCgi2F6YoK2WAo1EgXK/lXvDxVjIVU0JdL+KvCfwF
// SIG // JkDeVuJ9dNXGNi+AOxk0BtYd9hxwL30BElj9MYIZxzCC
// SIG // GcMCAQEwbjBXMQswCQYDVQQGEwJVUzEeMBwGA1UEChMV
// SIG // TWljcm9zb2Z0IENvcnBvcmF0aW9uMSgwJgYDVQQDEx9N
// SIG // aWNyb3NvZnQgQ29kZSBTaWduaW5nIFBDQSAyMDI0AhMz
// SIG // AAACHU0ZyE7XD1dIAAAAAAIdMA0GCWCGSAFlAwQCAQUA
// SIG // oIGQMBkGCSqGSIb3DQEJAzEMBgorBgEEAYI3AgEEMC8G
// SIG // CSqGSIb3DQEJBDEiBCBcIZl1o2w6hhtlrDNY+AbdXwE8
// SIG // jspyigpeIqqErhLfaDBCBgorBgEEAYI3AgEMMTQwMqAU
// SIG // gBIATQBpAGMAcgBvAHMAbwBmAHShGoAYaHR0cDovL3d3
// SIG // dy5taWNyb3NvZnQuY29tMA0GCSqGSIb3DQEBAQUABIIB
// SIG // AIV+PZpLit8luf074QgTrbuRrCXlLfvtA1rsOuhdZNrO
// SIG // 8sthx2GOy5JzUe/tE5AaCvyHk079M/+025Owh3KOKh6+
// SIG // v1Nzt15Ro57tAdgF41bru+makRoXvMLa+wKQLKieu0UV
// SIG // 2eZMCP7aQA5mYmTtmn7TMMxrq+neN0y0br+dL2QFBCnK
// SIG // 0SCFJckhDmtiYGuzM6mCxGIN8Vffg0hfZq9JLBqhcSg4
// SIG // x0RFy0hUd3lWSTpcWEYgfOfqjYN7OjdzshT3DtdTEZ+O
// SIG // H02MwIOBQdufh4fk/h4lmMx6xMrE9XUsSmGitNF5UDOv
// SIG // h2IjQR64Hhmg4QK4OdyATJ8jGfKUJlFH43mhgheXMIIX
// SIG // kwYKKwYBBAGCNwMDATGCF4Mwghd/BgkqhkiG9w0BBwKg
// SIG // ghdwMIIXbAIBAzEPMA0GCWCGSAFlAwQCAQUAMIIBUgYL
// SIG // KoZIhvcNAQkQAQSgggFBBIIBPTCCATkCAQEGCisGAQQB
// SIG // hFkKAwEwMTANBglghkgBZQMEAgEFAAQgknwW25StReWo
// SIG // Z7AbFX05yFnKsDOQNuKWr/vd//hkNNUCBmq38XYDcRgT
// SIG // MjAyNjEwMTMyMTEwMTcuNTgzWjAEgAIB9KCB0aSBzjCB
// SIG // yzELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjElMCMGA1UECxMcTWlj
// SIG // cm9zb2Z0IEFtZXJpY2EgT3BlcmF0aW9uczEnMCUGA1UE
// SIG // CxMeblNoaWVsZCBUU1MgRVNOOjMzMDMtMDVFMC1EOTQ3
// SIG // MSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBT
// SIG // ZXJ2aWNloIIR7TCCByAwggUIoAMCAQICEzMAAAIhM8A1
// SIG // +9IPIaQAAQAAAiEwDQYJKoZIhvcNAQELBQAwfDELMAkG
// SIG // A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAO
// SIG // BgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
// SIG // dCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0
// SIG // IFRpbWUtU3RhbXAgUENBIDIwMTAwHhcNMjYwMjE5MTkz
// SIG // OTU0WhcNMjcwNTE3MTkzOTU0WjCByzELMAkGA1UEBhMC
// SIG // VVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcT
// SIG // B1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
// SIG // b3JhdGlvbjElMCMGA1UECxMcTWljcm9zb2Z0IEFtZXJp
// SIG // Y2EgT3BlcmF0aW9uczEnMCUGA1UECxMeblNoaWVsZCBU
// SIG // U1MgRVNOOjMzMDMtMDVFMC1EOTQ3MSUwIwYDVQQDExxN
// SIG // aWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNlMIICIjAN
// SIG // BgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA23EwAqlN
// SIG // WL0aHMli9jy/X8n//lC7Nqiu1NWmbEZw2Up5Qq+yu44A
// SIG // N3hQhCS+QWe3VEwtA3mXqX/mQvuxxGweCHc5iX0AFAxR
// SIG // Xq6mOVUx5kLz9lwN5VkhY++NInXBlB4JT+R/z2wiVOxg
// SIG // B1j9h3XAo3cdZWAKNAPsyyO8cJ00HjMjl19tdhIOFJgz
// SIG // zyYMXUzMOlhVVrAT1kQYuYA4sctrPu0fAA5OZWwQRQwe
// SIG // YdAo6zViDe7ggMxeYO7a6y/J1yCqddJo/UcYXBkPrZYb
// SIG // elSL3coEVU1BncxQdv5wbyakPZMcRZbUEk+9HxHceE8m
// SIG // iqMP3+fgUoeM+P/X+zVyFVUy5//JHCQH0ahZka6xbdyC
// SIG // m8u1a85mLqEFg9JZjRbRkOewayZD6zxQD3pNQC7XG2+x
// SIG // R950Kb4vJ4M/zBV//nJ5jRVhVNvVVS5swfV7y2cW2L5H
// SIG // nrbdJoeZX7XnjdqxMFMq3ayrn8/YdkuqW2rXvgtodNgq
// SIG // 18EpGtMens6U5hpCCSxbdubm/1GFzS3R3bMRg+hH3JDi
// SIG // KCWLJuDEvRf70qizRyvPSNL0ywZ4EBKeiyBZCDWp0U9z
// SIG // 7Tcd6TSkSiUQC3Oi+poVuIS+Ghy++Paj30O9reagDJuc
// SIG // YimDICdlmp4nUSzbiNudSSDe62mngP9r29FxZGXCG00d
// SIG // aX0BrHKOFNIObY8CAwEAAaOCAUkwggFFMB0GA1UdDgQW
// SIG // BBTmIyLOamuqX7qrj8sitRU6+UAwpzAfBgNVHSMEGDAW
// SIG // gBSfpxVdAF5iXYP05dJlpxtTNRnpcjBfBgNVHR8EWDBW
// SIG // MFSgUqBQhk5odHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20v
// SIG // cGtpb3BzL2NybC9NaWNyb3NvZnQlMjBUaW1lLVN0YW1w
// SIG // JTIwUENBJTIwMjAxMCgxKS5jcmwwbAYIKwYBBQUHAQEE
// SIG // YDBeMFwGCCsGAQUFBzAChlBodHRwOi8vd3d3Lm1pY3Jv
// SIG // c29mdC5jb20vcGtpb3BzL2NlcnRzL01pY3Jvc29mdCUy
// SIG // MFRpbWUtU3RhbXAlMjBQQ0ElMjAyMDEwKDEpLmNydDAM
// SIG // BgNVHRMBAf8EAjAAMBYGA1UdJQEB/wQMMAoGCCsGAQUF
// SIG // BwMIMA4GA1UdDwEB/wQEAwIHgDANBgkqhkiG9w0BAQsF
// SIG // AAOCAgEAOCP925HZ08Q9qxbptzBfMVSnRJKIQDm23j60
// SIG // PtH6+W0Ypo8/bFZCk/+4HI+DjHApUmBviHV+jKdxGLCx
// SIG // 1n478H8xaHmRPsk23QY/9VR2UEbgpsOkKnlQk28Np50u
// SIG // 5wcZ1nfaGV2z1KahGsB+Q6l0GlhYEfQOCllSvyL11QzI
// SIG // 9T5TwhEtT9yaJzW3YZJJM+PaybijpuW+3vwR/JaKgJlz
// SIG // l0XNtssVlUzFqxKeKbJZr/Hk+1aGPF/43SmEz1RF7H5i
// SIG // 21RXKszLgfLxRn1MlrFkTkvMIKu5UGH1nGKoezcpqAE1
// SIG // /sFmCt81hu2kXIjxlAM8513X/mh7SFp0CzWuRxZkl5Im
// SIG // pN30rqa1mGYh4bmIxNeoa6AKXAR6ZvvEv5DaoZvVo0F/
// SIG // tgcZ2L/iXo8upak4vHywS0tOvVl1cP6bX+SFfhbWJd+B
// SIG // r1aHoN9VKFJlVWXtUg1CZJvXQ13PJf6gQ2IgCE9ggrD0
// SIG // 8rfVwPSVbh8XT+t5+wob1gDv+O0Ebgg7FJRSaFsMgcJe
// SIG // 43mKWkVTLULdIriTBho4BGiV9UP9o/LF1Eb03Hixww/Y
// SIG // qVrdPdmQ1jEHIg0ZoRzRTl9XZ4wb5P5NVDHIPfe4+aGM
// SIG // 5wJ0qSb5YP+AT92lRNIf2B9ioLCm1ODV2RwIyV49kpaq
// SIG // NQtdeQhuqgWWhZDPFurz2Qpuap0nszowggdxMIIFWaAD
// SIG // AgECAhMzAAAAFcXna54Cm0mZAAAAAAAVMA0GCSqGSIb3
// SIG // DQEBCwUAMIGIMQswCQYDVQQGEwJVUzETMBEGA1UECBMK
// SIG // V2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwG
// SIG // A1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMTIwMAYD
// SIG // VQQDEylNaWNyb3NvZnQgUm9vdCBDZXJ0aWZpY2F0ZSBB
// SIG // dXRob3JpdHkgMjAxMDAeFw0yMTA5MzAxODIyMjVaFw0z
// SIG // MDA5MzAxODMyMjVaMHwxCzAJBgNVBAYTAlVTMRMwEQYD
// SIG // VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
// SIG // MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24x
// SIG // JjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBD
// SIG // QSAyMDEwMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIIC
// SIG // CgKCAgEA5OGmTOe0ciELeaLL1yR5vQ7VgtP97pwHB9Kp
// SIG // bE51yMo1V/YBf2xK4OK9uT4XYDP/XE/HZveVU3Fa4n5K
// SIG // Wv64NmeFRiMMtY0Tz3cywBAY6GB9alKDRLemjkZrBxTz
// SIG // xXb1hlDcwUTIcVxRMTegCjhuje3XD9gmU3w5YQJ6xKr9
// SIG // cmmvHaus9ja+NSZk2pg7uhp7M62AW36MEBydUv626GIl
// SIG // 3GoPz130/o5Tz9bshVZN7928jaTjkY+yOSxRnOlwaQ3K
// SIG // Ni1wjjHINSi947SHJMPgyY9+tVSP3PoFVZhtaDuaRr3t
// SIG // pK56KTesy+uDRedGbsoy1cCGMFxPLOJiss254o2I5Jas
// SIG // AUq7vnGpF1tnYN74kpEeHT39IM9zfUGaRnXNxF803RKJ
// SIG // 1v2lIH1+/NmeRd+2ci/bfV+AutuqfjbsNkz2K26oElHo
// SIG // vwUDo9Fzpk03dJQcNIIP8BDyt0cY7afomXw/TNuvXsLz
// SIG // 1dhzPUNOwTM5TI4CvEJoLhDqhFFG4tG9ahhaYQFzymei
// SIG // XtcodgLiMxhy16cg8ML6EgrXY28MyTZki1ugpoMhXV8w
// SIG // dJGUlNi5UPkLiWHzNgY1GIRH29wb0f2y1BzFa/ZcUlFd
// SIG // Etsluq9QBXpsxREdcu+N+VLEhReTwDwV2xo3xwgVGD94
// SIG // q0W29R6HXtqPnhZyacaue7e3PmriLq0CAwEAAaOCAd0w
// SIG // ggHZMBIGCSsGAQQBgjcVAQQFAgMBAAEwIwYJKwYBBAGC
// SIG // NxUCBBYEFCqnUv5kxJq+gpE8RjUpzxD/LwTuMB0GA1Ud
// SIG // DgQWBBSfpxVdAF5iXYP05dJlpxtTNRnpcjBcBgNVHSAE
// SIG // VTBTMFEGDCsGAQQBgjdMg30BATBBMD8GCCsGAQUFBwIB
// SIG // FjNodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpb3Bz
// SIG // L0RvY3MvUmVwb3NpdG9yeS5odG0wEwYDVR0lBAwwCgYI
// SIG // KwYBBQUHAwgwGQYJKwYBBAGCNxQCBAweCgBTAHUAYgBD
// SIG // AEEwCwYDVR0PBAQDAgGGMA8GA1UdEwEB/wQFMAMBAf8w
// SIG // HwYDVR0jBBgwFoAU1fZWy4/oolxiaNE9lJBb186aGMQw
// SIG // VgYDVR0fBE8wTTBLoEmgR4ZFaHR0cDovL2NybC5taWNy
// SIG // b3NvZnQuY29tL3BraS9jcmwvcHJvZHVjdHMvTWljUm9v
// SIG // Q2VyQXV0XzIwMTAtMDYtMjMuY3JsMFoGCCsGAQUFBwEB
// SIG // BE4wTDBKBggrBgEFBQcwAoY+aHR0cDovL3d3dy5taWNy
// SIG // b3NvZnQuY29tL3BraS9jZXJ0cy9NaWNSb29DZXJBdXRf
// SIG // MjAxMC0wNi0yMy5jcnQwDQYJKoZIhvcNAQELBQADggIB
// SIG // AJ1VffwqreEsH2cBMSRb4Z5yS/ypb+pcFLY+TkdkeLEG
// SIG // k5c9MTO1OdfCcTY/2mRsfNB1OW27DzHkwo/7bNGhlBgi
// SIG // 7ulmZzpTTd2YurYeeNg2LpypglYAA7AFvonoaeC6Ce57
// SIG // 32pvvinLbtg/SHUB2RjebYIM9W0jVOR4U3UkV7ndn/OO
// SIG // PcbzaN9l9qRWqveVtihVJ9AkvUCgvxm2EhIRXT0n4ECW
// SIG // OKz3+SmJw7wXsFSFQrP8DJ6LGYnn8AtqgcKBGUIZUnWK
// SIG // NsIdw2FzLixre24/LAl4FOmRsqlb30mjdAy87JGA0j3m
// SIG // Sj5mO0+7hvoyGtmW9I/2kQH2zsZ0/fZMcm8Qq3UwxTSw
// SIG // ethQ/gpY3UA8x1RtnWN0SCyxTkctwRQEcb9k+SS+c23K
// SIG // jgm9swFXSVRk2XPXfx5bRAGOWhmRaw2fpCjcZxkoJLo4
// SIG // S5pu+yFUa2pFEUep8beuyOiJXk+d0tBMdrVXVAmxaQFE
// SIG // fnyhYWxz/gq77EFmPWn9y8FBSX5+k77L+DvktxW/tM4+
// SIG // pTFRhLy/AsGConsXHRWJjXD+57XQKBqJC4822rpM+Zv/
// SIG // Cuk0+CQ1ZyvgDbjmjJnW4SLq8CdCPSWU5nR0W2rRnj7t
// SIG // fqAxM328y+l7vzhwRNGQ8cirOoo6CGJ/2XBjU02N7oJt
// SIG // pQUQwXEGahC0HVUzWLOhcGbyoYIDUDCCAjgCAQEwgfmh
// SIG // gdGkgc4wgcsxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpX
// SIG // YXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
// SIG // VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJTAjBgNV
// SIG // BAsTHE1pY3Jvc29mdCBBbWVyaWNhIE9wZXJhdGlvbnMx
// SIG // JzAlBgNVBAsTHm5TaGllbGQgVFNTIEVTTjozMzAzLTA1
// SIG // RTAtRDk0NzElMCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUt
// SIG // U3RhbXAgU2VydmljZaIjCgEBMAcGBSsOAwIaAxUAC2xI
// SIG // GWZ8mB1ydQxm+Xxo6ZV6bbmggYMwgYCkfjB8MQswCQYD
// SIG // VQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4G
// SIG // A1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0
// SIG // IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQg
// SIG // VGltZS1TdGFtcCBQQ0EgMjAxMDANBgkqhkiG9w0BAQsF
// SIG // AAIFAO541qIwIhgPMjAyNjEwMTMxNjExMTRaGA8yMDI2
// SIG // MTAxNDE2MTExNFowdzA9BgorBgEEAYRZCgQBMS8wLTAK
// SIG // AgUA7njWogIBADAKAgEAAgIGRQIB/zAHAgEAAgITrTAK
// SIG // AgUA7nooIgIBADA2BgorBgEEAYRZCgQCMSgwJjAMBgor
// SIG // BgEEAYRZCgMCoAowCAIBAAIDB6EgoQowCAIBAAIDAYag
// SIG // MA0GCSqGSIb3DQEBCwUAA4IBAQAy9azsnDXV5vTqBXWy
// SIG // /ZNNcN682dRFA5Dnc86ANPvzYd6MZ2tbyjYiBUrLu1i9
// SIG // WxdZqiaWj5cNXcZug/+NA1eIFDr1lFPLe6Xc1bCIWZua
// SIG // XNFImklSLFqzIzPapT8UVH0u2h6NOP/5BBKISMR8SVtO
// SIG // m8kcEPzsxiaeOSw6ZaWed4a962NEE5YSBxUXiSjGFmo3
// SIG // Wscovs3j+nj0nVBFRyoQnVvz+oRBFmg3Wp3/J3SJaZOf
// SIG // X1ZYhUn9AcEK+Uiir2KfWftagduq1fCyRFGUi1pHmxCq
// SIG // nniaD0g+dczMP9S2wIbZ0mBCluNQn0nzpWvYp+bkVdQ0
// SIG // mdyy91wtG/vJ9tKiMYIEDTCCBAkCAQEwgZMwfDELMAkG
// SIG // A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAO
// SIG // BgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
// SIG // dCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0
// SIG // IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAAIhM8A1+9IP
// SIG // IaQAAQAAAiEwDQYJYIZIAWUDBAIBBQCgggFKMBoGCSqG
// SIG // SIb3DQEJAzENBgsqhkiG9w0BCRABBDAvBgkqhkiG9w0B
// SIG // CQQxIgQgsFcExo3QOQBgOvwobc7LvnkmFWyRPICUA3ZE
// SIG // N1MZJj4wgfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9
// SIG // BCAA7yEHnxVVGuAScvCGcsDAL5hkinVFahJsvQPvjwo9
// SIG // RDCBmDCBgKR+MHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAk
// SIG // BgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAy
// SIG // MDEwAhMzAAACITPANfvSDyGkAAEAAAIhMCIEIM68llRS
// SIG // qt4w8WQA7jlezrP26YTwWSkl18dv5jsrFSbaMA0GCSqG
// SIG // SIb3DQEBCwUABIICAMpYpHvqz3jv3YXRzSIlKPbkPIgm
// SIG // crJRZznaNwWOmJexkWIdfT4MZDjyAwqDxPCJdkGQzYmb
// SIG // yxSlCFdEgYCBYxtoKSq+Ew1+BT5L/hYiDkoVP1SirszD
// SIG // mZ8MLa+FRkU9aOVO/pfrgOewZkNzs263TLGhxTuAHpVp
// SIG // RY0VnD+KGMKX8eWwM+szENf8Gn3PP7qC12Drf55wKDz+
// SIG // QwEefl41mCszcKEC4CXz5OLE/5qtJ6M21tk9RLSqwLt2
// SIG // V4AaQuatuZcheQDbZaXk7x+ho7XkDauKOUoH0MX9xDJf
// SIG // RhkdNV7lqw5N8cUC4cSoSvP5vVom9zsB50wQadUKbcop
// SIG // nFW7cSM3028dayDEzY5vjkRnggIU5F1t5tN6qjHbBE+E
// SIG // 2tTlelN0UP1bpK6ywTPOEt005QkKxgBBOeMYdIPvNPaT
// SIG // kwh6ENxonXJWHCvSkiqWIYHdllIJV/WkHh9BKNHUJbzs
// SIG // rn1iWoTHDqX1dbchPF+JYFn9m0/2QMgv+7k9AEbaMbq0
// SIG // GkgkJk5ZVagDj8GHPWDQQx5akkoT0YIvWd1cJ7I2GiCS
// SIG // uJ7NiU3Bk/uWkwL+fJQPg5raGm6bBUNgf83wWet7/HJb
// SIG // OmZqS/EMWoPYGvvTREpGt59/bku1vizkRwqcS0KA2mW4
// SIG // Ha5qVqQw++CMWto0BIQBimaRG8Wed7aYn3KKD/rY
// SIG // End signature block
