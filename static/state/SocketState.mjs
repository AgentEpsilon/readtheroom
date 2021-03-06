export const NUMBER_OF_ROUNDS = 3

export const State = {
    STOPPED: 'STOPPED',
    RESPONDING: 'RESPONDING',
    VOTING: 'VOTING',
    RESULTS: 'RESULTS',
    LEADERBOARD: 'LEADERBOARD'
}

export const Timings = {
    [State.STOPPED]: 0,
    [State.RESPONDING]: 45000,
    [State.VOTING]: 30000,
    [State.RESULTS]: 5000,
    [State.LEADERBOARD]: 5000
}