import { useMystery } from "~/hooks/mystery";

import { info } from "~/data/info";

import type { MetaFunction } from "@remix-run/node";
import { Beam } from "~/components/beam";
import { Hero, name } from "~/components/hero";
import { Navigation } from "~/components/navigation";
import { Particles } from "~/components/particles";
import { Typewriter, quips } from "~/components/typewriter";

export const meta: MetaFunction = ({ matches }) => {
	const parentMeta = matches
		.flatMap((match) => match.meta ?? [])
		.filter((meta) => !("title" in meta));
	return [...parentMeta, { title: `Home - ${info.name}` }];
};

export default function Page() {
	useMystery();

	return (
		<section className="flex flex-col items-center justify-center w-screen h-dvh overflow-hidden">
			<Particles className="absolute w-screen h-dvh animate-fade-in" />
			<Navigation links={info.links} />
			<Beam className="mb-2" disappear="fade-left" />
			<Hero letters={name} />
			<Beam className="mt-2" disappear="fade-right" />
			<Typewriter
				strings={quips}
				sequence="random"
				startDelay={3500}
				wrapperClassName="mt-16 mx-8 animate-fade-in text-sm
		md:text-md lg:text-xl text-zinc-400 text-balance"
				cursorClassName="text-zinc-300"
			/>
		</section>
	);
}
