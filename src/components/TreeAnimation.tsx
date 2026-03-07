import { useEffect, useRef } from 'react'

interface Leaf {
    id: number
    x: number
    y: number
    size: number
    rotation: number
    rotationSpeed: number
    fallSpeed: number
    swayAmount: number
    swaySpeed: number
    swayOffset: number
    opacity: number
    color: string
    shape: number
}

const leafColors = [
    '#2d6a2d', '#3a8a3a', '#4aaa4a',
    '#c8a84b', '#e8c55a', '#5aaa3a',
    '#228b22', '#90c645', '#6abf4b', '#f0d060'
]

function createLeaf(canvas: HTMLCanvasElement, id: number): Leaf {
    return {
        id,
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 100,
        size: 8 + Math.random() * 16,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        fallSpeed: 0.8 + Math.random() * 1.5,
        swayAmount: 30 + Math.random() * 50,
        swaySpeed: 0.5 + Math.random() * 1,
        swayOffset: Math.random() * Math.PI * 2,
        opacity: 0.7 + Math.random() * 0.3,
        color: leafColors[Math.floor(Math.random() * leafColors.length)],
        shape: Math.floor(Math.random() * 3)
    }
}

function drawLeaf(ctx: CanvasRenderingContext2D, leaf: Leaf, time: number) {
    const swayX = leaf.swayAmount * Math.sin(time * leaf.swaySpeed + leaf.swayOffset)
    ctx.save()
    ctx.translate(leaf.x + swayX, leaf.y)
    ctx.rotate(leaf.rotation + time * leaf.rotationSpeed)
    ctx.globalAlpha = leaf.opacity
    ctx.fillStyle = leaf.color

    ctx.beginPath()
    if (leaf.shape === 0) {
        ctx.ellipse(0, 0, leaf.size * 0.5, leaf.size, 0, 0, Math.PI * 2)
    } else if (leaf.shape === 1) {
        ctx.moveTo(0, leaf.size)
        ctx.bezierCurveTo(-leaf.size * 0.8, leaf.size * 0.3, -leaf.size, -leaf.size * 0.3, 0, -leaf.size * 0.2)
        ctx.bezierCurveTo(leaf.size, -leaf.size * 0.3, leaf.size * 0.8, leaf.size * 0.3, 0, leaf.size)
    } else {
        ctx.moveTo(0, -leaf.size)
        ctx.quadraticCurveTo(leaf.size * 0.8, 0, leaf.size * 0.4, leaf.size)
        ctx.quadraticCurveTo(0, leaf.size * 0.7, -leaf.size * 0.4, leaf.size)
        ctx.quadraticCurveTo(-leaf.size * 0.8, 0, 0, -leaf.size)
    }
    ctx.fill()
    ctx.restore()
}

function drawTree(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, time: number) {
    const cx = canvas.width / 2
    const baseY = canvas.height

    // Trunk
    ctx.fillStyle = '#4a3020'
    ctx.beginPath()
    ctx.moveTo(cx - 18, baseY)
    ctx.quadraticCurveTo(cx - 15 + Math.sin(time * 0.3) * 2, baseY - 100, cx - 10, baseY - 200)
    ctx.lineTo(cx + 10, baseY - 200)
    ctx.quadraticCurveTo(cx + 15 + Math.sin(time * 0.3) * 2, baseY - 100, cx + 18, baseY)
    ctx.closePath()
    ctx.fill()

    // Branches
    const branches = [
        { sx: cx - 5, sy: baseY - 170, ex: cx - 130, ey: baseY - 280, w: 7 },
        { sx: cx - 5, sy: baseY - 220, ex: cx - 170, ey: baseY - 360, w: 5 },
        { sx: cx - 5, sy: baseY - 260, ex: cx - 110, ey: baseY - 410, w: 4 },
        { sx: cx + 5, sy: baseY - 170, ex: cx + 130, ey: baseY - 280, w: 7 },
        { sx: cx + 5, sy: baseY - 220, ex: cx + 170, ey: baseY - 360, w: 5 },
        { sx: cx + 5, sy: baseY - 260, ex: cx + 110, ey: baseY - 410, w: 4 },
        { sx: cx, sy: baseY - 280, ex: cx - 50, ey: baseY - 430, w: 3 },
        { sx: cx, sy: baseY - 280, ex: cx + 50, ey: baseY - 430, w: 3 },
        { sx: cx, sy: baseY - 290, ex: cx, ey: baseY - 470, w: 3 },
    ]

    branches.forEach(b => {
        const sway = Math.sin(time * 0.4) * 4
        ctx.strokeStyle = '#5a3a25'
        ctx.lineWidth = b.w
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(b.sx, b.sy)
        ctx.quadraticCurveTo(
            (b.sx + b.ex) / 2 + sway, (b.sy + b.ey) / 2,
            b.ex + sway, b.ey
        )
        ctx.stroke()
    })

    // Foliage
    const clusters = [
        { x: cx - 150, y: baseY - 310, r: 75 },
        { x: cx - 185, y: baseY - 380, r: 65 },
        { x: cx - 120, y: baseY - 410, r: 60 },
        { x: cx + 150, y: baseY - 310, r: 75 },
        { x: cx + 185, y: baseY - 380, r: 65 },
        { x: cx + 120, y: baseY - 410, r: 60 },
        { x: cx, y: baseY - 470, r: 80 },
        { x: cx - 55, y: baseY - 450, r: 65 },
        { x: cx + 55, y: baseY - 450, r: 65 },
        { x: cx - 75, y: baseY - 370, r: 70 },
        { x: cx + 75, y: baseY - 370, r: 70 },
        { x: cx, y: baseY - 410, r: 60 },
    ]

    clusters.forEach((c, i) => {
        const sway = Math.sin(time * 0.4 + i * 0.3) * 5
        const grad = ctx.createRadialGradient(
            c.x + sway, c.y, 0,
            c.x + sway, c.y, c.r
        )
        grad.addColorStop(0, '#4aaa4acc')
        grad.addColorStop(0.5, '#2d6a2daa')
        grad.addColorStop(1, '#1a4a1a00')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(c.x + sway, c.y, c.r, 0, Math.PI * 2)
        ctx.fill()
    })
}

export default function TreeAnimation({ isVisible }: { isVisible: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number>()
    const leavesRef = useRef<Leaf[]>([])
    const timeRef = useRef(0)

    useEffect(() => {
        if (!isVisible) return

        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        leavesRef.current = Array.from({ length: 60 }, (_, i) => createLeaf(canvas, i))

        const animate = () => {
            timeRef.current += 0.016
            const time = timeRef.current

            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = 'rgba(10,31,10,0.95)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            drawTree(ctx, canvas, time)

            leavesRef.current = leavesRef.current.map(leaf => {
                const updated = {
                    ...leaf,
                    y: leaf.y + leaf.fallSpeed,
                    rotation: leaf.rotation + leaf.rotationSpeed
                }
                if (updated.y > canvas.height + 30) {
                    return createLeaf(canvas, leaf.id)
                }
                drawLeaf(ctx, updated, time)
                return updated
            })

            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        const handleResize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        window.addEventListener('resize', handleResize)

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current)
            window.removeEventListener('resize', handleResize)
        }
    }, [isVisible])

    if (!isVisible) return null

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 9999,
                pointerEvents: 'none'
            }}
        />
    )
}
