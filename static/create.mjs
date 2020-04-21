import { html, useState, useCallback } from 'https://unpkg.com/htm/preact/standalone.module.js'
import { SocketStateComponent, SocketRoute } from './state/SocketStateComponent.mjs'
import { State, Timings } from './state/SocketState.mjs'
import { CountdownTimer } from './CountdownTimer.mjs'

export function Create() {
    return html`
        <${SocketStateComponent}>
            <${SocketRoute} on=${State.STOPPED} to=${CreateStopped} />
            <${SocketRoute} on=${State.RESPONDING} to=${CreateResponding} />
            <${SocketRoute} on=${State.VOTING} to=${CreateVoting} />
            <${SocketRoute} on=${State.RESULTS} to=${CreateResults} />
            <${SocketRoute} on=${State.LEADERBOARD} to=${CreateLeaderboard} />
        </${SocketStateComponent}>
    `
}

export function CreateWrapper({ children }) {
    return html`
        <div class="container my-3">
            <div class="jumbotron">
                ${children}
            </div>
        </div>
    `
}

export function CreateStopped({ socket, players }) {
    const [deck, setDeck] = useState('consent')
    const onDeckChange = useCallback((e) => {
        setDeck(e.target.value)
    })
    return html`
        <${CreateWrapper}>
            <h2>Go to: ${window.location.origin} to join</h2>
            <div class="form-group">
                <label for="deck-select">Choose a deck to play:</label>
                <select id="deck-select" class="form-control" value=${deck} onChange=${onDeckChange}>
                    <option value="Starter" default>Starter Deck</option>
                    <option value="LGBTQIAA">LGBTQIAA</option>
                    <option value="Multicultural">Multicultural</option>
                    <option value="Sexual Assault and Harrassment">Sexual Assault and Harrassment 🔞</option>
                    <option value="consent">Original Consent Monodeck</option>
                </select>
            </div>
            <button type="button" class="btn btn-success btn-lg" onclick=${() => { socket.emit('startGame', deck) }}>Start Game</button>
            <hr class="my-4" />
            <div>
                <h3>Players:</h3>
                <ul class="list-group">${Object.values(players).map(p => html`<li class="list-group-item">${p.name}</li>`)}</ul>
            </div>
        </${CreateWrapper}>
    `
}

export function CreateResponding({ gameState, question }) {
    return html`
        <${CreateWrapper}>
            <p>Situation: ${question.toString()}</p>
            <p>Respond now!</p>
            <${CountdownTimer} time=${Timings[gameState]/1000} />
        </${CreateWrapper}>
    `
}

export function CreateVoting({ gameState, responses }) {
    return html`
        <${CreateWrapper}>
            Responses:
            <ul class="list-group">${Object.values(responses).map(r => html`<li class="list-group-item">${r.response}</li>`)}</ul>
            Vote now on your phones!
            <${CountdownTimer} time=${Timings[gameState]/1000} />
        </${CreateWrapper}>
    `
}

export function CreateResults({ gameState, results }) {
    return html`
        <${CreateWrapper}>
            Results:
            <ul class="list-group">${Object.values(results).map(r => html`<li class="list-group-item d-flex align-items-center">
                <span class="badge badge-primary badge-pill mr-3">${r.votes}</span> ${r.name}: ${r.response}
            </li>`)}</ul>
            <${CountdownTimer} time=${Timings[gameState]/1000} />
        </${CreateWrapper}>
    `
}

export function CreateLeaderboard({ gameState, players }) {
    return html`
        <${CreateWrapper}>
            Leaderboard:
            <ul class="list-group">${Object.values(players).map(p => html`<li class="list-group-item d-flex align-items-center">
                <span class="badge badge-primary badge-pill mr-3">${p.votes}</span> ${p.name}
            </li>`)}</ul>
            <${CountdownTimer} time=${Timings[gameState]/1000} />
        </${CreateWrapper}>
    `
}

export function CreateFallback() {
    return html`<h1 style="color: red">Unimplemented State</h1>`
}
