# CARBON-IT: Madre de dios

## Available commands

- To download dependencies

  ```
      npm install
  ```

- To generate .js files in dist/ directory (needed for running the program or the tests)

```
    npm run build
```

- To run the program

```
    npm run build-start [pathToSettingFile] [Optional:PathToOutputFile]
 or
    npm start [pathToEntryFile] [Optional:PathToOutputFile]
```

- To run tests

```
    npm run build-test
 or
    npm test
```

## Entry map format

Templates of possible entry lines in SettingFile

```
one max :
# {C like Carte} - {width} - {height}
C - 3 - 4

any number :
# {M like Montagne} - {x coordinate} - {y coordinate}
M - 1 - 1

any number :
# {T like Trésor} - {x coordinate} - {y coordinate} - {number of treasures}
T - 0 - 3 - 2

any number :
# {A like Aventurier} - {Name of the adventurer} - {x coordinate} - {y coordinate} - {Orientation: N like Nord, S like Sud, E like Est, O like Ouest } - {movements: A like Avancer, D like Droite, G like Gauche}

A - Indiana - 1 - 1 - S - AADADAGAA
```
