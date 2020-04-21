import { html, useState, useEffect } from 'https://unpkg.com/htm/preact/standalone.module.js'

export function CountdownTimer({ time }) {
    const [timeLeft, setTimeLeft] = useState(time)

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(cur => cur - 0.05)
        }, 50)
        return () => {
            clearInterval(timer)
        }
    }, [])

    return html`
        <div class="progress">
            <div class="progress-bar" role="progressbar" style="width: ${timeLeft/time * 100}%">${Math.floor(timeLeft)}s</progress>
        </div>
    `
}