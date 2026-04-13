import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

export default function LoadingScreen(props) {
    const [isVisible, setIsVisible] = React.useState(true)

    React.useEffect(() => {
        // 在指定的 duration（秒）之后，触发退场动画
        const timer = setTimeout(() => {
            setIsVisible(false)
        }, props.duration * 1000)

        return () => clearTimeout(timer)
    }, [props.duration])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    // 出场动画：平滑的 Fade Out
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                    style={{
                        // 占满父级容器（或使用 position: fixed 占满全屏）
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: props.backgroundColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                        // 防止退场时挡住底下的点击事件
                        pointerEvents: isVisible ? "auto" : "none",
                    }}
                >
                    <div style={{ width: "min(320px, 72vw)", textAlign: "center" }}>
                        {/* 进度条轨道 */}
                        <div
                            style={{
                                width: "100%",
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: props.trackColor,
                                overflow: "hidden",
                            }}
                        >
                            {/* 进度条填充，随 duration 时间从 0 变到 100% */}
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{
                                    duration: props.duration,
                                    ease: "easeInOut",
                                }}
                                style={{
                                    height: "100%",
                                    backgroundColor: props.barColor,
                                    borderRadius: 2,
                                }}
                            />
                        </div>
                        {/* 闪烁的 LOADING 文本 */}
                        <motion.p
                            initial={{ opacity: 0.4 }}
                            animate={{ opacity: 1 }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                            style={{
                                margin: "14px 0 0",
                                fontSize: 11,
                                letterSpacing: "0.28em",
                                color: props.textColor,
                                textTransform: "uppercase",
                                fontFamily:
                                    "'Helvetica Neue', Helvetica, Arial, sans-serif",
                            }}
                        >
                            {props.text}
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// 默认属性，与我们的 3D 模型纯黑风格保持一致
LoadingScreen.defaultProps = {
    duration: 2,
    backgroundColor: "#000000",
    trackColor: "#333333",
    barColor: "#c4c4c4",
    textColor: "#8a8a8a",
    text: "LOADING",
}

// 暴露出可在 Framer 右侧面板调整的控件
addPropertyControls(LoadingScreen, {
    duration: {
        type: ControlType.Number,
        title: "Duration (s)",
        defaultValue: 2,
        min: 0.5,
        max: 10,
        step: 0.1,
    },
    text: {
        type: ControlType.String,
        title: "Text",
        defaultValue: "LOADING",
    },
    backgroundColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#000000",
    },
    trackColor: {
        type: ControlType.Color,
        title: "Track Color",
        defaultValue: "#333333",
    },
    barColor: {
        type: ControlType.Color,
        title: "Bar Color",
        defaultValue: "#c4c4c4",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#8a8a8a",
    },
})
