import { useMystery } from "~/hooks/mystery";

import { info } from "~/configs/resources";

import { Beam } from "~/components/beam";
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
			<Particles className="absolute inset-0 animate-fade-in" />
			<Navigation links={info.links} />
			<Beam className="mb-2" disappear="fade-left" />
			<Hero title={name} />
			<Beam className="mt-2" disappear="fade-right" />
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
