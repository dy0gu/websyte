import { useMystery } from "~/hooks/mystery";

import { info } from "~/configs/resources";

import { Hero, name } from "~/components/hero";
import { Navigation } from "~/components/navigation";
import { Particles } from "~/components/particles";
import { Typewriter, quips } from "~/components/typewriter";

export default function Page() {
	useMystery();

	return (
		<section
			className="flex flex-col items-center justify-center w-screen h-screen
		overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black"
		>
			<Navigation links={info.links} />
			<div
				className="mx-16 mb-4 w-screen h-px animate-glow animate-fade-left
			 bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0"
			/>
			<Particles className="absolute inset-0 -z-10 animate-fade-in" />
			<Hero title={name} />
			<div
				className="mx-16 mt-4 w-screen h-px animate-glow animate-fade-right
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
