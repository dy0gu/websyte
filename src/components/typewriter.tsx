import { useEffect, useState } from "react";
import { cn } from "~/utils/cn";

type TypewriterProps = {
	strings: string[];
	deleteDelay?: number;
	deleteReverseDelay?: number;
	typeDelay?: number;
	typeReverseDelay?: number;
	startDelay?: number;
	className?: string;
	cursorClassName?: string;
};

function Typewriter({
	className,
	cursorClassName,
	strings,
	deleteDelay = 25,
	deleteReverseDelay = 500,
	typeDelay = 100,
	typeReverseDelay = 1000,
	startDelay = 0,
}: TypewriterProps) {
	const [text, setText] = useState("");
	const [loopNum, setLoopNum] = useState(0);
	const [hasStarted, setHasStarted] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [writeDelay, setWriteDelay] = useState(typeDelay);

	console.log(loopNum, strings.length);
	console.log;
	const currentString =
		strings[(loopNum ? loopNum - 3 : 0) % strings.length] ?? "";

	function parse(text: string, isDeleting: boolean) {
		let index = text.length;

		if (isDeleting) {
			while (index > 0) {
				index--;
				if (currentString[index] === ">") {
					while (index > 0 && currentString[index] !== "<") {
						index--;
					}
					index--;
				}
				break;
			}
		} else {
			while (index < currentString.length) {
				index++;
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
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: effect only depends on text and direction changes
	useEffect(() => {
		function write() {
			if (isDeleting) {
				setText((prev) => {
					const nextText = parse(prev, true);
					setWriteDelay(deleteDelay);
					if (nextText === "") {
						setWriteDelay(deleteReverseDelay);
						setLoopNum((prev) => prev + 1);
						setTimeout(() => setIsDeleting(false), deleteReverseDelay);
					}
					return nextText;
				});
			} else {
				setText((prev) => {
					const nextText = parse(prev, false);
					setWriteDelay(typeDelay);
					if (nextText === currentString) {
						setWriteDelay(typeReverseDelay);
						setTimeout(() => setIsDeleting(true), typeReverseDelay);
					}
					return nextText;
				});
			}
		}

		if (hasStarted) {
			const typingTimeout = setTimeout(write, writeDelay);
			return () => clearTimeout(typingTimeout);
		}

		setHasStarted(true);
		const startTimeout = setTimeout(() => {
			write();
		}, startDelay);
		return () => clearTimeout(startTimeout);
	}, [text, isDeleting]);

	return (
		<p className={cn("inline-block text-balance cursor-default", className)}>
			<span dangerouslySetInnerHTML={{ __html: text }} />
			<span className={cn("animate-fade-blink", cursorClassName)}>|</span>
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
	"Their are <span style='color: white;'>three</span> erors in this sentence.",
	"Snake? <span style='color: white;'>Snake?</span> SNAAAAAAKE!",
	"01100100 <span style='color: white;'>01111001</span> 00110000 <span style='color: white;'>01100111</span> 01110101",
	"The human race will not go <span style='color: white;'>extinct</span> in your lifetime!",
	"How about another <span style='color: white;'>joke</span>, Murray?",
	"Hotdogs all look the same because they're <span style='color: white;'>in-bread</span>.",
	"That's what <span style='color: white;'>she</span> said!",
	"Apathy's a tragedy and <span style='color: white;'>boredom</span> is a crime.",
	"You don't need a <span style='color: white;'>parachute</span> to jump off a plane, only to do it twice.",
	"Did I ever tell you the <span style='color: white;'>definition</span> of insanity?",
	"I like <span style='color: white;'>shorts</span>! They're comfy and easy to wear!",
	"All we had to do was follow the <span style='color: white;'>damn</span> train, CJ!",
	"Crazy? I was <span style='color: white;'>crazy</span> once.",
	"",
	"You're really <span style='color: white;'>still</span> reading these?",
	"Come on, get out, there is <span style='color: white;'>nothing</span> else to see here.",
	"I'm <span style='color: white;'>serious</span>, no more references.",
	"",
	"Okay now you're making me <span style='color: white;'>upset</span>.",
	"",
	"<span style='color: white;'>Go</span> away.",
	"",
	"You know what? I'm just gonna <span style='color: white;'>loop</span> this text, see if you like that.",
	"",
];

export { Typewriter };
