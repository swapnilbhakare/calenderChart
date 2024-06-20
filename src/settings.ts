/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

"use strict";

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.Card;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

/**
 * Data Point Formatting Card
 */


class CalendarChartSettings extends FormattingSettingsCard {

    showCategory = new formattingSettings.ToggleSwitch({
        name: "showCategory",
        displayName: "Show  Category",
        value: true
    });
    showGoal = new formattingSettings.ToggleSwitch({
        name: "showGoal",
        displayName: "Show Goal",
        value: true
    });
    showValues = new formattingSettings.ToggleSwitch({
        name: "showValues",
        displayName: "Show Actual",
        value: true
    });

    showQuarter = new formattingSettings.ToggleSwitch({
        name: "showQuarter",
        displayName: "Show Quarter",
        value: true
    });
    name: string = "calendarChartSettings";
    displayName: string = "Calendar Chart Settings";
    slices: Array<FormattingSettingsSlice> = [this.showCategory, this.showGoal, this.showValues, this.showQuarter];


}

class LicenseKey extends FormattingSettingsCard {
    licenseKey = new formattingSettings.TextInput({
        name: "license",
        displayName: "license",
        placeholder: "",
        value: ""
    });

    name: string = "licenseKey";
    displayName: string = "License Key";


    slices: Array<FormattingSettingsSlice> = [this.licenseKey];
}


/**
* visual settings model class
*
*/
export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    // Create formatting settings model formatting cards
    calendarChartSettings = new CalendarChartSettings()
    licenseKey = new LicenseKey()
    cards = [this.calendarChartSettings, this.licenseKey];
}