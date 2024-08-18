import { useEffect, useRef, useState } from "react";
import { cn } from "~/utils/cn";

type TypewriterProps = {
	strings: string[];
	sequence: "array" | "random";
	active?: boolean;
	loop?: boolean;
	deleteDelay?: number;
	deleteReverseDelay?: number;
	typeDelay?: number;
	typeReverseDelay?: number;
	startDelay?: number;
	className?: string;
	cursorClassName?: string;
};

function Typewriter({
	strings,
	sequence,
	active = true,
	loop = true,
	deleteDelay = 25,
	deleteReverseDelay = 300,
	typeDelay = 80,
	typeReverseDelay = 1000,
	startDelay = 0,
	className,
	cursorClassName,
}: TypewriterProps) {
	const [text, setText] = useState("");
	const [currentIndex, setCurrentIndex] = useState(0);
	const isFirstRunRef = useRef(true);
	const startTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const remainingStringsRef = useRef<string[]>([]);

	useEffect(() => {
		function getNextString() {
			if (sequence === "array") {
				return strings[currentIndex];
			}
			if (remainingStringsRef.current.length === 0) {
				remainingStringsRef.current = [...strings];
			}
			const randomIndex = Math.floor(
				Math.random() * remainingStringsRef.current.length,
			);
			const nextString = remainingStringsRef.current[randomIndex];
			remainingStringsRef.current.splice(randomIndex, 1);
			return nextString;
		}

		async function write() {
			if (isFirstRunRef.current) {
				await new Promise((resolve) => {
					startTimeoutRef.current = setTimeout(resolve, startDelay);
				});
			}
			isFirstRunRef.current = false;

			while (true) {
				const currentString = getNextString();
				let i = 0;

				while (i <= currentString.length) {
					// Detect the start of an HTML tag
					if (currentString[i] === "<") {
						// Find the end of the HTML tag
						const tagEndIndex = currentString.indexOf(">", i);
						if (tagEndIndex !== -1) {
							// Immediately add the full tag
							setText(
								(prevText) =>
									prevText + currentString.slice(i, tagEndIndex + 1),
							);
							// Skip past the HTML tag in the loop
							i = tagEndIndex + 1;
							continue;
						}
					}

					// Add regular text character by character
					setText(currentString.slice(0, i + 1));
					await new Promise((resolve) => {
						typingTimeoutRef.current = setTimeout(resolve, typeDelay);
					});
					i++;
				}

				await new Promise((resolve) => {
					typingTimeoutRef.current = setTimeout(resolve, typeReverseDelay);
				});

				// Delete characters in reverse
				let j = currentString.length;
				while (j >= 0) {
					// Detect the start of an HTML tag
					if (currentString[j] === ">") {
						// Find the end of the HTML tag
						const tagStartIndex = currentString.lastIndexOf("<", j);
						if (tagStartIndex !== -1) {
							// Immediately remove the full tag
							setText((prevText) => prevText.slice(0, tagStartIndex));
							// Skip past the HTML tag in the loop
							j = tagStartIndex - 1;
							continue;
						}
					}
					setText(currentString.slice(0, j));
					await new Promise((resolve) => {
						typingTimeoutRef.current = setTimeout(resolve, deleteDelay);
					});
					j--;
				}

				await new Promise((resolve) => {
					typingTimeoutRef.current = setTimeout(resolve, deleteReverseDelay);
				});

				// Update the index and check loop conditions
				if (sequence === "array") {
					setCurrentIndex((prevIndex) => (prevIndex + 1) % strings.length);
				}
				if (
					!loop &&
					sequence === "array" &&
					currentIndex === strings.length - 1
				) {
					break;
				}
			}
		}

		if (active) {
			write();
		}

		return () => {
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}
			if (startTimeoutRef.current) {
				clearTimeout(startTimeoutRef.current);
			}
		};
	}, [
		strings,
		sequence,
		loop,
		deleteDelay,
		deleteReverseDelay,
		typeDelay,
		typeReverseDelay,
		startDelay,
		active,
		currentIndex,
	]);

	return (
		<p className={cn("inline-block cursor-default text-center", className)}>
			<span dangerouslySetInnerHTML={{ __html: text }} />
			<span className={cn("animate-fade-blink select-none", cursorClassName)}>
				|
			</span>
		</p>
	);
}

export const quips = [
	"Writing <span style='color: white;'>code</span> since...?",
	"Is making your own website a <span style='color: white;'>developer</span> cliché already?",
	"Watch my all time favorite <a href=https://www.youtube.com/watch?v=xvFZjo5PgG0 style='text-decoration: underline; color: white;'>video</a> on YouTube!",
	"The <span style='color: white;'>cake</span> was, in fact, a lie.",
	"You should also check out <a href=https://www.instagram.com/jtsimoes style='text-decoration: underline; color: white;'>jtsimoes</a>!",
	"Do you think this <span style='color: white;'>font</span> is too big?",
	"Ireland is just one <span style='color: white;'>sea</span> away from Iceland.",
	"We've got some <span style='color: hotpink;'>pink</span> text too, if you want it!",
	"They had a broken <span style='color: white;'>keyboard</span>, I bought a broken keyboard.",
	"Do you want <span style='color: white;'>ants</span>? Because that's how you get ants!",
	"Winter <span style='color: white;'>is</span> coming...",
	"Their are <span style='color: white;'>three</span> erors in this sentence.",
	"Snake? <span style='color: white;'>Snake?</span> SNAAAAAAKE!",
	"01100100 <span style='color: white;'>01111001</span> 00110000 <span style='color: white;'>01100111</span> 01110101",
	"It's dangerous to go alone, take <span style='color: white;'>this</span>.",
	"The human race will not go <span style='color: white;'>extinct</span> in your lifetime!",
	"How about another <span style='color: white;'>joke</span>, Murray?",
	"Hotdogs all look the same because they're <span style='color: white;'>in-bread</span>.",
	"To infinity and <span style='color: white;'>beyond</span>!",
	"Remember, the <span style='color: white;'>night</span> is darkest just before the dawn.",
	"That's what <span style='color: white;'>she</span> said!",
	"On your <span style='color: white;'>left</span>.",
	"Apathy's a tragedy and <span style='color: white;'>boredom</span> is a crime.",
	"Is it just me, or is it getting <span style='color: white;'>crazier</span> out there?",
	"We have to go <span style='color: white;'>back</span> Kate!",
	"You don't need a <span style='color: white;'>parachute</span> to jump off a plane, only if you want to do it again.",
	"Did I ever tell you the <span style='color: white;'>definition</span> of insanity?",
	"I like <span style='color: white;'>shorts</span>! They're comfy and easy to wear!",
	"All we had to do was follow the <span style='color: white;'>damn</span> train, CJ!",
	"Crazy? I was <span style='color: white;'>crazy</span> once.",
	"Yes, <span style='color: white;'>chef</span>!",
];

export { Typewriter };
