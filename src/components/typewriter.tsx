import { useEffect, useState } from "react";
import { cn } from "~/utils/cn";

type TypewriterProps = {
	strings: string[];
	deleteSpeed?: number;
	typeSpeed?: number;
	startDelay?: number;
	deleteDelay?: number;
	className?: string;
	cursorClassName?: string;
};

function Typewriter({
	className,
	cursorClassName,
	strings,
	deleteSpeed = 25,
	typeSpeed = 75,
	startDelay = 0,
	deleteDelay = 1000,
}: TypewriterProps) {
	const [text, setText] = useState("");
	const [loopNum, setLoopNum] = useState(0);
	const [hasStarted, setHasStarted] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [currentSpeed, setTypingSpeed] = useState(typeSpeed);

	const currentString = strings[loopNum % strings.length];

	const getNextText = (text: string, isDeleting: boolean): string => {
		let index = text.length;
		let inTag = false;

		if (isDeleting) {
			while (index > 0) {
				index--;
				if (currentString[index] === ">") {
					inTag = true;
				} else if (currentString[index] === "<") {
					inTag = false;
					continue;
				}
				if (!inTag) break;
			}
		} else {
			while (index < currentString.length) {
				if (currentString[index] === "<") {
					while (index < currentString.length && currentString[index] !== ">") {
						index++;
					}
					index++;
					continue;
				}
				break;
			}
		}

		return currentString.slice(0, index);
	};
	useEffect(() => {
		function handleTyping() {
			if (isDeleting) {
				setText((prev) => getNextText(prev, true));
				setTypingSpeed(deleteSpeed);
			}
			const nextText = getNextText(text, false);
			setText(nextText);
			setTypingSpeed(typeSpeed);

			if (nextText === currentString) {
				setTimeout(() => setIsDeleting(true), deleteDelay);
			}

			if (isDeleting && text === "") {
				setIsDeleting(false);
				setLoopNum((prev) => prev + 1);
			}
		}

		if (hasStarted) {
			const typingTimeout = setTimeout(handleTyping, currentSpeed);
			return () => clearTimeout(typingTimeout);
		}

		setHasStarted(true);
		const startTimeout = setTimeout(() => {
			handleTyping();
		}, startDelay);
		return () => clearTimeout(startTimeout);
	}, [text, isDeleting]);

	return (
		<div
			className={cn("inline-flex pointer-events-none text-balance", className)}
		>
			<span dangerouslySetInnerHTML={{ __html: text }} />
			<span className={cn("animate-fade-blink", cursorClassName)}>|</span>
		</div>
	);
}

export { Typewriter };
