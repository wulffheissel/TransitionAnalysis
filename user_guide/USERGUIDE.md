# Transition Analysis 3 Installation & User Guide

Welcome to the Transition Analysis 3 User Guide. Transition Analysis 3 is a program developed by the TA3 Team to automate the analysis of skeletal traits to estimate the age of adults. This guide will help you navigate through the installation and use of the program, ensuring you can make the most out of its features.

## Table of Contents

1. [Requirements and Installation](#requirements-and-installation)
2. [Creating a New Analysis](#creating-a-new-analysis)
3. [Output Formats](#output-formats)
4. [Opening an Analysis from a File](#opening-an-analysis-from-a-file)
5. [Contact Information](#contact-information)

&nbsp;

## Requirements and Installation

Transition Analysis 3 is compatible with MacOS and Windows operating systems. To generate PDF reports, you will need to have `LaTeX` installed on your system. You can download `LaTeX` from [here](https://www.latex-project.org/get/) (https://www.latex-project.org/get/).

### Installation

The program is available as an executable file:

- `.app` for MacOS
- `.exe` for Windows

To install Transition Analysis 3, simply run the appropriate executable file for your operating system. Upon launching the program, you will see the following menu page:

![The menu page of Transition Analysis 3.](menupage.png)
* **Figure 1:** The menu page of Transition Analysis 3, displayed upon opening the program.

&nbsp;

## Creating a New Analysis

To start a new analysis, click on the `"Start a new analysis"` button on the menu page. This will open the graphical user interface where you can input observations.

![The analysis page of Transition Analysis 3.](jackS.png)
* **Figure 2:** The analysis page of Transition Analysis 3, where traits are scored and cases are managed.

### Scoring Traits

The analysis page is divided into several sections:

- **Left Sidebar:** Contains buttons and information related to the current analysis, as well as a list of trait categories.
- **Main Area:** Displays a scrollable list of traits in the selected category. Each trait can be scored by selecting options, and choices can be cleared if needed.

For more information about a specific trait, click on the `Supplementary Information` banner at the bottom of each trait.

### General Analysis Information

To edit the name, sex, region, prior age distribution and notes of the analysis, click on the `General Analysis Information` button below the current analysis name.

![The general info window](generalInfo.png)
* **Figure 3:** The general information window.

### Managing Multiple Cases

If you need to analyze multiple specimens, you can add new cases by clicking the `Add new analysis` button at the top left of the analysis page. To remove an analysis, select it and click the `Delete current analysis` button. Note that this action cannot be undone.

> **Important:** Ensure you have selected the correct analysis before deleting, as this action cannot be undone.

### Generating Output Files

Once you have completed scoring traits and editing information, you can generate results in three formats by clicking the `Run Analysis` button at the top right of the analysis page. Choose your preferred output format (Text, CSV, or PDF).

![Run analysis window](openedAddInfo.png)
* **Figure 4:** The analysis page when additional information is opened and after `Run Analysis` has been pressed.

> **Note:** For PDF output, ensure `LaTeX` is installed (see requirements).

&nbsp;

## Output Formats

The output formats include:

- **Text:** A simple textual representation of the results.
- **CSV:** Provides a structured spreadsheet format which can be used by other tools for further analysis.
- **PDF:** Includes detailed graphs of support curves and confidence intervals.

Each output will include the following information for each analysis:

- Analysis name
- General notes
- Specimen gender
- Specimen region
- The prior age distribution used
- The estimates with confidence intervals

To save and edit analyses later, save your output in the `.ta3` format by clicking the `TA3` button. This format allows Transition Analysis 3 to reopen and configure the program according to the saved information.

&nbsp;

## Opening an Analysis from a File

From the menu page, you can open an existing analysis by selecting a file with the `.ta3` extension. These files can be shared with other users on different platforms, facilitating collaboration on the same workspace.

&nbsp;

## Contact Information

For any issues or questions, please contact:

- **thhei20@student.sdu.dk**
- **maboo20@student.sdu.dk**

Thank you for using Transition Analysis 3. Happy analyzing!