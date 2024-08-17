import { useMystery } from "~/hooks/mystery";

import { info } from "~/configs/resources";

import { Hero, name } from "~/components/hero";
import { Navigation } from "~/components/navigation";
import { Particles } from "~/components/particles";
import { Typewriter, quips } from "~/components/typewriter";
import { Beam } from "~/components/beam";

export default function Page() {
	useMystery();

	return (
		<section
			className="flex flex-col items-center justify-center w-screen h-screen
		overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black"
		>
			<Particles className="absolute inset-0 z-10 animate-fade-in" />
			<Navigation links={info.links} />
			<Beam className="mb-2" animation="fade-left" />
			<Hero title={name} />
			<Beam className="mt-2" animation="fade-right" />
			<Typewriter
				strings={quips}
				startDelay={3500}
				className="my-16 mx-16 text-center animate-fade-in text-sm
				md:text-md lg:text-xl text-zinc-500 text-balance"
				cursorClassName="text-zinc-300"
			/>
		</section>
	);
}
