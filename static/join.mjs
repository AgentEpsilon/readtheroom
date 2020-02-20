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
                <p>Enter your name:</p>
                <input value=${name} oninput=${e => {setName(e.target.value)}} />
                <button type="submit">Submit</button>
            </form>
        `
    } else {
        return html`<div>Welcome ${name}!<br />Please wait for game to start.</div>`
    }
}

export function JoinResponding({ socket, question }) {
    if (!clientState.inGame) return html`<div>Please wait until the game ends to play.</div>`

    const [answer, setAnswer] = useState('')
    const [submitted, setSubmitted] = useState(false)

    if (!submitted) {
        return html`
            <form onsubmit=${e => {
                e.preventDefault()
                socket.emit('response', answer)
                setSubmitted(true)
            }}>
                ${question}
                <input value=${answer} oninput=${e => {setAnswer(e.target.value)}} />
                <button type="submit">Submit</button>
            </form>
        `
    } else {
        return html`<div>Submitted!</div>`
    }
}

export function JoinVoting({ responses, socket }) {
    if (!clientState.inGame) return html`<div>Please wait until the game ends to play.</div>`

    const [submitted, setSubmitted] = useState(false)

    if (!submitted) {
        return html`
            <div>
                Vote now on your phones<br />
                ${Object.values(responses).map(r => html`<button onclick=${e => {
                    e.preventDefault()
                    socket.emit('vote', r.id)
                    setSubmitted(true)
                }}>${r.response}</button>`)}
            </div>
        `
    } else {
        return html`<div>Submitted!</div>`
    }
}

export function JoinResults({ results, socket }) {
    if (!clientState.inGame) return html`<div>Please wait until the game ends to play.</div>`

    if (results[socket.id]) {
        return html`
        <div>
            You earned:
            ${results[socket.id].votes} points!
        </div>
    `
    } else {
        return html`
        <div>
            You didn't submit anything...
        </div>
        `
    }
}

export function JoinLeaderboard({ players, socket }) {
    if (!clientState.inGame) return html`<div>Please wait until the game ends to play.</div>`

    return html`
        <div>
            You have:<br />
            ${players[socket.id].votes} total points!
        </div>
    `
}