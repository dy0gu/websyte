import { useEffect, useState } from "react";

const CODE = [
	"Digit4",
	"Digit8",
	"Digit1",
	"Digit5",
	"Digit1",
	"Digit6",
	"Digit2",
	"Digit3",
	"Digit4",
	"Digit2",
];

const MESSAGE = [
	"---------------------",
	"|                   |",
	"|  dy0gu was here!  |",
	"|                   |",
	"---------------------",
].join("\n");

function useInputEvent() {
	const [key, setKey] = useState<string | null>(null);
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			setKey(e.code);
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return key;
}

function useMystery() {
	const [count, setCount] = useState(0);
	const [success, setSuccess] = useState(false);
	const key = useInputEvent();

	// biome-ignore lint/correctness/useExhaustiveDependencies: effect only depends on key presses
	useEffect(() => {
		if (key == null) {
			return;
		}
		if (key !== CODE[count]) {
			setCount(0);
			return;
		}
		setCount((state) => state + 1);
	}, [key]);

	useEffect(() => {
		if (count === CODE.length) {
			console.info(MESSAGE);
			setSuccess(true);
		}
	}, [count]);

	return success;
}

export { useMystery };
