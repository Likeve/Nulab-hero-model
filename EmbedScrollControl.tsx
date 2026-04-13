import { useEffect, useRef } from "react"
import { addPropertyControls, ControlType } from "framer"

export function EmbedScrollControl(Component) {
    return function WrappedComponent(props) {
        const embedRef = useRef(null)
        const isScrollLocked = useRef(false)
        const scrollProgress = useRef(0)
        const isEmbedVisible = useRef(false)
        const startY = useRef(0)
        const isDragging = useRef(false)

        useEffect(() => {
            if (!embedRef.current) return

            const embed = embedRef.current
            let observer

            // 监听 Embed 区域的可见度
            const handleIntersection = (entries) => {
                entries.forEach(entry => {
                    isEmbedVisible.current = entry.intersectionRatio >= 0.6
                    
                    if (isEmbedVisible.current) {
                        // 进入视图时锁定页面滚动
                        document.body.style.overflow = 'hidden'
                        document.body.style.touchAction = 'none'
                        isScrollLocked.current = true
                    }
                })
            }

            observer = new IntersectionObserver(handleIntersection, {
                threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
            })
            observer.observe(embed)

            // 桌面端滚轮事件
            const handleWheel = (e) => {
                if (!isScrollLocked.current) return

                e.preventDefault()
                const deltaY = e.deltaY
                updateProgress(deltaY * 0.001)
            }

            // 移动端触摸事件
            const handleTouchStart = (e) => {
                if (!isScrollLocked.current) return
                startY.current = e.touches[0].clientY
                isDragging.current = true
            }

            const handleTouchMove = (e) => {
                if (!isScrollLocked.current || !isDragging.current) return
                
                e.preventDefault()
                const currentY = e.touches[0].clientY
                const deltaY = startY.current - currentY
                startY.current = currentY
                
                updateProgress(deltaY * 0.002)
            }

            const handleTouchEnd = () => {
                isDragging.current = false
            }

            // 更新进度并通知 iframe
            const updateProgress = (delta) => {
                const newProgress = Math.max(0, Math.min(1, scrollProgress.current + delta))
                
                if (newProgress !== scrollProgress.current) {
                    scrollProgress.current = newProgress
                    
                    // 通过 postMessage 发送进度给 iframe
                    const iframe = embed.querySelector('iframe')
                    if (iframe && iframe.contentWindow) {
                        iframe.contentWindow.postMessage({
                            type: 'SCROLL_PROGRESS',
                            progress: newProgress
                        }, '*')
                    }
                }

                // 进度达到 100% 时解锁页面滚动
                if (newProgress >= 1 && isScrollLocked.current) {
                    setTimeout(() => {
                        document.body.style.overflow = ''
                        document.body.style.touchAction = ''
                        isScrollLocked.current = false
                        
                        // 平滑滚动到下一个区域
                        const nextElement = embed.nextElementSibling
                        if (nextElement) {
                            nextElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }
                    }, 200) // 短暂延迟确保动画播完
                }
            }

            // 添加事件监听
            window.addEventListener('wheel', handleWheel, { passive: false })
            window.addEventListener('touchstart', handleTouchStart, { passive: false })
            window.addEventListener('touchmove', handleTouchMove, { passive: false })
            window.addEventListener('touchend', handleTouchEnd, { passive: true })

            // 监听来自 iframe 的消息
            const handleMessage = (event) => {
                if (event.data.type === 'MODEL_LOADED') {
                    // 模型加载完成，准备接管滚动
                    console.log('3D Model loaded, scroll control ready')
                }
            }
            window.addEventListener('message', handleMessage)

            return () => {
                if (observer) observer.disconnect()
                window.removeEventListener('wheel', handleWheel)
                window.removeEventListener('touchstart', handleTouchStart)
                window.removeEventListener('touchmove', handleTouchMove)
                window.removeEventListener('touchend', handleTouchEnd)
                window.removeEventListener('message', handleMessage)
                
                // 清理页面状态
                document.body.style.overflow = ''
                document.body.style.touchAction = ''
            }
        }, [])

        return (
            <Component 
                {...props} 
                ref={embedRef}
                style={{
                    ...props.style,
                    minHeight: '100vh',
                    width: '100%',
                    position: 'relative'
                }}
            />
        )
    }
}

// 添加属性控制面板
addPropertyControls(EmbedScrollControl, {
    // 可以添加一些控制参数，比如滚动敏感度等
})