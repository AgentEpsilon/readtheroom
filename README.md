# Read the Room

Multiplayer submission game inspired by {Jackbox, Kahoot}.
Host displays one screen to the entire group of players,
and players connect on their phones to write submissions and vote.

## Context

This game was created for the University of Miami's CIM 471: Designing Games for Impact course,
as part of a series of games based around discussing the concept of "consent".
The questions/scenarions presented (in [questions.json](questions.json)) are crowd-sourced situations
that evoke some aspect of consent.

## Gameplay

Players can log in on their phones by visiting the page and entering their name.
Once all players have joined, the host can start the game from the main screen.
For each round, players are presented with a scenario. They are given some time to
enter in a response to the situation, before everyone sees all of the responses
and get a chance to vote for the one they like best. After voting,
results are shown for that round, then added to the cumulative game totals per player.

## Running the Game

`npm install`, then `npm test`.

## Copyright

© Evan Miller, 2020. All rights reserved.
