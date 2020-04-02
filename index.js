import express from 'express'
const app = express()
import { createServer } from 'http'
const server = createServer(app)
import socketio from 'socket.io'
const io = socketio(server)

import { State, Timings, NUMBER_OF_ROUNDS } from './static/state/SocketState.mjs'

import {readFileSync} from 'fs'
const questions = JSON.parse(readFileSync('./questions.json', 'utf8'))

app.use(express.static('static'))

let gameState = State.STOPPED
function setState(state) {
    gameState = state
    console.log(`setting state to ${state}`)
    io.emit('state', state)
}

let round = 1

const players = {}

let question = ''

function pickQuestion() {
    return questions.splice(Math.floor(Math.random()*questions.length), 1)[0]
}

let responses = {}

let votes = {}

io.on('connection', function (socket) {

    socket.emit('state', gameState)
    socket.emit('players', players)
    socket.emit('question', question)
    socket.emit('responses', responses)
    socket.emit('results', votes)

    socket.on('disconnect', () => {
        if (players[socket.id]) {
            console.log(`player dc: ${players[socket.id].name}`)
            delete players[socket.id]
            io.emit('players', players)
        }
    })
    socket.on('startGame', startGame)
    socket.on('joinGame', (name) => {
        console.log(`player joined: ${name}`)
        players[socket.id] = { id: socket.id, name, votes: 0 }
        io.emit('players', players)
    })
    socket.on('response', (response) => {
        console.log(`response from player ${players[socket.id].name}: ${response}`)
        responses[socket.id] = { response, name: players[socket.id].name, votes: 0, id: socket.id }
        io.emit(responses)
    })
    socket.on('vote', (id) => {
        votes[id].votes -=- 1
    })
})

function startGame() {
    if (gameState !== State.STOPPED) return
    console.log('game start')
    round = 1
    askQuestion()
}

function askQuestion() {
    if (gameState == State.RESPONDING) return
    question = pickQuestion()
    responses = {}
    io.emit('question', question)
    io.emit('responses', responses)
    setState(State.RESPONDING)
    setTimeout(() => {
        showAnswers()
    }, Timings[State.RESPONDING]);
}

function showAnswers() {
    if (gameState == State.VOTING) return
    io.emit('responses', responses)
    votes = {...responses}
    setState(State.VOTING)
    setTimeout(() => {
        showResults()
    }, Timings[State.VOTING])
}

function showResults() {
    if (gameState == State.RESULTS) return
    io.emit('results', votes)
    setState(State.RESULTS)
    setTimeout(() => {
        showLeaderboard()
    }, Timings[State.RESULTS])
}

function showLeaderboard() {
    if (gameState == State.LEADERBOARD) return
    Object.values(votes).forEach(({id, votes}) => {
        if (players[id]) players[id].votes +=+ votes
    })
    io.emit('players', players)
    setState(State.LEADERBOARD)
    setTimeout(() => {
        if (round < NUMBER_OF_ROUNDS) {
            round++
            askQuestion()
        } else {
            stopGame()
        }
    }, Timings[State.LEADERBOARD])
}

function stopGame() {
    if (gameState == State.STOPPED) return
    setState(State.STOPPED)
}

server.listen(80, () => {
    const addr = server.address()
    console.log(`listening on ${addr.address}:${addr.port}`)
})