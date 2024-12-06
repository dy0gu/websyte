import { useEffect, useRef, useState } from "react";

const CODE = [
	"ARROWUP",
	"ARROWUP",
	"ARROWDOWN",
	"ARROWDOWN",
	"ARROWLEFT",
	"ARROWRIGHT",
	"ARROWLEFT",
	"ARROWRIGHT",
	"B",
	"A",
] as const;
type CodeType = (typeof CODE)[number];

const MESSAGE = [
	"---------------------",
	"|                   |",
	"|  Dy0gu was here!  |",
	"|                   |",
	"--------------------",
].join("\n");

export function useMystery() {
	const [count, setCount] = useState(0);
	const ref = useRef<string | null>(null);

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			const key = e.key.toUpperCase();

			if (key === "SHIFT" || key === "CAPSLOCK" || key === "ALT") {
				return;
			}

			if (key !== ref.current) {
				ref.current = key;

				setCount((currentCount) => {
					const isValid = CODE.includes(key as CodeType);
					if (!isValid) {
						return 0;
					}

					if (key !== CODE[currentCount]) {
						return 0;
					}

					return currentCount + 1;
				});
				ref.current = null;
			}
		}

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	useEffect(() => {
		if (count === CODE.length) {
			// biome-ignore lint/suspicious/noConsole: intended as an easter egg
			console.info(MESSAGE);
		}
	}, [count]);

	return count;
}
