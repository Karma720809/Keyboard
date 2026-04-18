"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

interface HeroCanvasVideoProps {
  totalFrames?: number;
  imagePathPrefix?: string;
  imagePathSuffix?: string;
}

export default function HeroCanvasVideo({
  totalFrames = 150,
  imagePathPrefix = "/hero-sequence/frame_",
  imagePathSuffix = ".webp"
}: HeroCanvasVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);

  // 숫자를 패딩하여 frame_001 형식으로 만듭니다 (필요에 따라 패딩 길이 3 고정)
  const pad = (n: number) => n.toString().padStart(3, '0');

  useEffect(() => {
    // 모든 프레임 이미지를 미리 메모리에 로드하여 스크롤 시 부드럽게 렌더링되게 합니다
    const loadedImages: HTMLImageElement[] = [];

    for (let i = 1; i <= totalFrames; i++) {
        const img = new Image();
        img.src = `${imagePathPrefix}${pad(i)}${imagePathSuffix}`;
        
        img.onerror = () => {
            // 이미지가 아직 경로에 없더라도 정상 작동하도록 에러를 조용히 무시합니다
        }
        loadedImages.push(img);
    }
    setImages(loadedImages);
  }, [totalFrames, imagePathPrefix, imagePathSuffix]);

  // Framer Motion의 useScroll을 사용하여 현재 컨테이너 내의 스크롤 진행도를 0~1 사이 값으로 얻습니다.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 스크롤 진행도를 프레임 인덱스(0 ~ 149)로 변환합니다.
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, totalFrames - 1]);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const currentImg = images[index];
    if (currentImg && currentImg.complete && currentImg.naturalWidth !== 0) {
       // object-fit: cover 형태로 캔버스에 이미지 그리기
       const hRatio = canvas.width / currentImg.naturalWidth;
       const vRatio = canvas.height / currentImg.naturalHeight;
       const ratio = Math.max(hRatio, vRatio);
       const centerShift_x = (canvas.width - currentImg.naturalWidth * ratio) / 2;
       const centerShift_y = (canvas.height - currentImg.naturalHeight * ratio) / 2;

       ctx.drawImage(currentImg, 0, 0, currentImg.naturalWidth, currentImg.naturalHeight,
                     centerShift_x, centerShift_y, currentImg.naturalWidth * ratio, currentImg.naturalHeight * ratio);
    } else {
        // 이미지가 없을 때의 플레이스홀더 (블랙 배경 + 텍스트)
        ctx.fillStyle = "#0a0a0a"; // 짙은 배경
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "#FFF";
        ctx.font = "bold 48px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`Frame ${index + 1}`, canvas.width / 2, canvas.height / 2 - 20);
        
        ctx.font = "20px Inter, sans-serif";
        ctx.fillStyle = "#666";
        ctx.fillText(`Waiting for images at: ${imagePathPrefix}${pad(index + 1)}${imagePathSuffix}`, canvas.width / 2, canvas.height / 2 + 30);
    }
  };

  // frameIndex 값이 바뀔 때마다 캔버스를 다시 그립니다.
  useMotionValueEvent(frameIndex, "change", (latest) => {
    drawFrame(Math.floor(latest));
  });

  // 초기 캔버스 사이즈 설정 및 resize 대응
  useEffect(() => {
    const handleResize = () => {
        if (canvasRef.current) {
            // 브라우저 픽셀 비율 대응(선명하게 그리기 위함)을 추가할 수 있지만, 여기서는 윈도우 사이즈와 1:1 매칭
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
            drawFrame(Math.floor(frameIndex.get()));
        }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // 최초 1회 실행

    return () => window.removeEventListener("resize", handleResize);
  }, [images, frameIndex]);

  // Text animations mapping to scroll progress
  const opacity1 = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.25], [0, -50]);

  const opacity2 = useTransform(scrollYProgress, [0.2, 0.3, 0.45, 0.55], [0, 1, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.2, 0.3, 0.45, 0.55], [50, 0, 0, -50]);

  const opacity3 = useTransform(scrollYProgress, [0.5, 0.6, 0.75, 0.85], [0, 1, 1, 0]);
  const y3 = useTransform(scrollYProgress, [0.5, 0.6, 0.75, 0.85], [50, 0, 0, -50]);

  const opacity4 = useTransform(scrollYProgress, [0.8, 0.9, 1], [0, 1, 1]);
  const y4 = useTransform(scrollYProgress, [0.8, 0.9, 1], [50, 0, 0]);

  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const bottomGradientOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);

  return (
    // 전체 컨테이너: h-[400vh] 등 높이를 조절하여 비디오 재생 스크롤 길이를 결정합니다.
    <div ref={containerRef} className="relative h-[400vh] w-full bg-black z-10" id="hero-sequence">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 block w-full h-full object-cover"
        />
        
        {/* 오버레이 스크롤 스토리텔링 텍스트 */}
        <div className="relative z-20 w-full h-full pointer-events-none max-w-7xl mx-auto px-8">
            
            {/* 파트 1: 도입부 (중앙) */}
            <motion.div 
                className="absolute inset-0 flex flex-col items-center justify-center text-center text-white"
                style={{ opacity: opacity1, y: y1 }}
            >
                <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 drop-shadow-2xl">
                  BEYOND TYPING.
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 font-light tracking-widest uppercase mb-4">
                  Aura Pro
                </p>
                <div className="w-[1px] h-24 bg-gradient-to-b from-white/50 to-transparent mt-8" />
            </motion.div>

            {/* 파트 2: 중간부 (좌측 정렬) */}
            <motion.div 
                className="absolute inset-0 flex flex-col items-start justify-center text-left text-white md:w-1/2"
                style={{ opacity: opacity2, y: y2 }}
            >
                <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                  Aerospace-Grade<br/>Precision.
                </h2>
                <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed max-w-md">
                  Crafted from a single block of aerospace aluminum. Every curve and angle optimized for acoustic perfection.
                </p>
            </motion.div>

            {/* 파트 3: 심화부 (우측 정렬) */}
            <motion.div 
                className="absolute inset-0 flex flex-col items-end justify-center text-right text-white"
                style={{ opacity: opacity3, y: y3 }}
            >
                <div className="md:w-1/2 flex flex-col items-end">
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                    Zero Latency.<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">8K Polling.</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed max-w-md">
                    The ultimate competitive advantage. Instantaneous actuation and infinite customizability at your fingertips.
                    </p>
                </div>
            </motion.div>

            {/* 파트 4: 결론부 (중앙) */}
            <motion.div 
                className="absolute inset-0 flex flex-col items-center justify-center text-center text-white"
                style={{ opacity: opacity4, y: y4 }}
            >
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-8">
                  Pure Thock.
                </h2>
                <p className="text-2xl text-gray-300 font-light tracking-wide mb-12">
                  Engineered for pure satisfying sound.
                </p>
            </motion.div>

            {/* 스크롤 유도 애니메이션 */}
            <motion.div 
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center text-white/50"
                style={{ opacity: scrollIndicatorOpacity }}
            >
                <p className="text-[10px] uppercase tracking-[0.3em] mb-4">Scroll to discover</p>
                <div className="w-[1px] h-16 bg-white/20 relative overflow-hidden">
                    <motion.div 
                        className="w-full h-1/2 bg-white"
                        animate={{ y: ['-100%', '200%'] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    />
                </div>
            </motion.div>
        </div>
        
        {/* 전체 컨텍스트를 어둡게 눌러주어 시네마틱한 느낌과 텍스트 가독성 부여 */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none z-10" />

        {/* 스크롤 종료 지점에서 다음 섹션과 자연스럽게 이어지도록 하단 블러/그라데이션 추가 */}
        <motion.div 
            className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-30"
            style={{ opacity: bottomGradientOpacity }}
        />
      </div>
    </div>
  );
}
