import { html, useState } from 'https://unpkg.com/htm/preact/standalone.module.js'
import { SocketStateComponent, SocketRoute } from './state/SocketStateComponent.mjs'
import { State } from './state/SocketState.mjs'

export function Join() {
    return html`
        <${SocketStateComponent}>
            <${SocketRoute} on=${State.STOPPED} to=${JoinStopped} />
            <${SocketRoute} on=${State.RESPONDING} to=${JoinResponding} />
            <${SocketRoute} on=${State.VOTING} to=${JoinVoting} />
            <${SocketRoute} on=${State.RESULTS} to=${JoinResults} />
            <${SocketRoute} on=${State.LEADERBOARD} to=${JoinLeaderboard} />
        </${SocketStateComponent}>
    `
}

const clientState = {
    inGame: false,
    name: ''
}

export function JoinStopped({ socket }) {
    const [name, setName] = useState(clientState.name)
    const [submitted, setSubmitted] = useState(clientState.inGame)

    if (!submitted) {
        return html`
            <form onsubmit=${e => {
                e.preventDefault()
                socket.emit('joinGame', name)
                setSubmitted(true)
                clientState.inGame = true
                clientState.name = name
            }}>
                <div class="form-group">
                    <label for="name">Enter your name:</p>
                    <input required class="form-control" id="name" value=${name} oninput=${e => {setName(e.target.value)}} />
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        `
    } else {
        return html`<div><h2>Welcome, ${name}!</h2><h4>Please wait for the game to start.</h4></div>`
    }
}

export function JoinResponding({ socket, question }) {
    if (!clientState.inGame) return html`<h2>Please wait until the game ends to play.</h2>`

    const [answer, setAnswer] = useState('')
    const [submitted, setSubmitted] = useState(false)

    if (!submitted) {
        return html`
            <form onsubmit=${e => {
                e.preventDefault()
                socket.emit('response', answer)
                setSubmitted(true)
            }}>
                <div class="form-group">
                    <label for="question">${question}</label>
                    <input required class="form-control" id="question" value=${answer} oninput=${e => {setAnswer(e.target.value)}} />
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        `
    } else {
        return html`<h2>Submitted!</h2>`
    }
}

export function JoinVoting({ responses, socket }) {
    if (!clientState.inGame) return html`<h2>Please wait until the game ends to play.</h2>`

    const [submitted, setSubmitted] = useState(false)

    if (!submitted) {
        return html`
            <div>
                <h2>
                    Vote for the best response:
                </h2>
                <div class="list-group">
                    ${Object.values(responses).map(r => html`<button type="button" class="list-group-item list-group-item-action" onclick=${e => {
                        e.preventDefault()
                        socket.emit('vote', r.id)
                        setSubmitted(true)
                    }}>${r.response}</button>`)}
                </div>
            </div>
        `
    } else {
        return html`<div>Submitted!</div>`
    }
}

export function JoinResults({ results, socket }) {
    if (!clientState.inGame) return html`<h2>Please wait until the game ends to play.</h2>`

    if (results[socket.id]) {
        return html`
        <h2>
            You earned ${results[socket.id].votes} points!
        </h2>
    `
    } else {
        return html`
        <h2>
            You didn't submit anything...
        </h2>
        `
    }
}

export function JoinLeaderboard({ players, socket }) {
    if (!clientState.inGame) return html`<h2>Please wait until the game ends to play.</h2>`

    return html`
        <h2>
            You have ${players[socket.id].votes} total points!
        </h2>
    `
}