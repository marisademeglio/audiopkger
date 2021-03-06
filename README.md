# audiopkger

A command-line tool to generate and package W3C audiobooks

## Important Note

This is a work in progress and is not production-ready. Expect code to change and new dependencies to be added often – creating errors if you didn’t install them or re-install the project.

If you encounter bugs, please feel free to file an issue or – even better – a pull request.

If you’ve been using a version < 0.18.0, please reinstall using `npm ci` as upgraded and new dependencies are required.

## Abstract

This is a small utility you can use in your terminal to generate [W3C audiobooks](https://www.w3.org/TR/audiobooks/). It helps you create a publication manifest, a table of contents (if required), and package your folder into [an `.lpf` archive](https://www.w3.org/TR/lpf/).

Note this utility only works with simple audiobooks. It doesn’t support:

- alternate formats and content (e.g. Synchronized Narration or text);
- media fragments (a.k.a. references to locations in a single audio track);
- language and base direction.

However, it can still be used to create a starting point in those cases: it will generate files you can edit and augment.

## Install

First make sure you have nodeJS and npm installed. If you don’t, [install it](https://nodejs.org/).

If you don’t want to fork and/or clone the repository and have easier access to its source code then:

```
npm install -g git+https://git@github.com/JayPanoz/audiopkger.git
```

[Forking](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) and/or cloning the repo will make it easier to edit code, add new scripts and formats, etc. since the global command will be tied to your local copy, and you will be able to directly run the command with those changes.

If you are forking it, you will have to clone yours:

```
git clone https://github.com/YourUsername/audiopkger.git
```

Otherwise: 

```
git clone https://github.com/JayPanoz/audiopkger.git
```

Then:

```
cd path/to/the/cloned-repo
```

Finally run:

```
npm install -g
```

If for some reason the `audiopkger` command doesn’t work after the install, run `npm link` from the root of the cloned repository.

To keep your fork in sync, you can also do:

```
git remote add upstream https://github.com/JayPanoz/audiopkger.git
```

Then you’ll be able to [fetch and merge changes](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/syncing-a-fork) made in this upstream repo.

## Usage

Please make sure you are running those commands from the root directory of your audiobook.

```
cd path/to/your/audiobook-directory
```

Indeed, the utility will look for the files and subfolders within this directory to create the `readingOrder`, list of `resources`, and table of contents.

### Generate a Manifest and a Table of Contents

Run the following command:

```
audiopkger init
```

This will launch an interactive interface asking you questions to populate the audiobook’s manifest. More precisely, it will ask for:

1. the title of the book;
2. its address;
3. its canonical identifier (address, ISBN, or autogenerated UUID);
4. its author (accepts multiple, delimited with commas or semicolons);
5. its narrator (accepts multiple, delimited with commas or semicolons);
6. its publisher (accepts multiple, delimited with commas or semicolons);
7. its language;
8. its publication date;
9. its cover;
10. its table of contents;
11. its internal preview;
12. its supplemental content(s).

When a text input is left blank, it will simply not appear in the manifest.

Then it will search for audio files in the directory and list them in the manifest (`readingOrder`). Please make sure their filenames are in the correct order.

The script will search for a title and duration in the audio files’ metadata to populate their `name` and `duration`. In case it doesn’t find a title, a pattern `Track + file-index` is used as a fallback.

If you don’t have a table of contents, you can tell the utility to create one from the `readingOrder` automatically, although you will have to edit the entries of the navigation list. This will create a Primary Entry Page (`index.html`) with the table of contents – and table of supplements if any –, and add it in the root directory.

Once completed, a `publication.json` file will be added in the root directory.

### Generate or Update a Table of Contents

If you did not create a Primary Entry Page (`index.html`) on `init`, or want to update it after editing `publication.json`, you can run:

```
audiopkger toc
```

Note this script expects the manifest to be named `publication.json`, and will error if it isn’t.

This will create `index.html` in the root directory, and update the manifest (`publication.json`), adding it to the list of `resources` if it was not already present.

### Package

The `init` command doesn’t automatically package the audiobook. Indeed, you may have to edit the manifest and table of contents beforehand.

To package, run the following command: 

```
audiopkger package
```

Note this script expects the manifest to be named `publication.json`, and will error if it isn’t.

It will then check the manifest and package resources into an `.lpf` archive – with audio files using `STORE`. This consequently shouldn’t package dot files if you’re using a Mac for instance.

This means you can also use this command as a quick and simple packager for W3C audiobooks if you already have everything required.

If you want to modify the bitrate of packaged audio, you can run:

```
audiopkger package -b <number>
```

Make sure you have [FFMPEG installed](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/wiki) before running this command or else it will obviously fail.

This process may take a while depending on the size of your audiobook, but it won’t overwrite your audio files.

Note Audiopkger doesn’t attempt to check the bitrate of the source audio files, it will blindly follow your instructions.

If you want something more verbose when using this bitrate option, and log FFMPEG’s progress when processing your audio files, you can run:

```
audiopkger package -b <number> -d
```

Quick tip: rename the `.lpf` extension to `.zip` to easily unzip this package if needed. If you’re using Visual Studio Code, you could also install [this extension](https://github.com/JayPanoz/vscode-zipexplorer).

### Misc

To print the help, run:

```
audiopkger -h
```

To check the version, run:

```
audiopkger -v
```

## Help

```
audiopkger [command]

  help ............... show help menu
  init ............... create an audiobook manifest (and toc) in the directory
  package ............ package the directory as .lpf
    --bitrate, -b ......... use FFMPEG to modify the bitrate of packaged audio
    --details, -d ......... log progression of FFMPEG processing
  toc ................ create a Table of Contents from the manifest
  version ............ show the version
```