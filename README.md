# Multi-track Recorder

#### _A multi-track recorder react-native application targetting Android_

#### By _**Jason Huels** December 12, 2019_

## Description
_An Android multi-track recorder application, designed to allow users to quickly prototype songs._

## MVP
* Ability to record 4 audio tracks from device microphone
* Each track can be played back individually or simultaneously
* App should have master volume control and each track should have individual volume control
* Project can be saved/loaded/deleted on local storage

## Stretch Goals
* Record button count-in
* Record button punch-in
* Panning controls for each track
* Solo/Mute buttons for each track
* Each track can be exported in uncompressed format (wav/aac)
* Audio tracks can be recorded from direct input (will require a preamp)
* Metronome with adjustable BPM
* Tuner 

## TODO List
## MVP
# AudioTrack Component
- [ x ] Record from mic
- [ x ] Playback recording
- [  ] Adjust track vomlume
- [  ] Mute Button
- [  ] Solo Button
- [  ] Adjust playback slider to match track position

# App Component
- [ x ] Render AudioTracks
- [  ] Play button triggers all tracks to play
- [  ] Stop button triggers all tracks to stop

# Menu Component
- [ ] Create menu as a modal
- [ ] Save project to local storage
- [ ] Load saved project from storage

## Stretch
# AudioTrack Component
- [ ] Count-in 
- [ ] Allow record button to punch-in instead of overwritting from beginning of track

# App Component
- [ ] Metronome

# Menu Component
- [ ] Export as uncompressed file

## Setup/Installation Requirements_
* _Clone this repository_
* _Navigate to the directory_
* _Run "npm install" command to install necessary packages_
* _Run "expo start" to start the server_
* _Use the expo app on your Android device to scan the QR code and launch the application_

## Known Bugs
_Does not function on iPhone_

## Support and contact details
_jasonhuels@yahoo.com_

## Technologies Used
_JavaScript, React-Native, Expo, Expo-AV Node.js_

### License
Open-source