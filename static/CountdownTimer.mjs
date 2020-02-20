import { html, useState, useEffect } from 'https://unpkg.com/htm/preact/standalone.module.js'

export function CountdownTimer({ time }) {
    const [timeLeft, setTimeLeft] = useState(time)

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(cur => cur - 1)
        }, 1000)
        return () => {
            clearInterval(timer)
        }
    }, [])

    return html`
        <div>
            ${timeLeft}s <progress max=${time} value=${timeLeft}>${timeLeft}s</progress>
        </div>
    `
}