import { Component, createContext, html } from 'https://unpkg.com/htm/preact/standalone.module.js'
import { State } from './SocketState.mjs'

export const SocketContext = createContext({
    gameState: State.STOPPED,
    question: '',
    responses: {},
    results: {},
    players: {},
    socket: null
})

export class SocketStateComponent extends Component {
    constructor() {
        super()
        this.state = {
            gameState: State.STOPPED,
            question: '',
            responses: {},
            results: {},
            players: {}
        }
        this.socket = io()
        this.socket.on('state', (state) => {
            this.setState({ gameState: state })
        })
        this.socket.on('question', (question) => {
            this.setState({ question })
        })
        this.socket.on('responses', (responses) => {
            this.setState({ responses })
        })
        this.socket.on('results', (results) => {
            this.setState({ results })
        })
        this.socket.on('players', (players) => {
            this.setState({ players })
        })
    }

    render() {
        return html`
            <${SocketContext.Provider} value=${{ ...this.state, socket: this.socket }}>
                ${this.props.children}
            </${SocketContext.Provider}>
        `
    }
}

export function SocketRoute({ on, to }) {
    return html`
        <${SocketContext.Consumer}>
        ${ state => {
            if (state.gameState === on) {
                console.dir(state)
                return html`<${to} ...${state} />`
            }
        }}
        </${SocketContext.Consumer}>
    `
}