import { html } from 'https://unpkg.com/htm/preact/standalone.module.js'
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

export function CreateStopped({ socket, players }) {
    console.log(players)
    return html`
        <div>
            Go to: ${window.location.origin} to join
            <button onclick=${() => { socket.emit('startGame') }}>Start Game</button>
            <div>
                <h3>Players:</h3>
                <ul>${Object.values(players).map(p => html`<li>${p.name}</li>`)}</ul>
            </div>
        </div>
    `
}

export function CreateResponding({ gameState, question }) {
    return html`
        <div>
            <p>Situation: ${question.toString()}</p>
            <p>Respond now!</p>
            <${CountdownTimer} time=${Timings[gameState]/1000} />
        </div>
    `
}

export function CreateVoting({ gameState, responses }) {
    return html`
        <div>
            Responses:
            <ul>${Object.values(responses).map(r => html`<li>${r.response}</li>`)}</ul>
            Vote now on your phones!
            <${CountdownTimer} time=${Timings[gameState]/1000} />
        </div>
    `
}

export function CreateResults({ gameState, results }) {
    return html`
        <div>
            Results:
            <ul>${Object.values(results).map(r => html`<li>[${r.votes}] ${r.name}: ${r.response}</li>`)}</ul>
            <${CountdownTimer} time=${Timings[gameState]/1000} />
        </div>
    `
}

export function CreateLeaderboard({ gameState, players }) {
    return html`
        <div>
            Leaderboard:
            <ul>${Object.values(players).map(p => html`<li>[${p.votes}] ${p.name}</li>`)}</ul>
            <${CountdownTimer} time=${Timings[gameState]/1000} />
        </div>
    `
}

export function CreateFallback() {
    return html`<h1 style="color: red">Unimplemented State</h1>`
}
