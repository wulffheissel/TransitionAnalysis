# Transition Analysis 3
This is the source code for the Transition Analysis 3 code.
The application is an Electron application that uses: React, TypeScript and Webpack.

Everything located in the `src` folder is related to React and everything in the `electron` folder is related to Electron.
This split of the code has also been made to distinguish the difference between what we expect to run in a `renderer-process` (namely the files in `src`)
and which we expect to run in a `main-process` (the files in `electron`). These two concepts come from Electron and more information can be found about them in their documentation.

## The Project Structure

The project consists mainly of 3 cohesive parts: input --> analysis --> output.
All input operations are handled through React, a user can use the UI to either make an analysis or they can use the UI to import settings from a `.csv` file.
The analysis part is contained in `src/TransitionAnalysis.ts`. Here we do everything related to the analysis such as, calculating the estimates and confidence intervals.
Output generation related files can be found in `src/outputGeneration` here we generate the different files and use IPC calls to save files on the users filesystem.
A user chooses an output format using the UI, which calls one of these functions found in the output generation files (currently either PDF, `.csv` or text format).

## How to add/modify/remove a new trait
We have structured the project in such a way that the application is built from configuration files. 
These configuration files are located in the `assets/` directory. To add a trait for analysis, locate the `traits.json` file.
This file contains all the traits used in the application.
Traits are setup in such a way that every trait belongs to a category and every trait has a number of scoring options.
Let's look at an example trait:

```json
[
  {
    "categoryName": "Cranium",
    "traits": [
      {
        "traitName": "Parietal depression (left)",
        "traitLocation": "The parietal bone between the superior temporal l...",
        "scores": [
          {
            "scoreName": "Absent",
            "scoreDescription": "The parietal bone contour is rounded or flat...",
            "scoreValue": []
          },
          {
            "scoreName": "Present",
            "scoreDescription": "A portion of the parietal bone is slightly depre...",
            "scoreValue": [["parietal_depressionL", 1]]
          }
        ]
      }
    ]
  }
]
```
Let's explain the different keys and what their values are used for:

- `categoryName`: This is the name of the category in which you are trying to specify some traits for, we show this to the users of the application.
- `traits`: This is where the list of traits for the given category is specified. We create a box of scoring options in the application for each of these with their attributes. A trait contains the following attributes:
  - `traitName`: The name of the trait we are specifying.
  - `traitLocation`: This is a description of where the trait can be found on a skeleton, this is shown in the additional information tab of an trait.
  - `scores`: This is a list of the scores that a user can make on a trait. A score has the following attributes:
    - `scorename`: The name of the score.  :warning: **This should be unique**: since we identify and display which score has been pressed by the name of it!
    - `scoreDescription`: A description of when the score is applicable for a given trait.
    - `scoreValue`: This is a list of tuples of the format `[transitionCurveName, score]`, that specifies which transition curves are affected by the given score. Notice that `score` can only be `0` or `1` and that `transitionCurveName` should be the name of one of the curves specified in each of the files in `TA3_Curves`. When this list is empty it is the same as ignoring the score.

Besides the `scorename`, `scoreDescription` and `scoreValue` there is also a fourth option for images of a score. 
To add images, which are displayed in the additional informations tab, add the fourth key: `imagePaths` to the configuration of a score.
Image paths are lists of strings, where each entry is the relative placement in the `assets/images` directory.
As an example, if we wish to add an image located in `assets/images/cranium/absent.png` to the "Absent" score of the object above,
we would modify it to be the following:
```json
          {
            "scoreName": "Absent",
            "scoreDescription": "The parietal bone contour is rounded or flat...",
            "scoreValue": [],
            "imagePaths": ["cranium/absent.png"]
          },
```

## Modifying the transition curves
To modify the transition curves for each gender, one can edit the files specified in `TA3_Curves`. Notice that currently, all of these should contain the same curves, although they may contain different values for the curves.



