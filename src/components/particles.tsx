import { useEffect, useRef, useState } from "react";

type ParticlesProps = {
	className?: string;
	quantity?: number;
	staticity?: number;
	ease?: number;
};

type MousePosition = {
	x: number;
	y: number;
};

function useMousePosition(): MousePosition {
	const [mousePosition, setMousePosition] = useState<MousePosition>({
		x: 0,
		y: 0,
	});

	useEffect(() => {
		const handleMouseMove = (event: MouseEvent) => {
			setMousePosition({ x: event.clientX, y: event.clientY });
		};

		window.addEventListener("mousemove", handleMouseMove);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	return mousePosition;
}

function Particles({
	className,
	quantity = 100,
	staticity = 30,
	ease = 40,
}: ParticlesProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const canvasContainerRef = useRef<HTMLDivElement>(null);
	const context = useRef<CanvasRenderingContext2D | null>(null);
	const circles = useRef<Circle[]>([]);
	const mousePosition = useMousePosition();
	const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
	const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
	const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

	useEffect(() => {
		if (canvasRef.current) {
			context.current = canvasRef.current.getContext("2d");
		}

		initCanvas();
		animate();
		window.addEventListener("resize", initCanvas);

		return () => {
			window.removeEventListener("resize", initCanvas);
		};
	}, []);

	useEffect(() => {
		onMouseMove(mousePosition.x, mousePosition.y);
	}, [mousePosition.x, mousePosition.y]);

	useEffect(() => {
		initCanvas();
	}, []);

	function initCanvas() {
		resizeCanvas();
		drawParticles();
	}

	function onMouseMove(mouseX: number, mouseY: number) {
		if (canvasRef.current) {
			const rect = canvasRef.current.getBoundingClientRect();
			const { w, h } = canvasSize.current;
			const x = mouseX - rect.left - w / 2;
			const y = mouseY - rect.top - h / 2;
			const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;

			if (inside) {
				mouse.current.x = x;
				mouse.current.y = y;
			}
		}
	}

	type Circle = {
		x: number;
		y: number;
		translateX: number;
		translateY: number;
		size: number;
		alpha: number;
		targetAlpha: number;
		dx: number;
		dy: number;
		magnetism: number;
	};

	function resizeCanvas() {
		if (canvasContainerRef.current && canvasRef.current && context.current) {
			circles.current.length = 0;
			canvasSize.current.w = canvasContainerRef.current.offsetWidth;
			canvasSize.current.h = canvasContainerRef.current.offsetHeight;
			canvasRef.current.width = canvasSize.current.w * dpr;
			canvasRef.current.height = canvasSize.current.h * dpr;
			canvasRef.current.style.width = `${canvasSize.current.w}px`;
			canvasRef.current.style.height = `${canvasSize.current.h}px`;
			context.current.scale(dpr, dpr);
		}
	}

	function buildCircle(): Circle {
		const x = Math.floor(Math.random() * canvasSize.current.w);
		const y = Math.floor(Math.random() * canvasSize.current.h);
		const translateX = 0;
		const translateY = 0;
		const size = Math.floor(Math.random() * 5) + 0.1;
		const alpha = 0;
		const targetAlpha = Number.parseFloat(
			(Math.random() * 0.6 + 0.1).toFixed(1),
		);
		const dx = (Math.random() - 0.5) * 0.2;
		const dy = (Math.random() - 0.5) * 0.2;
		const magnetism = 0.1 + Math.random() * 4;

		return {
			x,
			y,
			translateX,
			translateY,
			size,
			alpha,
			targetAlpha,
			dx,
			dy,
			magnetism,
		};
	}

	function drawCircle(circle: Circle, update = false) {
		if (context.current) {
			const { x, y, translateX, translateY, size, alpha } = circle;

			context.current.translate(translateX, translateY);
			context.current.beginPath();
			context.current.arc(x, y, size, 0, 2 * Math.PI);
			context.current.fillStyle = `rgba(255, 255, 255, ${alpha})`;
			context.current.fill();
			context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

			if (!update) {
				circles.current.push(circle);
			}
		}
	}

	function clearContext() {
		if (context.current) {
			context.current.clearRect(
				0,
				0,
				canvasSize.current.w,
				canvasSize.current.h,
			);
		}
	}

	function drawParticles() {
		clearContext();
		const particleCount = quantity;

		for (let i = 0; i < particleCount; i++) {
			const circle = buildCircle();

			drawCircle(circle);
		}
	}

	function remap(
		value: number,
		firstStart: number,
		firstEnd: number,
		secondStart: number,
		secondEnd: number,
	): number {
		const remapped =
			((value - firstStart) * (secondEnd - secondStart)) /
				(firstEnd - firstStart) +
			secondStart;

		return remapped > 0 ? remapped : 0;
	}

	function animate() {
		clearContext();
		circles.current.forEach((circle: Circle, i: number) => {
			const edge = [
				circle.x + circle.translateX - circle.size,
				canvasSize.current.w - circle.x - circle.translateX - circle.size,
				circle.y + circle.translateY - circle.size,
				canvasSize.current.h - circle.y - circle.translateY - circle.size,
			];
			const closestEdge = edge.reduce((a, b) => Math.min(a, b));
			const remapClosestEdge = Number.parseFloat(
				remap(closestEdge, 0, 20, 0, 1).toFixed(2),
			);

			if (remapClosestEdge > 1) {
				circle.alpha += 0.02;

				if (circle.alpha > circle.targetAlpha) {
					circle.alpha = circle.targetAlpha;
				}
			} else {
				circle.alpha = circle.targetAlpha * remapClosestEdge;
			}

			circle.x += circle.dx;
			circle.y += circle.dy;
			circle.translateX +=
				(mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
				ease;
			circle.translateY +=
				(mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
				ease;

			if (
				circle.x < -circle.size ||
				circle.x > canvasSize.current.w + circle.size ||
				circle.y < -circle.size ||
				circle.y > canvasSize.current.h + circle.size
			) {
				circles.current.splice(i, 1);
				const params = buildCircle();
				drawCircle(params);
			} else {
				drawCircle(
					{
						...circle,
						x: circle.x,
						y: circle.y,
						translateX: circle.translateX,
						translateY: circle.translateY,
						alpha: circle.alpha,
					},
					true,
				);
			}
		});
		window.requestAnimationFrame(animate);
	}

	return (
		<div className={className} ref={canvasContainerRef} aria-hidden="true">
			<canvas ref={canvasRef} />
		</div>
	);
}

export { Particles };
