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
            Go to: 100.65.76.186:8080 to join
            <button onclick=${() => { socket.emit('startGame') }}>Start Game</button>
            <div>
                <h3>Players:</h3>
                <div>${Object.values(players).map(p => html`<span>${p.name}</span>`)}</div>
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
            <div>${Object.values(responses).map(r => html`<span>${r.response}</span>`)}</div>
            Vote now on your phones!
            <${CountdownTimer} time=${Timings[gameState]/1000} />
        </div>
    `
}

export function CreateResults({ gameState, results }) {
    return html`
        <div>
            Results:
            <div>${Object.values(results).map(r => html`<span>[${r.votes}] ${r.name}: ${r.response}</span>`)}</div>
            <${CountdownTimer} time=${Timings[gameState]/1000} />
        </div>
    `
}

export function CreateLeaderboard({ gameState, players }) {
    return html`
        <div>
            Leaderboard:
            <div>${Object.values(players).map(p => html`<span>[${p.votes}] ${p.name}</span>`)}</div>
            <${CountdownTimer} time=${Timings[gameState]/1000} />
        </div>
    `
}

export function CreateFallback() {
    return html`<h1 style="color: red">Unimplemented State</h1>`
}