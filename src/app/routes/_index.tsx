import { useMystery } from "~/hooks/mystery";

import { info } from "~/configs/metadata";

import { Hero, name } from "~/components/hero";
import { Particles } from "~/components/particles";
import { Typewriter, quips } from "~/components/typewriter";

export default function Page() {
	useMystery();

	return (
		<section
			className="flex flex-col items-center justify-center w-screen h-screen
		overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black"
		>
			<nav className="my-16 mx-16 animate-fade-in">
				<ul
					className="flex list-none flex-row text-sm md:text-md lg:text-xl
				items-center justify-center marker:text-green list-outside list-disc"
				>
					{info.links.map((item, index) => (
						<li key={item.href}>
							<a
								href={item.href}
								className="duration-500 text-zinc-500 hover:text-zinc-300"
							>
								{item.name}
							</a>
							{index < info.links.length - 1 && (
								<span className="mx-3 text-white pointer-events-none">•</span>
							)}
						</li>
					))}
				</ul>
			</nav>
			<div
				className="hidden mx-16 w-screen h-px animate-glow md:block animate-fade-left
			 bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0"
			/>
			<Particles className="absolute inset-0 -z-10 animate-fade-in" />
			<Hero title={name} />
			<div
				className="hidden w-screen h-px animate-glow md:block animate-fade-right
			bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0"
			/>
			<div className="my-16 mx-16 text-center animate-fade-in">
				<h2 className="text-sm md:text-md lg:text-xl text-zinc-500 text-balance">
					<Typewriter
						strings={quips}
						startDelay={3500}
						cursorClassName="text-zinc-300"
					/>
				</h2>
			</div>
		</section>
	);
}
