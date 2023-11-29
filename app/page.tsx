"use client";

import Link from "next/link";
import Particles from "./components/particles";
import React from "react";
import Balancer from "react-wrap-balancer";
import Typewriter from "typewriter-effect";

const navigation = [
	{ name: "LinkedIn", href: "https://www.linkedin.com/in/dy0gu" },
	{ name: "GitHub", href: "https://www.github.com/dy0gu" },
	{ name: "Email", href: "mailto:email@diogo.work" },
];

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
			<nav className="my-16 mx-16 animate-fade-in">
				<ul className="flex text-md md:text-md lg:text-xl items-center justify-center gap-4">
					{navigation.map((item, index) => (
						<React.Fragment key={item.href}>
							<Link
								href={item.href}
								className="duration-500 text-zinc-500 hover:text-zinc-300"
							>
								{item.name}
							</Link>
							{index !== navigation.length - 1 && (
								<span className="text-white"> ● </span>
							)}
						</React.Fragment>
					))}
				</ul>
			</nav>
			<div className="hidden mx-16 w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
			<Particles
				className="absolute inset-0 -z-10 animate-fade-in"
				quantity={100}
			/>
			<h1 className="z-10 text-6xl md:text-7xl lg:text-8xl text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title font-display bg-clip-text ">
				<b>DY0GU</b>
			</h1>

			<div className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
			<div className="my-16 mx-16 text-center animate-fade-in">
				<h2 className="text-md md:text-md lg:text-xl text-zinc-500 ">
					<Balancer>
						<Typewriter
							options={{
								strings: [
									"",
									"",
									"That's my user handle up there in big letters!",
									'Look at that, the <span style="color: pink;">text</span> changed, crazy...',
									"Have you heard about the mathematician who's afraid of negative numbers?",
									'He\'ll stop at <span style="color: green;">nothing</span> to avoid them.',
									"Is making your own website a developer cliché already?",
									'In my school we only learned 25 letters of the alphabet, to this day I still don\'t know <span style="color: orange;">y</span>.',
									"How come scientists don't trust atoms?",
									"Because they make up everything!",
									'Watch my all time favorite <a href=https://www.youtube.com/watch?v=xvFZjo5PgG0 style="color: white;">video</a> on YouTube!',
									"Parallel lines have so much in common. It's a shame they'll never meet.",
									'Hotdogs all look the same because they\'re <span style="color: brown;">in-bread</span>.',
									"I've been writing a book on procrastination.",
									"I'll finish it one of these days...",
									'You should also check out <a href=https://www.instagram.com/jtsimoes style="color: white;">@jtsimoes</a>!',
									"Do you think I overdid it with the font size?",
									'Have you ever noticed how the word "bed" kinda looks like a bed?',
									'Ireland is just one <span style="color: cyan;">sea</span> away from Iceland.',
									"You're still reading these?",
									"Come on go home, there is nothing more to see here.",
									"I'm serious, there are no more quirky or funny messages.",
									"Okay now you're making me upset.",
									'Go <span style="color: red;">away</span>.',
									"You know what? I'm just gonna <span style=\"color: yellow;\">loop</span> you to the beginning, let's see how you like that!",
								],
								autoStart: true,
								loop: true,
								deleteSpeed: 25,
								delay: 75,
							}}
						/>
					</Balancer>
				</h2>
			</div>
		</div>
	);
}
